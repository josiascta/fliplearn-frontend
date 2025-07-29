import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePerfil } from "../hooks/usePerfil";

export default function Perfil() {
  const { logout, session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: session?.idUsuario,
    nome: session?.nome,
    sobrenome: session?.sobrenome,
    email: session?.email,
    role: session?.role,
    dataNascimento: "1985-03-15",
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({ ...userInfo });
  };

  const handleSave = () => {
    setUserInfo({ ...editedInfo });
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-green-500 mr-3"></i>
            <span className="text-green-800 font-medium">
              Perfil atualizado com sucesso!
            </span>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-user text-4xl text-gray-400"></i>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {userInfo.nome} {userInfo.sobrenome}
            </h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                userInfo.role === "PROFESSOR"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <i
                className={`fas ${
                  userInfo.role === "PROFESSOR"
                    ? "fa-chalkboard-teacher"
                    : "fa-user-graduate"
                } mr-2`}
              ></i>
              {userInfo.role}
            </span>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Informações Pessoais
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID do Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-id-card mr-2 text-gray-400"></i>
                ID do Usuário
              </label>
              <input
                type="text"
                value={userInfo.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
              />
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-user mr-2 text-gray-400"></i>
                Nome
              </label>
              <input
                type="text"
                value={isEditing ? editedInfo.nome : userInfo.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>

            {/* Sobrenome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-user mr-2 text-gray-400"></i>
                Sobrenome
              </label>
              <input
                type="text"
                value={isEditing ? editedInfo.sobrenome : userInfo.sobrenome}
                onChange={(e) => handleInputChange("sobrenome", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-envelope mr-2 text-gray-400"></i>
                Email
              </label>
              <input
                type="email"
                value={isEditing ? editedInfo.email : userInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-user-tag mr-2 text-gray-400"></i>
                Função
              </label>
              <input
                type="text"
                value={userInfo.role}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                Data de Nascimento
              </label>
              <input
                type="date"
                value={
                  isEditing
                    ? editedInfo.dataNascimento
                    : userInfo.dataNascimento
                }
                onChange={(e) =>
                  handleInputChange("dataNascimento", e.target.value)
                }
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="!rounded-button whitespace-nowrap cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="!rounded-button whitespace-nowrap cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <i className="fas fa-save mr-2"></i>
                  Salvar Alterações
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Editar
                </button>
                <button
                  onClick={logout}
                  className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2.5 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
