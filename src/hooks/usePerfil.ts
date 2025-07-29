import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

type PerfilDTO = {
  idUsuario: number;
  nome: string;
  email: string;
  telefone: string;
  sobrenome?: string;
  fotoUrl: string;
  formacao?: string; // pode não existir no aluno
  dataDeNascimento: Date;
};

export function usePerfil() {
  const { session } = useAuth();
  const [perfil, setPerfil] = useState<PerfilDTO | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerfil() {
      if (!session?.idUsuario || !session?.role) return;

      const endpoint =
        session.role === "PROFESSOR"
          ? `http://localhost:8080/professor/${session.idUsuario}`
          : `http://localhost:8080/aluno/${session.idUsuario}`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar perfil");
        const data = await response.json();
        setPerfil(data);
      } catch (error: any) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, [session?.idUsuario, session?.role]);

  return { perfil, erro, loading };
}
