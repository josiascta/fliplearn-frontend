type UserAPIRole = "PROFESSOR" | "ALUNO";

type UserAPIResponse = {
  idUsuario: string;
  nome: string;
  sobrenome: string;
  login: string;
  cargos: UserAPIRole[];
};
