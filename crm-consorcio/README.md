# CRM Consorcio

Mini-CRM pessoal de prospeccao de consorcio imobiliario. App web estatico,
sem backend: os dados vivem no `localStorage` do proprio navegador.

## Como usar

**No computador:** abra `index.html` no navegador.

**No celular (recomendado):** rode `node build.js` e mande
`dist/crm-consorcio.html` pro aparelho (WhatsApp, Drive, AirDrop) ou hospede
o arquivo em qualquer lugar estatico. E um arquivo unico, sem dependencias.
Depois de aberto, use "Adicionar a tela de inicio" pra virar atalho.

## Estrutura

```
index.html          markup e navegacao
css/estilo.css      tokens de cor, componentes, layout mobile-first
js/dados.js         UNICA porta de acesso ao localStorage: modelo, CRUD, metricas
js/dashboard.js     render do painel
js/app.js           navegacao, seletor de mes, acoes globais
build.js            gera dist/ em arquivo unico (nao roda automatico)
```

Regra de arquitetura: **nenhum modulo de UI toca no `localStorage` direto** —
tudo passa por `js/dados.js`. Se um dia isso virar um app com servidor, so
esse arquivo muda.

## Modelo do lead

| campo | observacao |
|---|---|
| `nome`, `telefone` | telefone so digitos, usado pra montar link de WhatsApp |
| `canal` | Marketplace, TikTok, Kwai, Instagram, Indicacao |
| `status` | funil ordenado: novo → contatado → qualificado → reuniao marcada → reuniao realizada → fechado. `perdido` fica fora da ordem |
| `valorCarta` | valor da carta em R$ |
| `dataPrimeiroContato` | define a qual mes o lead pertence nas metricas |
| `dataUltimaInteracao` | base do alerta de lead morno |
| `observacoes` | texto livre |

## Regras de calculo

- **Leads no mes** — recorte pela `dataPrimeiroContato` (safra de entrada).
- **Reunioes marcadas** — leads que *chegaram* na etapa, ou seja status de
  ordem >= 3. Quem fechou tambem passou por ali.
- **Taxa de conversao** — `fechados / reunioes realizadas`. Retorna `--` quando
  ainda nao houve reuniao realizada (nao inventa 0%).
- **Comissao projetada** — 1% (`TAXA_COMISSAO`) sobre a soma das cartas com
  status `fechado`. O painel mostra separado o potencial das cartas ainda em
  aberto — isso e potencial, nao comissao.
- **Lead morno** — sem interacao ha mais de 3 dias (`DIAS_MORNO`) e ainda vivo
  no funil (fechado e perdido nao contam).

## Risco conhecido

Os dados existem so no navegador daquele aparelho. Limpar dados do site,
trocar de celular ou usar aba anonima = perda total. Por isso Ajustes tem
exportar / importar JSON. Exporte com alguma regularidade.
