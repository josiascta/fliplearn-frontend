import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { BotaoPadrao } from "../components/BotaoPadrao";

type CursoDTO = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId: string;
};

export function ProfessorCursosPage() {
  const { session, isLoadingSession } = useAuth();
  const [cursos, setCursos] = useState<CursoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || session.cargos[0] !== "PROFESSOR") return;

    fetch("http://localhost:8080/cursos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data: CursoDTO[]) => {
        const cursosDoProfessor = data.filter(
          (curso) => curso.professorId === session.idUsuario
        );
        setCursos(cursosDoProfessor);
      })
      .catch((err) => {
        console.error("Erro ao buscar cursos:", err);
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (isLoadingSession) {
    return <p className="text-center mt-6">Verificando sessão...</p>;
  }

  if (!session) {
    return (
      <p className="text-center mt-6 text-red-600">Usuário não autenticado.</p>
    );
  }

  if (session.cargos[0] !== "PROFESSOR") {
    return (
      <p className="text-center mt-6 text-yellow-600">
        Acesso permitido apenas para professores.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Cursos</h1>
        <BotaoPadrao onClick={() => navigate("/novo-curso")}>
          Criar Novo Curso
        </BotaoPadrao>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregando cursos...</p>
      ) : cursos.length === 0 ? (
        <p className="text-gray-600">Você ainda não criou nenhum curso.</p>
      ) : (
        <ul className="space-y-4">
          {cursos.map((curso) => (
            <li
              key={curso.id}
              className="border rounded p-4 hover:shadow cursor-pointer transition"
              onClick={() => navigate(`/curso/${curso.id}`)}
            >
              <h2 className="text-lg font-semibold">{curso.nome}</h2>
              <p className="text-sm text-gray-700">
                {curso.descricao || "Sem descrição"}
              </p>
              <p className="text-sm text-gray-500">
                Carga horária: {curso.cargaHoraria}h
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
