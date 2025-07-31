import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import { capitalizar } from "../utils/capitalizar";

type CursoDTO = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId?: string;
  cor: string;
  quantidadeAlunos: number;
};

const colorClasses: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  indigo: "bg-indigo-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
  gray: "bg-gray-500",
};

export function Home() {
  const { session, isLoadingSession } = useAuth();
  const [cursos, setCursos] = useState<CursoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState("");
  const navigate = useNavigate();
  const [progressoCursos, setProgressoCursos] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!session) return;

    const url =
      session.role === "PROFESSOR"
        ? `http://localhost:8080/professor/${session.idUsuario}/cursos`
        : `http://localhost:8080/aluno/${session.idUsuario}/cursos`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data: CursoDTO[]) => {
        setCursos(data);
        if (session.role === "ALUNO") {
          const promises = data.map((curso) =>
            fetch(
              `http://localhost:8080/progresso/${session.idUsuario}/curso/${curso.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
              .then((res) => (res.ok ? res.json() : null))
              .then((progresso) => ({
                cursoId: curso.id,
                progresso: progresso?.percentualConcluido || 0,
              }))
          );

          Promise.all(promises).then((resultados) => {
            const progressoMap: Record<string, number> = {};
            resultados.forEach((item) => {
              if (item) progressoMap[item.cursoId] = item.progresso;
            });
            setProgressoCursos(progressoMap);
          });
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar cursos:", err);
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (isLoadingSession) {
    return <h1></h1>;
  }

  if (!session) {
    return <h1></h1>;
  }

  const cursosFiltrados = cursos.filter((curso) =>
    curso.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  console.log(cursos);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard do {capitalizar(session.role)}
          </h1>
          <p className="text-gray-600 text-lg">
            {session.role === "ALUNO"
              ? "Acesse seus cursos e acompanhe seu progresso"
              : "Gerencie seus cursos e acompanhe o progresso dos alunos"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-book text-blue-600 text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {cursos.length}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Cursos Ativos</h3>
            <p className="text-sm text-gray-600">+{cursos.length} este mês</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-green-600 text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="font-semibold text-gray-900">
              {session.role === "PROFESSOR"
                ? "Alunos Ativos"
                : "Questionários feitos"}
            </h3>
            <p className="text-sm text-gray-600">+0 esta semana</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">0%</span>
            </div>
            <h3 className="font-semibold text-gray-900">Engajamento</h3>
            <p className="text-sm text-gray-600">+0% vs mês anterior</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-trophy text-orange-600 text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="font-semibold text-gray-900">
              {session.role === "PROFESSOR"
                ? "Pontos Dados"
                : "Pontos Recebidos"}{" "}
            </h3>
            <p className="text-sm text-gray-600">Esta semana</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((course, index) => (
            <Link
              to={`/curso/${course.id}`}
              key={index}
              className="block bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer no-underline"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-${course.cor}-100 rounded-xl flex items-center justify-center`}
                >
                  <i
                    className={`fas fa-book-open text-${course.cor}-600 text-xl`}
                  ></i>
                </div>
                {session.role === "ALUNO" && (
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-trophy text-yellow-400"></i>
                    <span className="text-sm font-medium">1°</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {course.nome}
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-users text-gray-400 text-sm"></i>
                  <span className="text-sm text-gray-600">
                    {course.quantidadeAlunos} alunos
                  </span>
                </div>
              </div>
              {session.role === "ALUNO" && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso Médio</span>
                    <span className="font-medium">
                      {progressoCursos[course.id] || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${course.cor}-500 h-2 rounded-full`}
                      style={{ width: `${progressoCursos[course.id] || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium transition-colors !rounded-button whitespace-nowrap text-center">
                {session.role === "ALUNO"
                  ? "Continuar curso"
                  : "Gerenciar curso"}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {session.role === "PROFESSOR" && (
        <button
          onClick={() => navigate("/novo-curso")}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      )}
    </div>
  );
}
