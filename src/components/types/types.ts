export type CursoDTO = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId?: string;
};


export type VideoAulaDTO = {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  thumbnailUrl: string;
  dataPublicacao: string;
  dataAtualizacao: string;
  professorId: number;
  moduloId: number;
  minutos: string;
};
export type ModuloDTO = {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  cursoId: number;
};

export type AlunoDTO = {
  idUsuario: number;
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  dataDeNascimento: string;
  formacao: string;
};

export type ProgressoDTO = {
  id: number;
  alunoId: number;
  cursoId: number;
  percentualConcluido: number;
  dataUltimaAtividade: string;
  status: string;
};