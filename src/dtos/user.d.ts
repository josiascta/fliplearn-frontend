type UserRole = "PROFESSOR" | "ALUNO";

type UserAPIResponse = {
  idUsuario: string;
  nome: string;
  sobrenome: string;
  email: string;
  role: UserRole;
};
