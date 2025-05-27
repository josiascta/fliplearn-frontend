import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Course {
  id: string;
  title: string;
  description: string;
  color: string;
}

export function StudentMenu() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);

        // Simulando chamada API - substitua essa URL pelo endpoint real
        const response = await fetch("http://localhost:8080/cursos"); 

        if (!response.ok) {
          throw new Error("Erro ao carregar cursos");
        }

        const data = await response.json();

        // Supondo que data seja um array de cursos com os mesmos campos
        setCourses(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Meus Cursos</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de estudos!</p>
      </header>

      <main className="flex flex-grow gap-6">
        {/* Lista de cursos */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && <p>Carregando cursos...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && courses.length === 0 && <p>Nenhum curso disponível.</p>}

          {!loading && !error && courses.map(({ id, title, description, color }) => (
            <div
              key={id}
              className={`rounded-lg shadow-md p-6 text-white cursor-pointer ${color} hover:brightness-110 transition`}
              onClick={() => navigate(`/aluno/cursos/${id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-sm">{description}</p>
            </div>
          ))}
        </section>

        {/* Menu lateral */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 flex flex-col gap-4">
          <button
            className="py-2 px-4 text-left rounded hover:bg-gray-100 transition"
            onClick={() => navigate("/aluno/perfil")}
          >
            Perfil
          </button>

          <button
            className="py-2 px-4 text-left rounded hover:bg-gray-100 transition"
            onClick={() => navigate("/aluno/materiais")}
          >
            Materiais
          </button>

          <button
            className="py-2 px-4 text-left rounded hover:bg-gray-100 transition text-red-600 font-semibold"
            onClick={handleLogout}
          >
            Sair
          </button>
        </aside>
      </main>
    </div>
  );
}
