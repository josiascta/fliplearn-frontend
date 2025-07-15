import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { BotaoPadrao } from "../components/BotaoPadrao";

export function NewCourseForm() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const professorId = session?.idUsuario;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState(1);
  const [error, setError] = useState("");

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
    };

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
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Nome</label>
        <input
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <textarea
          name="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Carga Horária</label>
        <input
          name="cargaHoraria"
          type="number"
          min={1}
          value={cargaHoraria}
          onChange={(e) => setCargaHoraria(Number(e.target.value))}
          required
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <BotaoPadrao>Criar Curso</BotaoPadrao>
    </form>
  );
}
