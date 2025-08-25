import { 
  Box, Button, Card, CardContent, CircularProgress, 
  Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, Typography, Radio 
} from "@mui/material";
import { useEffect, useState } from "react";

type Option = { text: string; correct: boolean };
type Question = { text: string; options: Option[] };
type Quiz = { id: number; title: string; questions: Question[]; ativo?: boolean };

interface QuizSectionProps {
  cursoId: string;
  isProfessor?: boolean;
}

export function QuizSection({ cursoId, isProfessor = false }: QuizSectionProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);

  const quizzesParaAluno = isProfessor ? quizzes : quizzes.filter(q => q.ativo);

  // modal
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const endpoint = isProfessor
        ? `http://localhost:8080/api/quizzes/curso/${cursoId}`
        : `http://localhost:8080/api/quizzes/curso/${cursoId}/ativos`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      console.error("Erro ao buscar quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cursoId, isProfessor]);

  const handleSelect = (qIndex: number, optionText: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [`${qIndex}`]: optionText }));
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;
    let pontos = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      const chosen = selectedAnswers[`${idx}`];
      const correct = q.options.find((o) => o.correct);
      if (chosen === correct?.text) pontos++;
    });
    setScore(pontos);
  };

  const handleCreateQuiz = () => setOpen(true);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [
          { text: "A", correct: false },
          { text: "B", correct: false },
          { text: "C", correct: false },
          { text: "D", correct: false }
        ]
      }
    ]);
  };

  const handleApplyQuiz = async (quizId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/quizzes/${quizId}/publicar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());
      alert("Quiz publicado com sucesso!");

      await fetchQuizzes(); // Atualiza a lista de quizzes (aluno ou professor)
    } catch (err) {
      console.error("Erro ao publicar quiz:", err);
      alert("Erro ao publicar quiz: " + err);
    }
  };

  const handleSaveQuiz = async () => {
    if (!title.trim()) { alert("O título do quiz é obrigatório."); return; }
    if (questions.length === 0) { alert("Adicione pelo menos uma pergunta."); return; }
    if (!cursoId) { alert("Curso inválido."); return; }

    const quizDTO = {
      title: title.trim(),
      cursoId: Number(cursoId),
      questions: questions.map((q) => ({
        text: q.text.trim(),
        options: q.options.map((o) => ({ text: o.text.trim(), correct: o.correct })),
      })),
      ativo: false,
    };

    try {
      const res = await fetch("http://localhost:8080/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(quizDTO),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const savedQuiz = await res.json();
      setQuizzes([...quizzes, { ...savedQuiz, ativo: savedQuiz.ativo ?? false }]);
      setOpen(false);
      setTitle("");
      setQuestions([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar o quiz: " + err);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm("Tem certeza que deseja deletar este quiz?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/quizzes/${quizId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error(await res.text());
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar quiz: " + err);
    }
  };

  if (loading) return (
    <Box textAlign="center" mt={4}>
      <CircularProgress />
      <Typography mt={2}>Carregando quizzes...</Typography>
    </Box>
  );

return (
  <Box>
    {/* Cabeçalho */}
    <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h5">Quizzes</Typography>
      {isProfessor && (
        <Button variant="contained" color="secondary" onClick={handleCreateQuiz}>
          Criar Quiz
        </Button>
      )}
    </Box>

    {/* Lista de quizzes */}
    {!selectedQuiz ? (
      <>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              sx={{
                mb: 2,
                opacity: !quiz.ativo && !isProfessor ? 0.5 : 1,
                pointerEvents: !quiz.ativo && !isProfessor ? "none" : "auto",
              }}
            >
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight={600}>{quiz.title}</Typography>
                <Box>
                  {isProfessor ? (
                    <>
                      <Button variant="outlined" color="success" onClick={() => handleApplyQuiz(quiz.id)}>
                        Aplicar
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteQuiz(quiz.id)}>
                        Deletar
                      </Button>
                    </>
                  ) : quiz.ativo ? (
                    <Button variant="contained" onClick={() => setSelectedQuiz(quiz)}>
                      Abrir
                    </Button>
                  ) : (
                    <Typography color="textSecondary">Quiz indisponível no momento</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>Nenhum quiz cadastrado para este curso.</Typography>
        )}
      </>
    ) : (
      <>
        {/* Quiz selecionado */}
        <Typography variant="h6" mb={2}>{selectedQuiz.title}</Typography>
        {selectedQuiz.questions.map((q, qIndex) => (
          <Card key={qIndex} sx={{ mb: 3 }}>
            <CardContent>
              <Typography fontWeight={600}>{q.text}</Typography>
              {q.options.map((opt, oIndex) => (
                <Button
                  key={oIndex}
                  variant={selectedAnswers[`${qIndex}`] === opt.text ? "contained" : "outlined"}
                  onClick={() => handleSelect(qIndex, opt.text)}
                  sx={{ display: "block", mb: 1 }}
                >
                  {opt.text}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
        <Button variant="contained" onClick={handleSubmit}>Enviar Respostas</Button>
        {score !== null && (
          <Typography mt={2}>
            Você acertou {score} de {selectedQuiz.questions.length} questões!
          </Typography>
        )}
        <Button sx={{ mt: 2 }} onClick={() => setSelectedQuiz(null)}>Voltar</Button>
      </>
    )}

    {/* Modal de criação */}
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>Criar Novo Quiz</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Título do Quiz"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {questions.map((q, qIndex) => (
          <Box key={qIndex} mb={3}>
            <TextField
              fullWidth
              label={`Pergunta ${qIndex + 1}`}
              margin="normal"
              value={q.text}
              onChange={(e) => {
                const updated = [...questions];
                updated[qIndex].text = e.target.value;
                setQuestions(updated);
              }}
            />
            {q.options.map((opt, oIndex) => (
              <Box key={oIndex} display="flex" alignItems="center" gap={1}>
                <Radio
                  checked={opt.correct}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qIndex].options.forEach((o) => (o.correct = false));
                    updated[qIndex].options[oIndex].correct = true;
                    setQuestions(updated);
                  }}
                />
                <TextField
                  fullWidth
                  label={`Opção ${String.fromCharCode(65 + oIndex)}`}
                  margin="normal"
                  value={opt.text}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIndex].options[oIndex].text = e.target.value;
                    setQuestions(updated);
                  }}
                />
              </Box>
            ))}
          </Box>
        ))}
        <Button variant="outlined" onClick={addQuestion}>Adicionar Pergunta</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={handleSaveQuiz}>Salvar Quiz</Button>
      </DialogActions>
    </Dialog>
  </Box>
);
}