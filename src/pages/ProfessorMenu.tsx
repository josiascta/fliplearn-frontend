import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfessorMenu() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const turmas = [
    { id: 1, nome: '6º Ano A' },
    { id: 2, nome: '6º Ano B' },
    { id: 3, nome: '7º Ano A' },
    { id: 4, nome: '8º Ano Robótica' },
  ];

  const options = [
    {
      label: 'Criar Turma',
      color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      path: '/create-class',
    },
    {
      label: 'Lista de Turmas',
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      path: '/class-list',
    },
    {
      label: 'Matérias',
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      path: '/subjects',
    },
    {
      label: 'Gerar Questões',
      color: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
      path: '/generate-questions',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-200 relative overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`bg-white shadow-lg h-full fixed top-0 left-0 z-30 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Turmas</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-lg font-bold"
            title="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-2">
          {turmas.map((turma) => (
            <button
              key={turma.id}
              onClick={() => navigate(`/class/${turma.id}`)}
              className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              {turma.nome}
            </button>
          ))}
        </div>
      </aside>

      {/* BOTÃO HAMBURGUER FIXO NO MEIO DA TELA */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-1/2 left-2 transform -translate-y-1/2 z-40 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition"
          title="Abrir menu"
        >
          ☰
        </button>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main
        className={`transition-all duration-300 ease-in-out flex-1
        ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        <div className="flex items-center justify-center h-screen px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Menu do Professor
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {options.map((option) => (
                <div
                  key={option.label}
                  onClick={() => navigate(option.path)}
                  className={`cursor-pointer p-6 rounded-xl shadow ${option.color}
                  transition transform hover:scale-[1.02]`}
                >
                  <h2 className="text-xl font-semibold">{option.label}</h2>
                  <p className="text-sm mt-2 text-gray-700">Clique para acessar</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
