import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CriarTurma() {
  const navigate = useNavigate();
  const [nomeTurma, setNomeTurma] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anoSerie, setAnoSerie] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert(`Turma criada:\nNome: ${nomeTurma}\nDescrição: ${descricao}\nAno/Série: ${anoSerie}`);
    navigate('/menu-professor');
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md max-w-md w-full space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Criar Nova Turma</h1>

        <div>
          <label htmlFor="nomeTurma" className="block mb-1 font-semibold">
            Nome da Turma
          </label>
          <input
            id="nomeTurma"
            type="text"
            value={nomeTurma}
            onChange={(e) => setNomeTurma(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block mb-1 font-semibold">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="anoSerie" className="block mb-1 font-semibold">
            Ano/Série
          </label>
          <input
            id="anoSerie"
            type="text"
            value={anoSerie}
            onChange={(e) => setAnoSerie(e.target.value)}
            placeholder="Ex: 1º Ano, 2º Ano, 3º Ano"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Salvar Turma
        </button>
      </form>
    </div>
  );
}
