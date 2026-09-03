/**
 * Camada de dados do mini-CRM.
 * Tudo vive no localStorage do navegador — nao existe servidor.
 * Nenhum modulo de UI acessa localStorage direto: sempre por aqui.
 */

const CHAVE = "crm-consorcio:v1";

const CANAIS = ["Marketplace", "TikTok", "Kwai", "Instagram", "Indicacao"];

/**
 * Os status sao um funil ordenado. A ordem importa: "reuniao marcada" conta
 * tambem para quem ja avancou pra reuniao realizada / fechado.
 * "Perdido" fica fora do funil (ordem -1) porque pode acontecer em qualquer etapa.
 */
const STATUS = [
  { id: "novo", rotulo: "Novo", ordem: 0, cor: "#64748b" },
  { id: "contatado", rotulo: "Contatado", ordem: 1, cor: "#0284c7" },
  { id: "qualificado", rotulo: "Qualificado", ordem: 2, cor: "#7c3aed" },
  { id: "reuniao_marcada", rotulo: "Reuniao marcada", ordem: 3, cor: "#d97706" },
  { id: "reuniao_realizada", rotulo: "Reuniao realizada", ordem: 4, cor: "#0d9488" },
  { id: "fechado", rotulo: "Fechado", ordem: 5, cor: "#16a34a" },
  { id: "perdido", rotulo: "Perdido", ordem: -1, cor: "#dc2626" },
];

const TAXA_COMISSAO = 0.01; // 1% do valor da carta fechada
const DIAS_MORNO = 3; // sem interacao ha mais de 3 dias = morno

const PADRAO = {
  versao: 1,
  leads: [],
  config: {
    metaComissao: 5000, // R$ de comissao no mes
    metaReunioes: 20, // reunioes marcadas no mes
  },
  contatosPorDia: {}, // { "2026-09-03": 7 }
};

let estado = carregar();

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return estruturaVazia();
    const dados = JSON.parse(bruto);
    return {
      ...estruturaVazia(),
      ...dados,
      config: { ...PADRAO.config, ...(dados.config || {}) },
    };
  } catch (erro) {
    console.warn("Nao consegui ler os dados salvos, comecando do zero.", erro);
    return estruturaVazia();
  }
}

function estruturaVazia() {
  return JSON.parse(JSON.stringify(PADRAO));
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch (erro) {
    console.error("Falha ao salvar (armazenamento cheio ou bloqueado).", erro);
    alert("Nao consegui salvar no navegador. Verifique o espaco disponivel.");
  }
  document.dispatchEvent(new CustomEvent("dados:alterados"));
}

/* ---------- utilitarios de data ---------- */

/** Data de hoje no formato YYYY-MM-DD, no fuso local (nao UTC). */
function hoje() {
  return paraISO(new Date());
}

function paraISO(data) {
  const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return ajustada.toISOString().slice(0, 10);
}

/** Mes atual no formato YYYY-MM. */
function mesAtual() {
  return hoje().slice(0, 7);
}

/** Dias inteiros entre uma data ISO e hoje. */
function diasDesde(iso) {
  if (!iso) return Infinity;
  const ms = new Date(hoje()).getTime() - new Date(iso).getTime();
  return Math.round(ms / 86400000);
}

/* ---------- CRUD de leads ---------- */

function listarLeads() {
  return estado.leads.slice();
}

function buscarLead(id) {
  return estado.leads.find((lead) => lead.id === id) || null;
}

function salvarLead(dados) {
  const agora = new Date().toISOString();
  if (dados.id) {
    const indice = estado.leads.findIndex((lead) => lead.id === dados.id);
    if (indice === -1) return null;
    estado.leads[indice] = { ...estado.leads[indice], ...dados, atualizadoEm: agora };
    salvar();
    return estado.leads[indice];
  }
  const novo = {
    id: crypto.randomUUID(),
    nome: "",
    telefone: "",
    canal: CANAIS[0],
    status: "novo",
    valorCarta: 0,
    dataPrimeiroContato: hoje(),
    dataUltimaInteracao: hoje(),
    observacoes: "",
    ...dados,
    criadoEm: agora,
    atualizadoEm: agora,
  };
  estado.leads.push(novo);
  salvar();
  return novo;
}

function removerLead(id) {
  estado.leads = estado.leads.filter((lead) => lead.id !== id);
  salvar();
}

/** Marca interacao de hoje no lead (usado pelos atalhos da lista). */
function registrarInteracao(id) {
  const lead = buscarLead(id);
  if (!lead) return null;
  lead.dataUltimaInteracao = hoje();
  lead.atualizadoEm = new Date().toISOString();
  salvar();
  return lead;
}

/* ---------- contador diario ---------- */

function contatosDoDia(dia = hoje()) {
  return estado.contatosPorDia[dia] || 0;
}

function registrarContatoHoje() {
  const dia = hoje();
  estado.contatosPorDia[dia] = contatosDoDia(dia) + 1;
  salvar();
  return estado.contatosPorDia[dia];
}

function desfazerContatoHoje() {
  const dia = hoje();
  const atual = contatosDoDia(dia);
  if (atual <= 0) return 0;
  estado.contatosPorDia[dia] = atual - 1;
  salvar();
  return estado.contatosPorDia[dia];
}

function contatosDoMes(mes = mesAtual()) {
  return Object.entries(estado.contatosPorDia)
    .filter(([dia]) => dia.startsWith(mes))
    .reduce((soma, [, qtd]) => soma + qtd, 0);
}

/* ---------- config ---------- */

function config() {
  return { ...estado.config };
}

function salvarConfig(nova) {
  estado.config = { ...estado.config, ...nova };
  salvar();
}

/* ---------- metricas ---------- */

function ordemStatus(id) {
  const status = STATUS.find((s) => s.id === id);
  return status ? status.ordem : -1;
}

function rotuloStatus(id) {
  const status = STATUS.find((s) => s.id === id);
  return status ? status.rotulo : id;
}

function corStatus(id) {
  const status = STATUS.find((s) => s.id === id);
  return status ? status.cor : "#64748b";
}

/** Lead "morno": sem interacao ha mais de 3 dias e ainda vivo no funil. */
function estaMorno(lead) {
  if (lead.status === "fechado" || lead.status === "perdido") return false;
  return diasDesde(lead.dataUltimaInteracao) > DIAS_MORNO;
}

function leadsMornos() {
  return estado.leads
    .filter(estaMorno)
    .sort((a, b) => diasDesde(b.dataUltimaInteracao) - diasDesde(a.dataUltimaInteracao));
}

const TODOS = "todos";

/** Leads de um recorte: um mes YYYY-MM ou "todos". */
function leadsDoRecorte(mes) {
  if (mes === TODOS) return estado.leads.slice();
  return estado.leads.filter((lead) => (lead.dataPrimeiroContato || "").startsWith(mes));
}

/**
 * Metricas do recorte. O corte e a data do primeiro contato — ou seja,
 * mede a safra de leads que entrou naquele mes.
 */
function metricas(mes = mesAtual()) {
  const doMes = leadsDoRecorte(mes);

  const reunioesMarcadas = doMes.filter((l) => ordemStatus(l.status) >= 3).length;
  const reunioesRealizadas = doMes.filter((l) => ordemStatus(l.status) >= 4).length;
  const fechados = doMes.filter((l) => l.status === "fechado");
  const perdidos = doMes.filter((l) => l.status === "perdido").length;

  const volumeFechado = fechados.reduce((soma, l) => soma + (Number(l.valorCarta) || 0), 0);
  const comissao = volumeFechado * TAXA_COMISSAO;

  const emAberto = doMes.filter(
    (l) => l.status !== "fechado" && l.status !== "perdido"
  );
  const volumeEmAberto = emAberto.reduce((soma, l) => soma + (Number(l.valorCarta) || 0), 0);

  const { metaComissao, metaReunioes } = estado.config;

  return {
    mes,
    recorteMensal: mes !== TODOS,
    totalLeads: doMes.length,
    reunioesMarcadas,
    reunioesRealizadas,
    fechados: fechados.length,
    perdidos,
    volumeFechado,
    volumeEmAberto,
    comissao,
    comissaoPotencial: volumeEmAberto * TAXA_COMISSAO,
    // Conversao pedida: fechados / reunioes realizadas.
    taxaConversao: reunioesRealizadas > 0 ? fechados.length / reunioesRealizadas : null,
    metaComissao,
    metaReunioes,
    percentualMetaComissao: metaComissao > 0 ? comissao / metaComissao : null,
    percentualMetaReunioes: metaReunioes > 0 ? reunioesMarcadas / metaReunioes : null,
    mornos: leadsMornos().length,
    contatosHoje: contatosDoDia(),
    contatosMes: contatosDoMes(mes),
    porCanal: CANAIS.map((canal) => ({
      canal,
      total: doMes.filter((l) => l.canal === canal).length,
      fechados: doMes.filter((l) => l.canal === canal && l.status === "fechado").length,
    })).filter((linha) => linha.total > 0),
  };
}

/** Meses que tem algum lead, mais o mes atual — pro seletor do dashboard. */
function mesesComDados() {
  const meses = new Set(
    estado.leads
      .map((l) => (l.dataPrimeiroContato || "").slice(0, 7))
      .filter(Boolean)
  );
  meses.add(mesAtual());
  const lista = Array.from(meses).sort().reverse();
  return lista.length > 1 ? [...lista, TODOS] : lista;
}

/* ---------- backup ---------- */

function exportar() {
  return JSON.stringify(estado, null, 2);
}

function importar(json) {
  const dados = JSON.parse(json);
  if (!Array.isArray(dados.leads)) throw new Error("Arquivo sem lista de leads.");
  estado = { ...estruturaVazia(), ...dados, config: { ...PADRAO.config, ...(dados.config || {}) } };
  salvar();
}

function apagarTudo() {
  estado = estruturaVazia();
  salvar();
}

/** Dados de exemplo pra validar o dashboard sem digitar nada. */
function carregarExemplo() {
  const d = (dias) => {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return paraISO(data);
  };
  estado = estruturaVazia();
  const exemplos = [
    ["Marcos Ribeiro", "11987650001", "Marketplace", "fechado", 180000, 22, 2],
    ["Aline Souza", "11987650002", "Instagram", "fechado", 240000, 19, 4],
    ["Carlos Pinheiro", "11987650003", "TikTok", "reuniao_realizada", 150000, 15, 1],
    ["Juliana Alves", "11987650004", "Indicacao", "reuniao_realizada", 320000, 12, 0],
    ["Rodrigo Lima", "11987650005", "Kwai", "reuniao_marcada", 200000, 10, 1],
    ["Patricia Nunes", "11987650006", "Marketplace", "reuniao_marcada", 95000, 9, 6],
    ["Eduardo Freitas", "11987650007", "Instagram", "qualificado", 130000, 8, 5],
    ["Sandra Melo", "11987650008", "TikTok", "qualificado", 110000, 7, 0],
    ["Bruno Tavares", "11987650009", "Marketplace", "contatado", 90000, 6, 4],
    ["Fernanda Dias", "11987650010", "Kwai", "contatado", 160000, 5, 1],
    ["Tiago Barros", "11987650011", "Indicacao", "novo", 250000, 3, 3],
    ["Camila Rocha", "11987650012", "Instagram", "novo", 140000, 1, 0],
    ["Helio Santana", "11987650013", "TikTok", "perdido", 120000, 20, 8],
  ];
  estado.leads = exemplos.map(([nome, telefone, canal, status, valor, diasP, diasU]) => ({
    id: crypto.randomUUID(),
    nome,
    telefone,
    canal,
    status,
    valorCarta: valor,
    dataPrimeiroContato: d(diasP),
    dataUltimaInteracao: d(diasU),
    observacoes: "",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  }));
  estado.contatosPorDia[hoje()] = 6;
  salvar();
}

function temDados() {
  return estado.leads.length > 0;
}

window.Dados = {
  TODOS,
  leadsDoRecorte,
  CANAIS,
  STATUS,
  TAXA_COMISSAO,
  DIAS_MORNO,
  hoje,
  mesAtual,
  diasDesde,
  listarLeads,
  buscarLead,
  salvarLead,
  removerLead,
  registrarInteracao,
  contatosDoDia,
  registrarContatoHoje,
  desfazerContatoHoje,
  contatosDoMes,
  config,
  salvarConfig,
  ordemStatus,
  rotuloStatus,
  corStatus,
  estaMorno,
  leadsMornos,
  metricas,
  mesesComDados,
  exportar,
  importar,
  apagarTudo,
  carregarExemplo,
  temDados,
};
