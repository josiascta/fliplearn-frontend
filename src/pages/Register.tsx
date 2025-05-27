import { useNavigate } from "react-router";
import { useState } from "react";
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
    graduacao: z.string().optional(),
    dataDeNascimento: z
      .string()
      .min(1, { message: "Informe a data de nascimento" }),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: "As senhas não são iguais",
    path: ["confirmSenha"],
  });
// .refine((data) => data.tipoUsuario !== "aluno" || data.graduacao?.trim(), {
//   message: "Informe a graduação",
//   path: ["graduacao"],
// });

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [graduacao, setGraduacao] = useState("");
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
        graduacao,
        dataDeNascimento,
      });

      const cargo = data.tipoUsuario === "professor" ? 1 : 2;

      const corpoAluno = {
        login: data.email,
        senha: data.senha,
        nome: data.nome,
        sobrenome: data.sobrenome,
        graduacao: data.graduacao,
        dataDeNascimento: new Date(data.dataDeNascimento),
        cargos: [cargo],
      };

      const corpoProfessor = {
        login: data.email,
        senha: data.senha,
        nome: data.nome,
        sobrenome: data.sobrenome,
        dataDeNascimento: new Date(data.dataDeNascimento),
        cargos: [cargo],
      };

      const endpoint =
        data.tipoUsuario === "aluno"
          ? "http://localhost:8080/auth/registerAluno"
          : "http://localhost:8080/auth/registerProfessor";

      const corpoParaEnvio =
        data.tipoUsuario === "aluno" ? corpoAluno : corpoProfessor;

      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Criar uma Conta</h1>
          <p className="text-gray-500">Cadastre-se para começar</p>

          <form onSubmit={onSubmit} className="mt-6">
            <div className="flex gap-1.5">
              <div className="mb-4">
                <label className="block text-sm font-medium">Nome:</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Digite seu nome"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Sobrenome:</label>
                <input
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  required
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Digite seu sobrenome"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">E-mail:</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Tipo de Usuário:
              </label>
              <select
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
              </select>
            </div>

            {/* {tipoUsuario === "aluno" && (
              <div className="mb-4">
                <label className="block text-sm font-medium">Graduação:</label>
                <input
                  value={graduacao}
                  onChange={(e) => setGraduacao(e.target.value)}
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Digite sua graduação"
                />
              </div>
            )} */}

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Data de Nascimento:
              </label>
              <input
                value={dataDeNascimento}
                onChange={(e) => setDataDeNascimento(e.target.value)}
                required
                type="date"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex gap-1">
              <div className="mb-4">
                <label className="block text-sm font-medium">Senha:</label>
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  type="password"
                  className="w-full p-2 border rounded-md"
                  placeholder="Digite sua senha"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Confirmar Senha:
                </label>
                <input
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  required
                  type="password"
                  className="w-full p-2 border rounded-md"
                  placeholder="Confirme sua senha"
                />
              </div>
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
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <a href="#" className="font-bold" onClick={() => navigate("/")}>
              Entrar
            </a>
          </p>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <img
          src="/Login.png"
          alt="Imagem de cadastro"
          className="w-full h-full object-cover"
        />
      </div>

      <ToastContainer position="top-center" theme="dark" autoClose={1500} />
    </div>
  );
}
