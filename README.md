# Site Baby Dog — Centro Médico Veterinário

Landing page da Baby Dog, centro médico veterinário 24h em Jundiaí/SP.

Feito pela [Neotec](https://wa.me/5511940564467).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:3000.

## Como o projeto está organizado

```
lib/content.ts        TODO o texto e os dados de negócio. Comece por aqui.
lib/track.ts          Eventos de conversão (GA4 / GTM / Meta Pixel).
components/           Uma seção da página por arquivo.
app/page.tsx          Monta as seções na ordem da jornada.
app/layout.tsx        Metadados de SEO, fonte e dados estruturados.
app/api/contato/      Recebe os envios do formulário.
```

**Para editar textos, telefone, endereço ou depoimentos, mexa só em
`lib/content.ts`.** Nada de conteúdo fica preso dentro dos componentes.

## Antes de publicar

1. Leia [CONTEUDO-PENDENTE.md](CONTEUDO-PENDENTE.md) — lista o que ainda falta
   a clínica enviar (depoimentos, nota do Google, domínio).
2. Copie `.env.example` para `.env.local` e configure ao menos o destino do
   formulário de contato.
3. Confirme o domínio definitivo em `lib/content.ts` (`clinica.site`).

## Regra de compliance (CRMV)

Publicidade veterinária **não pode** mencionar preço, desconto, promoção,
condição comercial, parcelamento, garantia de resultado ou cura, nem comparação
com concorrentes. Vale para qualquer texto novo no site.

Também não invente depoimentos, números ou especialidades: a seção de
depoimentos some sozinha enquanto estiver vazia, e é assim que deve ser até
chegarem depoimentos reais.

## Verificações já feitas

- Build e ESLint sem erros nem avisos.
- Sem rolagem horizontal em 375px.
- Em 375x812, o título, o subtítulo e o CTA de WhatsApp cabem no primeiro
  viewport (decisão do cliente: no mobile, o segundo CTA, os selos de
  confiança e o "Aberto agora" ficam escondidos abaixo do WhatsApp — só
  aparecem a partir de `sm`).
- Contraste WCAG 2.1 AA conferido nos 134 textos da página: nenhuma falha.
- Alvos de toque dentro do mínimo de 24px do WCAG 2.2.
- Menu mobile, acordeão de dúvidas e validação do formulário testados.
- Links de WhatsApp, telefone, Google Maps e Waze conferidos um a um.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Vercel
