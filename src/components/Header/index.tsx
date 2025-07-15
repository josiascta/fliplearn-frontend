import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Props = {
  title: string;
};

export function Header({ title }: Props) {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.sub;

        const response = await fetch(`http://localhost:8080/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar informações do usuário");
        }

        const data = await response.json();
        setUserName(data.nome || data.name || "Usuário");
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setUserName("Usuário");
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Olá, {userName ?? "..."}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
