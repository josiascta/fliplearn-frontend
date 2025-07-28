import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";

type CursoDTO = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId?: string;
  cor: string;
};

export function DashboardAlunos() {
  const { session, isLoadingSession } = useAuth();
  const [cursos, setCursos] = useState<CursoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) return;

    const url = `http://localhost:8080/aluno/${session.idUsuario}/cursos`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data: CursoDTO[]) => {
        setCursos(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar cursos:", err);
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (isLoadingSession || !session) return <h1></h1>;

  const cursosFiltrados = cursos.filter((curso) =>
    curso.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard do Aluno
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe seu progresso e gerencie seus cursos matriculados
          </p>
        </div>

        {/* Métricas */}
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
            <h3 className="font-semibold text-gray-900">Cursos Matriculados</h3>
            <p className="text-sm text-gray-600">Até o momento</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">67%</span>
            </div>
            <h3 className="font-semibold text-gray-900">Progresso Médio</h3>
            <p className="text-sm text-gray-600">Em todos os cursos</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-tasks text-yellow-600 text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">34</span>
            </div>
            <h3 className="font-semibold text-gray-900">
              Atividades Concluídas
            </h3>
            <p className="text-sm text-gray-600">Nos últimos 30 dias</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-medal text-purple-600 text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">5</span>
            </div>
            <h3 className="font-semibold text-gray-900">Conquistas</h3>
            <p className="text-sm text-gray-600">Desbloqueadas</p>
          </div>
        </div>

        {/* Lista de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((course) => (
            <Link
              to={`/curso/${course.id}`}
              key={course.id}
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
                <div className="flex items-center space-x-1">
                  <i className="fas fa-chart-line text-purple-500"></i>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {course.nome}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.descricao || "Sem descrição disponível."}
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${course.cor}-500 h-2 rounded-full`}
                    style={{ width: `78%` }}
                  ></div>
                </div>
              </div>
              <div className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium transition-colors text-center">
                Ver Curso
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/explorar")}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
      >
        <i className="fas fa-compass text-xl"></i>
      </button>
    </div>
  );
}
