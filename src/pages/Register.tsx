import React, { useState } from "react";
import { useNavigate } from "react-router";
import { z, ZodError } from "zod";
import { ToastContainer, toast } from "react-toastify";

const loginSchema = z
  .object({
    nome: z.string().trim().min(1, { message: "Informe o nome" }),
    sobrenome: z.string().trim().min(1, { message: "Informe o sobrenome" }),
    email: z.string().email({ message: "E-mail inválido" }),
    senha: z
      .string()
      .min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
    confirmSenha: z.string(),
    tipoUsuario: z.enum(["aluno", "professor"]),
    dataDeNascimento: z
      .string()
      .min(1, { message: "Informe a data de nascimento" }),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: "As senhas não são iguais",
    path: ["confirmSenha"],
  });

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<"aluno" | "professor">(
    "aluno"
  );
  const [dataDeNascimento, setDataDeNascimento] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = loginSchema.parse({
        nome,
        sobrenome,
        email,
        senha,
        confirmSenha,
        tipoUsuario,
        dataDeNascimento,
      });
      const cargo = data.tipoUsuario === "professor" ? "PROFESSOR" : "ALUNO";

      console.log(data);

      const corpoAluno = {
        email: data.email,
        senha: data.senha,
        graduacao: "Graduação de " + data.nome,
        nome: data.nome,
        sobrenome: data.sobrenome,
        dataDeNascimento: new Date(data.dataDeNascimento),
        role: cargo,
      };
      const corpoProfessor = {
        email: data.email,
        senha: data.senha,
        nome: data.nome,
        sobrenome: data.sobrenome,
        dataDeNascimento: new Date(data.dataDeNascimento),
        role: cargo,
      };
      const endpoint =
        data.tipoUsuario === "aluno"
          ? "http://localhost:8080/auth/registerAluno"
          : "http://localhost:8080/auth/registerProfessor";
      const corpoParaEnvio =
        data.tipoUsuario === "aluno" ? corpoAluno : corpoProfessor;

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpoParaEnvio),
      });

      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error("Não foi possível cadastrar!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-plus text-white text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Crie sua conta
            </h2>
            <p className="text-gray-600">
              Junte-se à revolução educacional com IA
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Usuário
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("aluno")}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      tipoUsuario === "aluno"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <i className="fas fa-user-graduate text-lg mb-1"></i>
                    <div className="text-sm font-medium">Aluno</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("professor")}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      tipoUsuario === "professor"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <i className="fas fa-chalkboard-teacher text-lg mb-1"></i>
                    <div className="text-sm font-medium">Professor</div>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={dataDeNascimento}
                  onChange={(e) => setDataDeNascimento(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:outline-none focus:ring-blue-500 mt-1"
                required
              />
              <span className="ml-3 text-sm text-gray-600">
                Eu concordo com os{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Política de Privacidade
                </a>
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 !rounded-button whitespace-nowrap cursor-pointer"
            >
              Criar Conta
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={1500} />
    </div>
  );
}