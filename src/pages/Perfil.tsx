import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();

  // Dados do professor simulados
  const professor = {
    nome: 'Dudu',
    email: 'dudu@escola.com',
    telefone: '(11) 40028922',
    departamento: 'Matemática',
    formacao: 'Licenciatura em Matemática',
    endereco: 'Sumé-PB',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };

  function handleEditarPerfil() {
    navigate('/editar-perfil');
  }

  function handleSair() {
    // Logout real aqui
    navigate('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Perfil do Professor</h1>

        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
          {/* Foto no canto superior esquerdo */}
          <img
            src={professor.fotoUrl}
            alt="Foto do Professor"
            className="w-32 h-32 rounded-full object-cover shadow-md mb-6 sm:mb-0"
          />

          {/* Informações ao lado */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900">Nome</h3>
                <p>{professor.nome}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p>{professor.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Telefone</h3>
                <p>{professor.telefone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Departamento</h3>
                <p>{professor.departamento}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Formação</h3>
                <p>{professor.formacao}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Endereço</h3>
                <p>{professor.endereco}</p>
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleEditarPerfil}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              >
                Editar Perfil
              </button>
              <button
                onClick={handleSair}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
