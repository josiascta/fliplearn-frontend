import { useEffect, useState } from "react";

type Aluno = {
  idUsuario: string;
  nome: string;
  sobrenome: string;
  login: string;
};

type CursoDetail = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId: string;
};

type Props = {
  cursoId: string;
};

export function CourseDetail({ cursoId }: Props) {
  const [curso, setCurso] = useState<CursoDetail | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [todosAlunos, setTodosAlunos] = useState<Aluno[]>([]);
  const [activeTab, setActiveTab] = useState<"inicio" | "materiais" | "alunos">(
    "inicio"
  );

  useEffect(() => {
    fetch(`/cursos/${cursoId}`)
      .then((res) => res.json())
      .then(setCurso);
  }, [cursoId]);

  useEffect(() => {
    if (activeTab === "alunos") {
      fetch(`/cursos/${cursoId}/alunos`)
        .then((res) => res.json())
        .then(setAlunos);

      fetch("/alunos")
        .then((res) => res.json())
        .then(setTodosAlunos);
    }
  }, [activeTab, cursoId]);

  const handleAddAluno = async (idAluno: string) => {
    await fetch(`/cursos/${cursoId}/alunos/${idAluno}`, {
      method: "POST",
    });
    const updated = await fetch(`/cursos/${cursoId}/alunos`).then((r) =>
      r.json()
    );
    setAlunos(updated);
  };

  if (!curso) return <p>Carregando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{curso.nome}</h1>
        <nav className="mt-2 space-x-4">
          {["inicio", "materiais", "alunos"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`pb-1 border-b-2 ${
                activeTab === t
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent"
              }`}
            >
              {t === "inicio"
                ? "Início"
                : t === "materiais"
                ? "Materiais"
                : "Alunos"}
            </button>
          ))}
        </nav>
      </header>

      <section className="space-y-4">
        {activeTab === "inicio" && (
          <div>
            <p>
              <strong>Descrição:</strong> {curso.descricao || "—"}
            </p>
            <p>
              <strong>Carga horária:</strong> {curso.cargaHoraria}
            </p>
          </div>
        )}

        {activeTab === "materiais" && <p>📂 Área de materiais em construção</p>}

        {activeTab === "alunos" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Alunos Matriculados</h2>
              <div>
                <select id="selectAluno" className="border rounded px-2 py-1">
                  <option value="">Selecionar aluno...</option>
                  {todosAlunos
                    .filter(
                      (a) => !alunos.some((b) => b.idUsuario === a.idUsuario)
                    )
                    .map((a) => (
                      <option key={a.idUsuario} value={a.idUsuario}>
                        {a.nome} {a.sobrenome} ({a.login})
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    const sel = document.getElementById(
                      "selectAluno"
                    ) as HTMLSelectElement;
                    if (sel.value) handleAddAluno(sel.value);
                  }}
                  className="ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
            <ul className="list-disc pl-5">
              {alunos.map((a) => (
                <li key={a.idUsuario}>
                  {a.nome} {a.sobrenome} — {a.login}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
