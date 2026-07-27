import type { VinculoItem } from "./consultores";

/**
 * Mock data para a página de detalhe de sócios.
 * Os IDs correspondem aos nós com `tipo: "socio"` nas árvores organizacionais
 * de pvs.ts (PV-1042, PV-1055, PV-2091).
 */

export type SocioStatus = "Ativo" | "Inativo";

export interface SocioDetalhe {
  id: string;
  nome: string;
  documento: string;
  nivelLabel: string;
  status: SocioStatus;
  /** PV ao qual o sócio está vinculado. */
  pv: { id: string; nome: string };
  /** Unidade mãe do PV. */
  unidade: { id: string; nome: string };
  participacaoPct: number;
  comissaoPct: number;
  /** Data de ingresso na sociedade. */
  ingressoSociedade: string;
  /** Vínculos (PVs e matrículas associados ao CPF do sócio). */
  vinculos: VinculoItem[];
}

export const sociosDetalhe: Record<string, SocioDetalhe> = {
  "S-PV1042-01": {
    id: "S-PV1042-01",
    nome: "Carlos Oliveira",
    documento: "123.456.789-00",
    nivelLabel: "Sócio Administrador",
    status: "Ativo",
    pv: { id: "PV-1042", nome: "PV Alpha" },
    unidade: { id: "L001", nome: "SP-Centro" },
    participacaoPct: 60,
    comissaoPct: 0.8,
    ingressoSociedade: "Fev 2020",
    vinculos: [
      { pv: "PV Alpha", pvId: "PV-1042", papel: "Sócio Administrador", inicio: "Fev 2020", status: "Ativo" },
      { pv: "PV Vega", pvId: "PV-1055", papel: "Sócio", inicio: "Ago 2021", status: "Ativo" },
      { pv: "Unidade SP-Centro", pvId: "L001", papel: "Sócio Lojista", inicio: "Mar 2018", status: "Ativo" },
      { pv: "PV Zeta", pvId: "PV-2091", papel: "Consultor", inicio: "Jan 2022", status: "Encerrado" },
      { pv: "PV Orion (Campinas)", pvId: "PV-1108", papel: "Sócio", inicio: "Jun 2019", status: "Encerrado" },
    ],
  },
  "S-PV1042-02": {
    id: "S-PV1042-02",
    nome: "Juliana Mendes",
    documento: "234.567.890-11",
    nivelLabel: "Sócio",
    status: "Ativo",
    pv: { id: "PV-1042", nome: "PV Alpha" },
    unidade: { id: "L001", nome: "SP-Centro" },
    participacaoPct: 40,
    comissaoPct: 0.5,
    ingressoSociedade: "Fev 2020",
    vinculos: [
      { pv: "PV Alpha", pvId: "PV-1042", papel: "Sócio", inicio: "Fev 2020", status: "Ativo" },
      { pv: "Unidade SP-Centro", pvId: "L001", papel: "Sócio Lojista", inicio: "Fev 2020", status: "Ativo" },
      { pv: "PV Horizonte (BH)", pvId: "PV-4001", papel: "Sócio Administrador", inicio: "Mar 2019", status: "Encerrado" },
      { pv: "PV Estrela (Salvador)", pvId: "PV-5001", papel: "Sócio", inicio: "Jan 2018", status: "Encerrado" },
      { pv: "PV Nordeste (Salvador)", pvId: "PV-5020", papel: "Consultor", inicio: "Jun 2017", status: "Encerrado" },
    ],
  },
  "S-PV1055-01": {
    id: "S-PV1055-01",
    nome: "Beatriz Souza",
    documento: "345.678.901-22",
    nivelLabel: "Sócio Administrador",
    status: "Ativo",
    pv: { id: "PV-1055", nome: "PV Vega" },
    unidade: { id: "L001", nome: "SP-Centro" },
    participacaoPct: 70,
    comissaoPct: 0.5,
    ingressoSociedade: "Ago 2021",
    vinculos: [
      { pv: "PV Vega", pvId: "PV-1055", papel: "Sócio Administrador", inicio: "Ago 2021", status: "Ativo" },
      { pv: "Unidade SP-Centro", pvId: "L001", papel: "Sócio Lojista", inicio: "Ago 2021", status: "Ativo" },
      { pv: "PV Alpha", pvId: "PV-1042", papel: "Consultor", inicio: "Jun 2020", status: "Encerrado" },
      { pv: "PV Atlântico (POA)", pvId: "PV-4015", papel: "Sócio", inicio: "Abr 2019", status: "Encerrado" },
      { pv: "PV Guaíba (POA)", pvId: "PV-1310", papel: "Sócio", inicio: "Fev 2018", status: "Encerrado" },
      { pv: "PV Ipiranga (POA)", pvId: "PV-1322", papel: "Consultor", inicio: "Jan 2017", status: "Encerrado" },
    ],
  },
  "S-PV1055-02": {
    id: "S-PV1055-02",
    nome: "André Pereira",
    documento: "456.789.012-33",
    nivelLabel: "Sócio",
    status: "Ativo",
    pv: { id: "PV-1055", nome: "PV Vega" },
    unidade: { id: "L001", nome: "SP-Centro" },
    participacaoPct: 30,
    comissaoPct: 0.3,
    ingressoSociedade: "Ago 2021",
    vinculos: [
      { pv: "PV Vega", pvId: "PV-1055", papel: "Sócio", inicio: "Ago 2021", status: "Ativo" },
      { pv: "Unidade SP-Centro", pvId: "L001", papel: "Sócio Lojista", inicio: "Ago 2021", status: "Ativo" },
      { pv: "PV Capital (Brasília)", pvId: "PV-6001", papel: "Sócio Administrador", inicio: "Mai 2020", status: "Encerrado" },
      { pv: "PV Planalto (Brasília)", pvId: "PV-6010", papel: "Sócio", inicio: "Mar 2019", status: "Encerrado" },
      { pv: "PV Farol (Salvador)", pvId: "PV-1410", papel: "Consultor", inicio: "Nov 2018", status: "Encerrado" },
    ],
  },
  "S-PV2091-01": {
    id: "S-PV2091-01",
    nome: "Diego Farias",
    documento: "567.890.123-44",
    nivelLabel: "Sócio Administrador",
    status: "Ativo",
    pv: { id: "PV-2091", nome: "PV Zeta" },
    unidade: { id: "L001", nome: "SP-Centro" },
    participacaoPct: 100,
    comissaoPct: 0.4,
    ingressoSociedade: "Mar 2022",
    vinculos: [
      { pv: "PV Zeta", pvId: "PV-2091", papel: "Sócio Administrador", inicio: "Mar 2022", status: "Ativo" },
      { pv: "PV Alpha", pvId: "PV-1042", papel: "Consultor", inicio: "Fev 2020", status: "Ativo" },
      { pv: "Unidade SP-Centro", pvId: "L001", papel: "Sócio Lojista", inicio: "Mar 2022", status: "Ativo" },
      { pv: "PV Nova Era (RJ)", pvId: "PV-3022", papel: "Sócio", inicio: "Set 2019", status: "Encerrado" },
      { pv: "PV Sigma (Curitiba)", pvId: "PV-2050", papel: "Consultor", inicio: "Jan 2018", status: "Encerrado" },
    ],
  },
  "C100": {
    id: "C100",
    nome: "João Silva",
    documento: "12.345.678/0001-90",
    nivelLabel: "Licenciado 3.5",
    status: "Ativo",
    pv: { id: "PV-1042", nome: "PV Alpha" },
    unidade: { id: "L001", nome: "SP-Centro" },
    participacaoPct: 55,
    comissaoPct: 1.2,
    ingressoSociedade: "Mar 2018",
    vinculos: [
      { pv: "PV Alpha", pvId: "PV-1042", papel: "Sócio Administrador", inicio: "Mar 2018", status: "Ativo" },
      { pv: "PV Vega", pvId: "PV-1055", papel: "Sócio", inicio: "Ago 2021", status: "Ativo" },
      { pv: "Unidade SP-Centro", pvId: "L001", papel: "Licenciado", inicio: "Mar 2018", status: "Ativo" },
    ],
  },
  "C101": {
    id: "C101",
    nome: "Marina Reis",
    documento: "23.456.789/0001-11",
    nivelLabel: "Licenciado 3.5",
    status: "Ativo",
    pv: { id: "PV-2091", nome: "PV Zeta" },
    unidade: { id: "L002", nome: "Campinas" },
    participacaoPct: 100,
    comissaoPct: 1.0,
    ingressoSociedade: "Jun 2019",
    vinculos: [
      { pv: "PV Zeta", pvId: "PV-2091", papel: "Sócio Administrador", inicio: "Jun 2019", status: "Ativo" },
      { pv: "Unidade Campinas", pvId: "L002", papel: "Licenciado", inicio: "Jun 2019", status: "Ativo" },
    ],
  },
};
