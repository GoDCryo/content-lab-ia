export type Briefing = {
  nicho: string;
  publicoAlvo: string;
  plataforma: string;
  objetivo: string;
  tomDeVoz: string;
  produtoServico: string;
  temaPrincipal: string;
  frequencia: string;
};

export type IdeiaConteudo = {
  numero: number;
  ideia: string;
  formato: string;
  objetivo: string;
  observacao: string;
};

export type Roteiro = {
  titulo: string;
  gancho: string;
  roteiro: string;
  ctaSugerido: string;
};

export type Legenda = {
  titulo: string;
  legenda: string;
  tom: string;
};

export type CTA = {
  tipo: string;
  texto: string;
  quandoUsar: string;
};

export type ContentLabResult = {
  resumoBriefing: string;
  ideias: IdeiaConteudo[];
  ganchos: string[];
  roteiros: Roteiro[];
  legendas: Legenda[];
  ctas: CTA[];
  checklist: string[];
};