import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function NewCourseForm() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const professorId = session?.idUsuario;
  const [showSuccess, setShowSuccess] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState(0);
  const [cor, setCor] = useState("blue");
  const [error, setError] = useState("");

  const courseColors = [
    { value: "blue", label: "Azul", class: "bg-blue-500" },
    { value: "red", label: "Vermelho", class: "bg-red-500" },
    { value: "green", label: "Verde", class: "bg-green-500" },
    { value: "yellow", label: "Amarelo", class: "bg-yellow-500" },
    { value: "purple", label: "Roxo", class: "bg-purple-500" },
    { value: "pink", label: "Rosa", class: "bg-pink-500" },
    { value: "indigo", label: "Índigo", class: "bg-indigo-500" },
    { value: "teal", label: "Teal", class: "bg-teal-500" },
    { value: "orange", label: "Laranja", class: "bg-orange-500" },
    { value: "gray", label: "Cinza", class: "bg-gray-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!professorId) {
      setError("Usuário não autenticado como professor.");
      return;
    }

    const curso = {
      nome,
      descricao,
      cargaHoraria,
      professorId,
      cor,
    };

    console.log(cor);

    try {
      const res = await fetch("http://localhost:8080/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(curso),
      });

      if (!res.ok) throw new Error("Erro ao criar curso");

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-green-500 mr-3"></i>
            <span className="text-green-800 font-medium">
              Curso criado com sucesso!
            </span>
          </div>
        </div>
      )}

      {/* Course Creation Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Criar Novo Curso
        </h1>
        <p className="text-gray-600">
          Configure os dados da sua nova sala de aula
        </p>
      </div>

      {/* Course Creation Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Informações do Curso
            </h3>
          </div>

          <div className="space-y-6">
            {/* Nome do Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-book mr-2 text-gray-400"></i>
                Nome do Curso
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do curso"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-align-left mr-2 text-gray-400"></i>
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o conteúdo e objetivos do curso"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 resize-none"
              />
            </div>

            {/* Carga Horária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-clock mr-2 text-gray-400"></i>
                Carga Horária
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={cargaHoraria}
                  onChange={(e) => setCargaHoraria(Number(e.target.value))}
                  placeholder="0"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">horas</span>
                </div>
              </div>
            </div>

            {/* Cor do Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-palette mr-2 text-gray-400"></i>
                Cor do Curso
              </label>
              <div className="grid grid-cols-5 gap-3">
                {courseColors.map((color) => (
                  <div
                    key={color.value}
                    onClick={() => setCor(color.value)}
                    className={`cursor-pointer relative rounded-lg p-4 border-2 transition-all duration-200 ${
                      cor === color.value
                        ? "border-gray-900  ring-gray-900 ring-offset-2"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-full h-8 rounded ${color.class} mb-2`}
                    ></div>
                    <div className="text-xs text-gray-700 text-center font-medium">
                      {color.label}
                    </div>
                    {cor === color.value && (
                      <div className="absolute top-2 right-2">
                        <i className="fas fa-check text-gray-900"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="!rounded-button whitespace-nowrap cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-sm font-medium transition-colors duration-200"
            >
              <i className="fas fa-times mr-2"></i>
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!nome || !descricao || !cargaHoraria}
              className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 text-sm font-medium transition-colors duration-200"
            >
              <i className="fas fa-plus mr-2"></i>
              Criar Curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
