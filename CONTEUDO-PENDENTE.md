# Conteúdo pendente — site Baby Dog

Tudo o que está no site hoje é informação **confirmada** pela clínica ou
publicada por ela nos próprios canais. Nada foi inventado.

Os itens abaixo faltam para o site ficar completo. Enquanto não chegam, o site
funciona normalmente: as seções que dependem deles ou usam uma versão
provisória claramente identificada, ou simplesmente não aparecem.

---

## 1. Logo oficial · RESOLVIDO (22/08/2026)

A clínica enviou a arte oficial em alta resolução. O recorte com fundo
transparente está em `public/marca-babydog.png` (gerado por
`scripts/gen-marca.js`) e substituiu o desenho vetorial provisório em
`components/Logo.tsx`. O favicon (`app/icon.png`, `app/apple-icon.png`) e a
imagem de compartilhamento (`app/opengraph-image.tsx`) já usam a marca oficial.

**O que ainda ajudaria:** o arquivo em SVG vetorial, se existir, e um manual de
marca — não bloqueia nada, só deixaria futuras variações mais fáceis.

---

## 2. Fotos reais · RESOLVIDO (22/08/2026)

A clínica enviou 5 fotos da estrutura (consultório, ambulatório, sala de
imagem, farmácia e espaço de espera). Elas estão em `public/estrutura/*.webp`
(geradas por `scripts/gen-estrutura.js`), aparecem no mosaico do topo
(`components/Hero.tsx`) e na seção "Nossa estrutura" (`components/Estrutura.tsx`).

**O que ainda falta, em ordem de impacto:**

1. **Foto da equipe atendendo um pet, ou da fachada** — nenhuma das fotos
   enviadas até agora tem pet ou pessoa. É a que mais reduz objeção no
   primeiro viewport.
2. Foto do centro cirúrgico e da internação (ainda não fotografados).
3. Foto da equipe.

**Onde colocar:** arquivos novos em `imagens clinica babydog/` (fora do
projeto Next) e rodar os scripts em `scripts/` para gerar as versões
otimizadas em `public/`, ou colar direto em `public/estrutura/`.

---

## 3. Depoimentos de tutores · ALTA PRIORIDADE (opcional se o item 4 for ativado)

**Situação atual:** a seção de depoimentos **não aparece no site**, porque está
vazia. Foi feito assim de propósito — depoimento inventado é proibido e destrói
a confiança se descoberto.

Se o item 4 abaixo for ativado, este item deixa de ser necessário: as
avaliações reais do Google já preenchem a seção sozinhas, sem curadoria
manual. Use este caminho só para depoimentos que não estão no Google, ou que
a clínica queira destacar especificamente.

**O que enviar:** de 3 a 6 depoimentos reais, com autorização do tutor. Para
cada um: o texto, o nome do tutor e o nome do pet (opcional).

**Onde preencher:** `lib/content.ts`, no array `depoimentos`. Assim que o
primeiro for adicionado, a seção aparece sozinha.

---

## 4. Avaliações reais do Google · PRONTO, FALTA ATIVAR (22/08/2026)

**Situação atual:** o site já sabe buscar nota, total e até 6 trechos de
avaliação **reais** direto da API oficial do Google (Places API) — sempre
atualizados sozinhos, sem editar código nem mexer em `lib/content.ts`. A
busca acontece no servidor (`lib/avaliacoes-google.ts`), com o resultado em
cache por 1h. Enquanto a chave não for configurada, a seção continua
mostrando o texto seguro **"+200 avaliações no Google"**, confirmado pela
clínica em 20/08/2026 — a página nunca quebra por falta da chave.

**Por que não uso o "4,5 de 5 com 112 avaliações"?** Esse número circula em
diretórios de terceiros (Solutudo, Petlove, VetClínicas BR), está
desatualizado (a clínica já confirmou mais de 200 avaliações) e nunca foi
conferido no perfil oficial — não é uma fonte confiável, e reintroduzi-lo
seria pior do que não mostrar nota nenhuma.

**Por que não raspar a página do Google direto?** Tecnicamente não dá — a
página do Maps é toda renderizada em JavaScript, não existe HTML com o texto
das avaliações para ler. E mesmo que desse, reexibir nome e texto de alguém
sem autorização contraria a mesma regra que mantém `depoimentos` vazio. A
Places API é o único caminho correto: o próprio Google autoriza reexibir o
que ela retorna.

**Como ativar (3 passos, ~10 minutos):**

1. Crie um projeto no Google Cloud e ative a **"Places API"** — tem cota
   gratuita mensal: https://console.cloud.google.com/google/maps-apis
2. Gere uma chave de API e restrinja o uso dela (no mínimo, por API
   habilitada).
3. Ache o **Place ID** da clínica (busque pelo nome + endereço):
   https://developers.google.com/maps/documentation/places/web-service/place-id

**Onde preencher:** `.env.local` → `GOOGLE_PLACES_API_KEY` e
`GOOGLE_PLACES_ID` (veja `.env.example`). Nenhuma das duas é `NEXT_PUBLIC_` —
ficam só no servidor, nunca expostas no navegador.

---

## 4b. Depoimentos ainda mudam o título da seção

Enquanto `depoimentos` estiver vazio, a seção usa o título
"Tutores de Jundiaí já confiam na Baby Dog", porque prometer "O que os tutores
dizem" sem mostrar nenhuma fala deixa a seção com cara de inacabada. Assim que
o primeiro depoimento real entrar, o título volta a ser "O que os tutores
dizem" automaticamente.

---

## 5. Lista real das especialidades

**Situação atual:** o site fala em "diversos especialistas" de forma genérica,
sem citar quais — porque não temos a lista confirmada.

**O que enviar:** quais especialidades a clínica realmente oferece (por
exemplo: cardiologia, dermatologia, ortopedia...) e, se quiserem exibir, o nome
e o CRMV de cada especialista.

**Por que importa:** buscas por especialidade ("cardiologista veterinário
Jundiaí") são muito qualificadas. Hoje o site não aparece nelas.

**Onde preencher:** `lib/content.ts`, no array `atendimentos`.

---

## 6. Domínio definitivo

**Situação atual:** por decisão do cliente (20/08/2026), o site publica primeiro
no endereço provisório da Vercel, **sem ser indexado**. Enquanto
`clinica.indexavel` for `false`, o `robots.txt` bloqueia todos os robôs e as
páginas saem com `noindex, nofollow`. Assim nada entra no Google antes da
aprovação e nenhum endereço temporário vaza para a busca.

⚠️ O domínio antigo, `clinicaveterinariababydog.com.br`, **venceu em 04/08/2026**
e consta como `inactive` no registro.br. Enquanto está nesse estado, ainda dá
para renovar — o que preserva o histórico e os backlinks. Se for liberado, o
registro fica aberto para qualquer pessoa.

⚠️ Atenção também: Solutudo, Petlove, VetClínicas BR e o Facebook ainda
publicam o **telefone antigo (11) 96630-7046**. Vale corrigir junto com o
go-live, senão o tutor liga para um número que não é mais da clínica.

**Como publicar de verdade, quando o domínio estiver definido:**

1. `lib/content.ts` → trocar `clinica.site` pelo domínio final
2. `lib/content.ts` → mudar `clinica.indexavel` para `true`
3. publicar de novo e conferir `/robots.txt` e a meta `robots` da home

Esses campos alimentam canonical, tags de compartilhamento, sitemap e dados
estruturados de uma vez só.

---

## 6b. Razão social e CNPJ · NÃO PUBLICADOS

**Situação atual:** o rodapé **não mostra CNPJ**. O registro público do domínio
(registro.br) traz "Baby Dog Preti & Fernandes LTDA — 37.979.497/0001-41", com
última alteração em 2024, mas a clínica informou que hoje a
**Dra. Beatriz Area Fernandes é a única proprietária**. Publicar uma razão
social de sociedade que não existe mais seria um dado comercial errado, então
a linha fica oculta até confirmação.

**O que enviar:** razão social e CNPJ atuais.

**Onde preencher:** `lib/content.ts` → `razaoSocial`, `cnpj` e mudar
`exibirDadosLegais` para `true`.

---

## 7. Destino do formulário de contato · RESOLVIDO (22/08/2026)

**Situação atual:** o formulário já funciona sem nenhuma configuração — ao
enviar, abre o WhatsApp da recepção (linha principal) com nome, telefone, pet
e mensagem já preenchidos, e o tutor só confirma o envio por lá. Nenhum lead
se perde mais.

**Opcional:** para o lead também cair num CRM ou e-mail da clínica (além do
WhatsApp), preencha um dos dois em `.env.local` (veja `.env.example`):

- **Webhook** (`CONTACT_WEBHOOK_URL`) — recomendado, integra direto com n8n.
- **E-mail via Resend** (`RESEND_API_KEY` + `CONTACT_EMAIL`).

---

## 8. Tracking

**Situação atual:** os eventos já disparam no código — clique no WhatsApp,
clique para ligar, envio de formulário, clique no mapa/Waze e clique nas
redes — e desde 22/08/2026 os scripts do GTM, GA4 e Meta Pixel também já estão
ligados em `components/Analytics.tsx` (carregam sozinhos assim que os IDs
existirem, sem precisar mexer em código). Falta só informar os IDs das contas.

**O que enviar:** ID do GA4, do Google Tag Manager e/ou do Meta Pixel.

**Onde preencher:** `.env.local` (veja `.env.example`).

---

## 9. Dúvidas operacionais a confirmar

Estas respostas hoje estão redigidas de forma segura e genérica. Confirmando,
dá para deixá-las mais diretas e reduzir mais objeção:

- **Precisa agendar antes ou o tutor pode chegar direto?**
  Hoje o site pede para entrar em contato antes.
- **A clínica tem estacionamento?**
  A pergunta foi deixada de fora do FAQ por falta de confirmação.
- **Quais planos de saúde pet são aceitos, além da Petlove?**

**Onde ajustar:** `lib/content.ts`, no objeto `duvidas`.

---

## Regra que vale para qualquer texto novo

Publicidade veterinária no Brasil **não pode** mencionar preço, desconto,
promoção, condição comercial, parcelamento, garantia de resultado ou cura, nem
comparação com concorrentes. Ao adicionar qualquer texto ao site, mantenha o
tom técnico e acolhedor.
