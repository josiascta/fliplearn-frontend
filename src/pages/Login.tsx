import { useNavigate } from "react-router";
import { useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";

type CustomJwtPayload = JwtPayload & {
  role: string;
};

type Login = {
  email: string;
  senha: string;
};

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { save } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function login(loginDTO: Login) {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDTO),
      });

      if (!response.ok) throw new Error("Erro ao fazer login");

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

      if (!responseInfoUser.ok) throw new Error("Erro ao buscar informações");

      const reponseJson = await responseInfoUser.json();
      save(reponseJson);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginDTO: Login = { email, senha };
    await login(loginDTO);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-graduation-cap text-white text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600">
              Entre na sua conta para continuar aprendendo
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  text-sm"
                  placeholder="seu@email.com"
                  required
                />
                <i className="fas fa-envelope absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Esqueci minha senha
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer"
            >
              Entrar
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Cadastre-se gratuitamente
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="dark" autoClose={1500} />
    </div>
  );
}
