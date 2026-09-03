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
        <small>${m.contatosMes} no mes &middot; ligacoes e reunioes</small>
      </div>
      <button class="botao-mini" data-acao="desfazer-contato" aria-label="Remover um contato de hoje">&minus;</button>
      <button class="botao" data-acao="registrar-contato">+1 contato</button>
    </div>`;
}

function blocoComissao(m) {
  const pct = m.percentualMetaComissao;
  const largura = pct === null ? 0 : Math.min(100, Math.round(pct * 100));
  const falta = m.metaComissao - m.comissao;
  return `
    <div class="cartao cartao--destaque">
      <div class="cartao__rotulo">Comissao projetada (1%)</div>
      <div class="cartao__valor">${moedaCheia.format(m.comissao)}</div>
      <div class="cartao__nota">
        ${moeda.format(m.volumeFechado)} em cartas fechadas &middot;
        ${moeda.format(m.comissaoPotencial)} ainda em aberto
      </div>
      ${m.recorteMensal ? `
      <div class="meta">
        <div class="meta__topo">
          <span>Meta: ${moeda.format(m.metaComissao)}</span>
          <span>${percentual(pct)}${falta > 0 ? ` &middot; faltam ${moeda.format(falta)}` : " &middot; batida 🎯"}</span>
        </div>
        <div class="meta__barra"><div class="meta__preenchimento" style="width:${largura}%"></div></div>
      </div>` : ""}
    </div>`;
}

function blocoCartoes(m) {
  const pctReunioes = m.percentualMetaReunioes;
  const larguraReunioes = pctReunioes === null ? 0 : Math.min(100, Math.round(pctReunioes * 100));
  return `
    <div class="grade">
      ${blocoComissao(m)}
      <div class="cartao">
        <div class="cartao__rotulo">Leads no mes</div>
        <div class="cartao__valor">${m.totalLeads}</div>
        <div class="cartao__nota">${m.fechados} fechados &middot; ${m.perdidos} perdidos</div>
      </div>
      <div class="cartao">
        <div class="cartao__rotulo">Taxa de conversao</div>
        <div class="cartao__valor">${percentual(m.taxaConversao)}</div>
        <div class="cartao__nota">${m.fechados} de ${m.reunioesRealizadas} reunioes realizadas</div>
      </div>
      <div class="cartao" style="grid-column: 1 / -1;">
        <div class="cartao__rotulo">Reunioes marcadas</div>
        <div class="cartao__valor cartao__valor--menor">${m.reunioesMarcadas}${m.recorteMensal ? ` <span style="font-size:.9rem;font-weight:600;color:var(--texto-fraco)">de ${m.metaReunioes}</span>` : ""}</div>
        ${m.recorteMensal ? `<div class="meta meta--clara">
          <div class="meta__barra"><div class="meta__preenchimento" style="width:${larguraReunioes}%"></div></div>
        </div>` : ""}
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
      return `<li><a href="#" data-lead="${lead.id}" style="color:#92400e;font-weight:600;text-decoration:none">${escapar(lead.nome || "Sem nome")}</a><span>${dias} dias</span></li>`;
    })
    .join("");
  const resto = mornos.length > 5 ? `<li><a href="#" data-acao="ver-mornos" style="color:#92400e">Ver todos os ${mornos.length}</a><span></span></li>` : "";
  return `
    <div class="alerta-mornos">
      <div class="alerta-mornos__titulo">🔥 ${mornos.length} lead${mornos.length > 1 ? "s" : ""} esfriando</div>
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
      (c) => `
      <div class="funil__linha">
        <span class="funil__nome">${c.rotulo}</span>
        <div class="funil__trilho"><div class="funil__preenchimento" style="width:${(c.qtd / maior) * 100}%;background:${c.cor}"></div></div>
        <span class="funil__qtd">${c.qtd}</span>
      </div>`
    )
    .join("");
  return `<h2 class="secao-titulo">Funil do mes</h2><div class="funil">${linhas}</div>`;
}

function blocoCanais(m) {
  if (m.porCanal.length === 0) return "";
  const linhas = m.porCanal
    .sort((a, b) => b.total - a.total)
    .map(
      (c) => `
      <div class="canal">
        <span>${c.canal}</span>
        <span><strong>${c.total}</strong> <small>lead${c.total > 1 ? "s" : ""} &middot; ${c.fechados} fechado${c.fechados === 1 ? "" : "s"}</small></span>
      </div>`
    )
    .join("");
  return `<h2 class="secao-titulo">Origem dos leads</h2><div class="canais">${linhas}</div>`;
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
    ${blocoCartoes(m)}
    ${blocoMornos()}
    ${blocoFunil(mes)}
    ${blocoCanais(m)}
    <p class="aviso">
      Comissao calculada a ${Math.round(Dados.TAXA_COMISSAO * 100)}% sobre as cartas com status Fechado.<br />
      Toque nas metas em Ajustes pra mudar os alvos do mes.
    </p>`;
}

window.Dashboard = { renderizar: renderizarDashboard, nomeDoMes, moeda, moedaCheia, escapar };
