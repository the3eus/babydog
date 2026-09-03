/** Cola da aplicacao: navegacao, seletor de mes e acoes globais. */

const telas = {
  dashboard: document.getElementById("tela-dashboard"),
  leads: document.getElementById("tela-leads"),
  config: document.getElementById("tela-config"),
};

const seletorMes = document.getElementById("seletor-mes");
const dialogoMeta = document.getElementById("dialogo-meta");

let telaAtual = "dashboard";
let mesSelecionado = Dados.mesAtual();

/* ---------- navegacao ---------- */

function irPara(nome) {
  telaAtual = nome;
  Object.entries(telas).forEach(([id, elemento]) => {
    elemento.hidden = id !== nome;
  });
  document.querySelectorAll(".barra__item").forEach((botao) => {
    if (botao.dataset.tela === nome) botao.setAttribute("aria-current", "page");
    else botao.removeAttribute("aria-current");
  });
  seletorMes.hidden = nome !== "dashboard";
  window.scrollTo(0, 0);
  renderizar();
}

document.querySelectorAll(".barra__item").forEach((botao) => {
  botao.addEventListener("click", () => irPara(botao.dataset.tela));
});

/* ---------- seletor de mes ---------- */

function montarSeletorMes() {
  const meses = Dados.mesesComDados();
  if (!meses.includes(mesSelecionado)) mesSelecionado = meses[0];
  seletorMes.innerHTML = meses
    .map((mes) => `<option value="${mes}">${Dashboard.nomeDoMes(mes)}</option>`)
    .join("");
  seletorMes.value = mesSelecionado;
}

seletorMes.addEventListener("change", () => {
  mesSelecionado = seletorMes.value;
  renderizar();
});

/* ---------- tela de ajustes ---------- */

function renderizarConfig() {
  const cfg = Dados.config();
  telas.config.innerHTML = `
    <h2 class="secao-titulo">Metas do mês</h2>
    <div class="cartao">
      <div class="cartao__rotulo">Meta de comissão</div>
      <div class="cartao__valor cartao__valor--menor">${Dashboard.moedaCheia.format(cfg.metaComissao)}</div>
      <div class="cartao__nota">Equivale a ${Dashboard.moeda.format(cfg.metaComissao / Dados.TAXA_COMISSAO)} em cartas fechadas.</div>
    </div>
    <div class="cartao" style="margin-top:10px">
      <div class="cartao__rotulo">Meta de reuniões marcadas</div>
      <div class="cartao__valor cartao__valor--menor">${cfg.metaReunioes}</div>
    </div>
    <button class="botao botao--bloco" style="margin-top:12px" data-acao="editar-meta">Editar metas</button>

    <h2 class="secao-titulo">Backup dos dados</h2>
    <div class="cartao">
      <div class="cartao__nota" style="margin:0 0 12px">
        Os dados ficam só neste navegador. Se limpar o cache ou trocar de celular,
        eles somem. Exporte de vez em quando.
      </div>
      <button class="botao botao--secundario botao--bloco" data-acao="exportar">Exportar arquivo (.json)</button>
      <button class="botao botao--fantasma botao--bloco" style="margin-top:8px" data-acao="importar">Importar arquivo</button>
      <input type="file" id="arquivo-importar" accept="application/json" hidden />
    </div>

    <h2 class="secao-titulo">Zona de risco</h2>
    <button class="botao botao--perigo botao--bloco" data-acao="apagar">Apagar todos os dados</button>
    <p class="aviso">Versão 1 &middot; ${Dados.listarLeads().length} lead(s) guardado(s) neste aparelho.</p>`;
}

function renderizarLeads() {
  telas.leads.innerHTML = `
    <div class="vazio">
      <h3>Lista de leads</h3>
      <p>Próxima etapa: lista com filtro por status e canal, ordenação por data
      e o formulário rápido de cadastro. Valide o painel primeiro.</p>
      <button class="botao botao--fantasma botao--bloco" data-tela-ir="dashboard">Voltar ao painel</button>
    </div>`;
}

/* ---------- render ---------- */

function renderizar() {
  montarSeletorMes();
  if (telaAtual === "dashboard") Dashboard.renderizar(telas.dashboard, mesSelecionado);
  else if (telaAtual === "config") renderizarConfig();
  else renderizarLeads();
}

document.addEventListener("dados:alterados", renderizar);

/* ---------- acoes (delegacao de eventos) ---------- */

document.addEventListener("click", (evento) => {
  const gatilho = evento.target.closest("[data-acao], [data-tela-ir], [data-fechar]");
  if (!gatilho) return;

  if (gatilho.dataset.telaIr) {
    evento.preventDefault();
    irPara(gatilho.dataset.telaIr);
    return;
  }

  if (gatilho.hasAttribute("data-fechar")) {
    dialogoMeta.close();
    return;
  }

  const acao = gatilho.dataset.acao;

  if (acao === "registrar-contato") {
    evento.preventDefault();
    Dados.registrarContatoHoje();
    if (navigator.vibrate) navigator.vibrate(15);
  } else if (acao === "desfazer-contato") {
    evento.preventDefault();
    Dados.desfazerContatoHoje();
  } else if (acao === "exemplo") {
    Dados.carregarExemplo();
    // O exemplo espalha leads por ~3 semanas, entao pode cruzar a virada do mes:
    // abre em "todos" pra o painel ja aparecer cheio.
    mesSelecionado = Dados.TODOS;
  } else if (acao === "novo-lead" || acao === "ver-mornos") {
    evento.preventDefault();
    irPara("leads");
  } else if (acao === "editar-meta") {
    abrirDialogoMeta();
  } else if (acao === "exportar") {
    exportarArquivo();
  } else if (acao === "importar") {
    document.getElementById("arquivo-importar").click();
  } else if (acao === "apagar") {
    if (confirm("Apagar todos os leads e métricas deste aparelho? Não dá pra desfazer.")) {
      Dados.apagarTudo();
    }
  }
});

document.addEventListener("change", (evento) => {
  if (evento.target.id !== "arquivo-importar") return;
  const arquivo = evento.target.files[0];
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = () => {
    try {
      Dados.importar(leitor.result);
      alert("Dados importados.");
    } catch (erro) {
      alert("Arquivo inválido: " + erro.message);
    }
  };
  leitor.readAsText(arquivo);
});

/* ---------- dialogo de meta ---------- */

function abrirDialogoMeta() {
  const cfg = Dados.config();
  const form = document.getElementById("form-meta");
  form.metaComissao.value = cfg.metaComissao;
  form.metaReunioes.value = cfg.metaReunioes;
  dialogoMeta.showModal();
}

document.getElementById("form-meta").addEventListener("submit", (evento) => {
  const form = evento.target;
  Dados.salvarConfig({
    metaComissao: Number(form.metaComissao.value) || 0,
    metaReunioes: Number(form.metaReunioes.value) || 0,
  });
});

/* ---------- backup ---------- */

function exportarArquivo() {
  const blob = new Blob([Dados.exportar()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `crm-consorcio-${Dados.hoje()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/* ---------- inicio ---------- */

irPara("dashboard");
