/** Tela de painel: metricas do mes, meta, acao rapida e leads mornos. */

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const moedaCheia = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function nomeDoMes(mes) {
  if (mes === Dados.TODOS) return "Todos os meses";
  const [ano, m] = mes.split("-");
  const rotulo = new Date(Number(ano), Number(m) - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return rotulo.charAt(0).toUpperCase() + rotulo.slice(1);
}

function percentual(valor) {
  if (valor === null) return "--";
  return `${Math.round(valor * 100)}%`;
}

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function blocoVazio() {
  return `
    <div class="vazio">
      <h3>Nenhum lead ainda</h3>
      <p>Cadastre o primeiro lead ou carregue dados de exemplo pra ver o painel funcionando.</p>
      <button class="botao botao--bloco" data-acao="exemplo">Carregar dados de exemplo</button>
      <button class="botao botao--fantasma botao--bloco" data-acao="novo-lead">Cadastrar primeiro lead</button>
    </div>`;
}

function blocoAcaoHoje(m) {
  return `
    <div class="acao-hoje">
      <div class="acao-hoje__numero" id="contador-hoje">${m.contatosHoje}</div>
      <div class="acao-hoje__texto">
        <strong>Contatos de hoje</strong>
        <small>${m.contatosMes} no mês</small>
      </div>
      <button class="botao-mini" data-acao="desfazer-contato" aria-label="Remover um contato de hoje">&minus;</button>
      <button class="botao" data-acao="registrar-contato">+1</button>
    </div>`;
}

function blocoComissao(m) {
  const pct = m.percentualMetaComissao;
  const largura = pct === null ? 0 : Math.min(100, Math.round(pct * 100));
  const falta = m.metaComissao - m.comissao;
  const meta = m.recorteMensal
    ? `<div class="meta">
         <div class="meta__topo">
           <span>Meta ${moeda.format(m.metaComissao)}</span>
           <span>${percentual(pct)}${falta > 0 ? ` &middot; faltam ${moeda.format(falta)}` : " &middot; batida"}</span>
         </div>
         <div class="meta__barra"><div class="meta__preenchimento" style="width:${largura}%"></div></div>
       </div>`
    : "";
  return `
    <div class="comissao">
      <div class="comissao__rotulo">Comissão projetada &middot; 1%</div>
      <div class="comissao__valor">${moedaCheia.format(m.comissao)}</div>
      <div class="comissao__nota">
        Sobre <b>${moeda.format(m.volumeFechado)}</b> em cartas fechadas.
        Mais <b>${moeda.format(m.comissaoPotencial)}</b> em potencial no funil.
      </div>
      ${meta}
    </div>`;
}

function blocoMetricas(m) {
  const pctReunioes = m.percentualMetaReunioes;
  const larguraReunioes = pctReunioes === null ? 0 : Math.min(100, Math.round(pctReunioes * 100));
  const barraReunioes = m.recorteMensal
    ? `<div class="meta meta--clara" style="margin-top:8px">
         <div class="meta__barra"><div class="meta__preenchimento" style="width:${larguraReunioes}%"></div></div>
       </div>`
    : "";
  return `
    <div class="metricas">
      <div class="metrica">
        <div class="metrica__rotulo">Leads<small>${m.fechados} fechados &middot; ${m.perdidos} perdidos</small></div>
        <div class="metrica__valor">${m.totalLeads}</div>
      </div>
      <div class="metrica">
        <div class="metrica__rotulo">Taxa de conversão<small>fechados / reuniões realizadas</small></div>
        <div class="metrica__valor">${percentual(m.taxaConversao)} <em>${m.fechados}/${m.reunioesRealizadas}</em></div>
      </div>
      <div class="metrica metrica--pilha">
        <div class="metrica__rotulo">Reuniões marcadas${m.recorteMensal ? `<small>meta de ${m.metaReunioes} no mês</small>` : ""}</div>
        <div class="metrica__valor">${m.reunioesMarcadas}${m.recorteMensal ? ` <em>de ${m.metaReunioes}</em>` : ""}</div>
        ${barraReunioes}
      </div>
      <div class="metrica">
        <div class="metrica__rotulo">Reuniões realizadas<small>já aconteceram</small></div>
        <div class="metrica__valor">${m.reunioesRealizadas}</div>
      </div>
    </div>`;
}

function blocoMornos() {
  const mornos = Dados.leadsMornos();
  if (mornos.length === 0) return "";
  const itens = mornos
    .slice(0, 5)
    .map((lead) => {
      const dias = Dados.diasDesde(lead.dataUltimaInteracao);
      return `<li><a href="#" data-lead="${lead.id}">${escapar(lead.nome || "Sem nome")}</a><time>${dias} dias</time></li>`;
    })
    .join("");
  const resto =
    mornos.length > 5
      ? `<li><a href="#" data-acao="ver-mornos">Ver todos os ${mornos.length}</a><time></time></li>`
      : "";
  return `
    <div class="mornos">
      <div class="mornos__titulo"><span class="mornos__pino" aria-hidden="true"></span>
        ${mornos.length} lead${mornos.length > 1 ? "s" : ""} sem contato há mais de ${Dados.DIAS_MORNO} dias</div>
      <ul>${itens}${resto}</ul>
    </div>`;
}

function blocoFunil(mes) {
  const leads = Dados.leadsDoRecorte(mes);
  if (leads.length === 0) return "";
  const etapas = Dados.STATUS.filter((s) => s.ordem >= 0);
  const contagens = etapas.map((s) => ({
    ...s,
    // Funil acumulado: quem chegou na etapa 4 tambem passou pela 3.
    qtd: leads.filter((l) => Dados.ordemStatus(l.status) >= s.ordem).length,
  }));
  const maior = Math.max(...contagens.map((c) => c.qtd), 1);
  const linhas = contagens
    .map(
      (c, i) => `
      <div class="funil__linha">
        <span class="funil__nome">${c.rotulo}</span>
        <div class="funil__trilho"><div class="funil__preenchimento" style="width:${(c.qtd / maior) * 100}%;background:var(--etapa-${i + 1})"></div></div>
        <span class="funil__qtd">${c.qtd}</span>
      </div>`
    )
    .join("");
  return `<h2 class="secao-titulo">Funil</h2><div class="funil">${linhas}</div>`;
}

function blocoCanais(m) {
  if (m.porCanal.length === 0) return "";
  const linhas = m.porCanal
    .slice()
    .sort((a, b) => b.total - a.total)
    .map(
      (c) => `
      <div class="canal">
        <span>${c.canal}</span>
        <span class="canal__dados"><b>${c.total}</b> lead${c.total > 1 ? "s" : ""} &middot; ${c.fechados} fechado${c.fechados === 1 ? "" : "s"}</span>
      </div>`
    )
    .join("");
  return `<h2 class="secao-titulo">Origem</h2><div class="canais">${linhas}</div>`;
}

function renderizarDashboard(alvo, mes) {
  if (!Dados.temDados()) {
    alvo.innerHTML = blocoVazio();
    return;
  }
  const m = Dados.metricas(mes);
  alvo.innerHTML = `
    ${blocoAcaoHoje(m)}
    <h2 class="secao-titulo">${nomeDoMes(mes)}</h2>
    ${blocoComissao(m)}
    ${blocoMetricas(m)}
    ${blocoMornos()}
    ${blocoFunil(mes)}
    ${blocoCanais(m)}
    <p class="aviso">
      Comissão a ${Math.round(Dados.TAXA_COMISSAO * 100)}% sobre as cartas com status Fechado.<br />
      Os alvos do mês ficam em Ajustes.
    </p>`;
}

window.Dashboard = { renderizar: renderizarDashboard, nomeDoMes, moeda, moedaCheia, escapar };
