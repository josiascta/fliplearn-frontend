import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePerfil } from '../hooks/usePerfil';


export default function Perfil() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { perfil: usuario, erro } = usePerfil();



  function handleEditarPerfil() {
    navigate('/editar-perfil');
  }

  function handleSair() {
    logout();               // Limpa token e estado
    navigate('/');     // Redireciona
  }

  if (erro) return <div className="text-center text-red-600 p-6">{erro}</div>;
  if (!usuario) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Perfil</h1>

        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
          <img
            src={usuario.fotoUrl}
            alt="Foto"
            className="w-32 h-32 rounded-full object-cover shadow-md mb-6 sm:mb-0"
          />

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900">Nome</h3>
                <p>{usuario.nome} {usuario.sobrenome}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p>{usuario.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Telefone</h3>
                <p>{usuario.telefone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Formação</h3>
                <p>{usuario.formacao}</p>
              </div>
            </div>

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
