import { useNavigate } from "react-router";
import { useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";

type CustomJwtPayload = JwtPayload & {
  roles?: string[];
};

type Login = {
  login: string;
  senha: string;
};

export function Login() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { save } = useAuth();
  const [loading, setLoading] = useState(false);

  async function login(loginDTO: Login) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await fetch("http://localhost:8080/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDTO),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }

      const token = await response.text();
      localStorage.setItem("token", token);

      const decoded: CustomJwtPayload = jwtDecode(token);
      const idUser = decoded.sub;

      const responseInfoUser = await fetch(
        `http://localhost:8080/auth/${idUser}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const reponseJson = await responseInfoUser.json();
      if (!response.ok) {
        throw new Error("Erro ao obter informações do usuário");
      }

      save(reponseJson);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginDTO: Login = { login: nome, senha: senha };
    await login(loginDTO);
  };

  return (
    <div className="flex h-screen">
      {/* Formulário */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Bem-vindo!</h1>
          <p className="text-gray-500">Faça login para continuar</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium">E-mail</label>
              <input
                onChange={(e) => setNome(e.target.value)}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Digite seu e-mail"
                value={nome}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Senha</label>
              <input
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                className="w-full p-2 border rounded-md"
                placeholder="Digite sua senha"
                value={senha}
              />
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-white transition-all 
                ${
                  loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <div>
            <p className="mt-4 text-center text-sm">
              Ainda não tem uma conta?{" "}
              <a
                href="#"
                className="font-bold"
                onClick={() => navigate("/register")}
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <img
          src="/Login.png"
          alt="Placeholder Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
