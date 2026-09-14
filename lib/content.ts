/**
 * FONTE ÚNICA DE VERDADE — Baby Dog Centro Médico Veterinário
 *
 * Todo o conteúdo do site vive aqui. Para editar textos, dados de contato ou
 * adicionar depoimentos, altere apenas este arquivo.
 *
 * ⚠️ COMPLIANCE CRMV — regra obrigatória para qualquer texto adicionado aqui:
 * é proibido mencionar preço, desconto, promoção, condição comercial,
 * parcelamento, garantia de resultado/cura ou comparação com concorrentes.
 * O tom deve ser técnico e acolhedor, nunca sensacionalista.
 *
 * Itens marcados com "PENDENTE" aguardam confirmação da clínica.
 * Veja CONTEUDO-PENDENTE.md na raiz do projeto.
 */

/* -------------------------------------------------------------------------- */
/* Dados da clínica (confirmados)                                             */
/* -------------------------------------------------------------------------- */

export const clinica = {
  nome: "Baby Dog Centro Médico Veterinário",
  nomeCurto: "Baby Dog",
  /**
   * ⚠️ PENDENTE — NÃO PUBLICAR SEM CONFERIR.
   * Estes dados vêm do registro do domínio no registro.br (RDAP), cuja última
   * alteração é de 2024. A clínica confirmou que hoje a Dra. Beatriz Area
   * Fernandes é a única proprietária, então "Preti & Fernandes" provavelmente
   * está desatualizado. Enquanto `exibirDadosLegais` for false, o rodapé omite
   * a linha de CNPJ — CNPJ ausente não afirma nada, CNPJ errado afirma.
   */
  razaoSocial: "Baby Dog Preti & Fernandes LTDA",
  cnpj: "37.979.497/0001-41",
  exibirDadosLegais: false,

  responsavelTecnica: {
    nome: "Dra. Beatriz Area Fernandes",
    /** Proprietária e responsável técnica — confirmado pela clínica. */
    cargo: "Proprietária e responsável técnica",
    crmv: "CRMV-SP 31153",
  },

  endereco: {
    logradouro: "Avenida Antônio Frederico Ozanan",
    numero: "4558",
    bairro: "Jardim Liberdade",
    cidade: "Jundiaí",
    uf: "SP",
    cep: "13215-485",
    /** Linha única para exibição em texto. */
    completo:
      "Avenida Antônio Frederico Ozanan, 4558 — Jardim Liberdade, Jundiaí — SP, 13215-485",
    /**
     * Versão para geocodificação (Google Maps e Waze).
     * Só vírgulas: travessão atrapalha a busca de endereço.
     */
    paraMapa:
      "Avenida Antônio Frederico Ozanan, 4558, Jardim Liberdade, Jundiaí, SP, 13215-485",
  },

  /**
   * Linha principal, confirmada pela clínica. Serve para WhatsApp e ligação,
   * e é também o número da emergência 24h — inclusive de madrugada.
   */
  telefone: {
    /** Formato internacional para o atributo href="tel:" */
    e164: "+5511914985464",
    /** Só dígitos com DDI, para links wa.me */
    whatsapp: "5511914985464",
    /** Formato de exibição para humanos */
    exibicao: "(11) 91498-5464",
    /** Como a clínica chama essa linha, para exibição nos cartões de contato. */
    nome: "Recepção",
  },

  /**
   * Linha da internação, confirmada pela clínica.
   * Canal para tirar dúvidas sobre pets internados — não é a linha de
   * agendamento nem a de emergência.
   */
  telefoneInternacao: {
    e164: "+5511973480997",
    whatsapp: "5511973480997",
    exibicao: "(11) 97348-0997",
    nome: "Internação",
  },

  horario: "Aberto 24 horas, todos os dias",

  redes: {
    instagram: "https://www.instagram.com/babydog_cmv/",
    facebook: "https://www.facebook.com/babydogcentromedicoveterinario/",
  },

  /**
   * Endereço do site. Alimenta canonical, OG, sitemap e dados estruturados.
   *
   * DECISÃO DO CLIENTE (20/08/2026): publicar primeiro em .vercel.app para
   * validação. Enquanto `indexavel` for false, o site sobe com noindex e o
   * robots.txt bloqueia tudo — nada é indexado antes da aprovação.
   *
   * PENDENTE: domínio definitivo. O antigo, clinicaveterinariababydog.com.br,
   * venceu em 04/08/2026 e consta como inativo no registro.br.
   * Ao definir: troque `site`, mude `indexavel` para true e publique de novo.
   */
  site: "https://babydog.vercel.app",
  indexavel: false,
} as const;

/* -------------------------------------------------------------------------- */
/* Agência                                                                    */
/* -------------------------------------------------------------------------- */

export const agencia = {
  nome: "Neotec",
  whatsapp: "5511940564467",
} as const;

/* -------------------------------------------------------------------------- */
/* Links de ação                                                              */
/* -------------------------------------------------------------------------- */

const msgPadrao =
  "Olá! Vim pelo site e gostaria de falar sobre o atendimento do meu pet.";

/** Monta um link de WhatsApp com mensagem pré-preenchida. */
export function linkWhatsApp(mensagem: string = msgPadrao): string {
  return `https://wa.me/${clinica.telefone.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const linkTelefone = `tel:${clinica.telefone.e164}`;

const enderecoParaMapa = encodeURIComponent(
  `${clinica.nome}, ${clinica.endereco.paraMapa}`,
);

/** Abre a rota até a clínica no app do Google Maps (ou na web). */
export const linkGoogleMaps = `https://www.google.com/maps/dir/?api=1&destination=${enderecoParaMapa}`;

/** Abre a rota até a clínica no Waze, já em modo navegação. */
export const linkWaze = `https://waze.com/ul?q=${enderecoParaMapa}&navigate=yes`;

/**
 * Abre a ficha da clínica no Google, onde ficam as avaliações.
 * PENDENTE: quando a clínica enviar o link curto do perfil dela, troque por
 * ele — cai direto na aba de avaliações, com um clique a menos.
 */
export const linkAvaliacoesGoogle = `https://www.google.com/maps/search/?api=1&query=${enderecoParaMapa}`;

/** Mapa incorporado — não exige chave de API. */
export const embedMapa = `https://www.google.com/maps?q=${enderecoParaMapa}&output=embed`;

/* -------------------------------------------------------------------------- */
/* Navegação                                                                  */
/* -------------------------------------------------------------------------- */

export const navegacao = [
  { rotulo: "A clínica", href: "#a-clinica" },
  { rotulo: "Atendimentos", href: "#atendimentos" },
  { rotulo: "Diferenciais", href: "#diferenciais" },
  { rotulo: "Dúvidas", href: "#duvidas" },
  { rotulo: "Contato", href: "#contato" },
] as const;

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const hero = {
  sobrelinha: "Centro Médico Veterinário em Jundiaí",
  titulo: "Cuidado completo para o seu pet, 24 horas por dia",
  subtitulo:
    "Consultas, exames de imagem, cirurgias e internação em estrutura própria — de portas abertas 24h, todos os dias.",
  ctaPrimario: "Falar no WhatsApp",
  ctaSecundario: "Ligar agora",
  selos: ["Equipe com diversos especialistas", "Estrutura própria completa"],
} as const;

/** Selo de plano aceito, exibido na hero. Logo em `public/petlove-logo.png`. */
export const heroPetlove = {
  texto: "Aceitamos o plano Petlove Saúde",
} as const;

/* -------------------------------------------------------------------------- */
/* Sobre a clínica                                                            */
/* -------------------------------------------------------------------------- */

export const sobre = {
  titulo: "Cuidado de perto, em cada etapa",
  paragrafos: [
    "A Baby Dog é um centro médico veterinário em Jundiaí que acompanha o seu pet com atenção e carinho — da consulta ao tratamento, sempre com uma equipe pronta para cuidar de quem você ama.",
  ],
  destaques: [
    { numero: "24h", rotulo: "De portas abertas, todos os dias" },
    { numero: "Cães e gatos", rotulo: "Atendimento clínico e cirúrgico" },
    { numero: "Equipe", rotulo: "Diversos especialistas no mesmo lugar" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Atendimentos                                                               */
/* -------------------------------------------------------------------------- */

export type Atendimento = {
  icone:
    | "estetoscopio"
    | "especialista"
    | "exame"
    | "cirurgia"
    | "internacao"
    | "farmacia"
    | "silvestre";
  titulo: string;
  descricao: string;
};

export const atendimentos: Atendimento[] = [
  {
    icone: "estetoscopio",
    titulo: "Consultas",
    descricao:
      "Avaliação clínica para entender o que o seu pet está sentindo e definir o melhor caminho de cuidado.",
  },
  {
    icone: "especialista",
    titulo: "Especialidades",
    descricao:
      "Corpo clínico com diversos especialistas, para casos que pedem um olhar mais aprofundado. Atendimento com hora marcada — fale com a gente antes para confirmar a disponibilidade.",
  },
  {
    icone: "exame",
    titulo: "Exames de imagem",
    descricao:
      "Exames de imagem realizados na nossa sala própria, como apoio ao diagnóstico clínico.",
  },
  {
    icone: "cirurgia",
    titulo: "Cirurgias",
    descricao:
      "Procedimentos cirúrgicos conduzidos pela nossa equipe, do preparo ao pós-operatório.",
  },
  {
    icone: "internacao",
    titulo: "Internação",
    descricao:
      "Acompanhamento contínuo para pets que precisam de observação e cuidado de perto.",
  },
  {
    icone: "farmacia",
    titulo: "Farmácia veterinária",
    descricao:
      "Medicamentos disponíveis no local, para você não precisar procurar em outro lugar.",
  },
  {
    icone: "silvestre",
    titulo: "Animais silvestres",
    descricao:
      "Atendimento a aves e outros animais silvestres, com hora marcada. Fale com a gente antes para confirmar a disponibilidade.",
  },
];

export const atendimentosSecao = {
  sobrelinha: "Atendimentos",
  titulo: "O que a Baby Dog faz pelo seu pet",
  subtitulo:
    "Estrutura completa para acompanhar da rotina à urgência, sem precisar encaminhar seu animal para outro endereço.",
} as const;

/* -------------------------------------------------------------------------- */
/* Diferenciais                                                               */
/* -------------------------------------------------------------------------- */

export type Diferencial = {
  icone: "relogio" | "equipe" | "predio" | "plano";
  titulo: string;
  descricao: string;
};

export const diferenciais: Diferencial[] = [
  {
    icone: "relogio",
    titulo: "Aberto 24 horas, todos os dias",
    descricao:
      "Madrugada, fim de semana ou feriado: se o seu pet precisar, tem alguém aqui para atender.",
  },
  {
    icone: "equipe",
    titulo: "Diversos especialistas",
    descricao:
      "Casos que fogem da rotina encontram aqui profissionais com formação específica na área.",
  },
  {
    icone: "predio",
    titulo: "Estrutura própria",
    descricao:
      "Exames de imagem, centro cirúrgico, internação e farmácia no mesmo endereço do atendimento.",
  },
  {
    icone: "plano",
    titulo: "Credenciada Petlove Saúde",
    descricao:
      "Atendemos tutores com plano Petlove Saúde. Tem outro plano? Fale com a gente para confirmar.",
  },
];

export const diferenciaisSecao = {
  sobrelinha: "Por que a Baby Dog",
  titulo: "Motivos para confiar o seu pet à nossa equipe",
} as const;

/* -------------------------------------------------------------------------- */
/* Especialidades                                                             */
/* -------------------------------------------------------------------------- */

export const especialidadesSecao = {
  sobrelinha: "Especialidades",
  titulo: "Especialistas para casos que pedem um olhar mais aprofundado",
  subtitulo:
    "Atendimento com hora marcada, mediante confirmação prévia de disponibilidade.",
} as const;

export const especialidades = [
  "Ortopedia",
  "Endocrinologia",
  "Oftalmologia",
  "Ultrassonografia",
  "Gastroenterologia",
  "Oncologia",
  "Nefrologia",
] as const;

/* -------------------------------------------------------------------------- */
/* Nossa estrutura                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Fotos reais da clínica. `arquivo` referencia
 * `public/estrutura/{arquivo}.webp` (gerado por `scripts/gen-estrutura.js`).
 * Exibidas em carrossel (não grade) — a ordem aqui é a ordem de exibição,
 * ver `components/Estrutura.tsx`.
 */
export type ItemEstrutura = {
  arquivo: string;
  titulo: string;
  descricao: string;
};

export const estrutura: ItemEstrutura[] = [
  {
    arquivo: "sala-imagem",
    titulo: "Sala de imagem",
    descricao:
      "Espaço próprio para exames de imagem, sinalizado e isolado do restante da clínica.",
  },
  {
    arquivo: "consultorio",
    titulo: "Consultório",
    descricao:
      "Ambiente reservado para a consulta, com espaço para você e o seu pet ficarem à vontade.",
  },
  {
    arquivo: "ambulatorio",
    titulo: "Ambulatório",
    descricao:
      "Mesa de procedimentos em aço inox e estrutura para o atendimento clínico do dia a dia.",
  },
  {
    arquivo: "farmacia",
    titulo: "Farmácia veterinária",
    descricao:
      "Medicamentos e produtos organizados no local, prontos para o tratamento do seu pet.",
  },
  {
    arquivo: "espera",
    titulo: "Espaço de espera",
    descricao: "Copa e água disponíveis para tornar a espera mais confortável.",
  },
];

export const estruturaSecao = {
  sobrelinha: "Conheça a clínica",
  titulo: "Nossa estrutura",
  subtitulo:
    "Consultório, ambulatório, sala de imagem e farmácia — tudo no mesmo endereço, para o atendimento do seu pet não parar no meio do caminho.",
} as const;

/* -------------------------------------------------------------------------- */
/* Como funciona                                                              */
/* -------------------------------------------------------------------------- */

export const comoFunciona = {
  sobrelinha: "Simples assim",
  titulo: "Como agendar o atendimento",
  passos: [
    {
      titulo: "Chame no WhatsApp ou ligue",
      descricao:
        "A qualquer hora do dia ou da noite. Não existe horário errado para procurar ajuda.",
    },
    {
      titulo: "Conte o que está acontecendo",
      descricao:
        "Nossa equipe ouve o caso, orienta o próximo passo e organiza o atendimento do seu pet.",
    },
    {
      titulo: "Traga o seu pet",
      descricao:
        "Consulta, exames de imagem, cirurgia ou internação: o que for necessário acontece no mesmo lugar.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Prova social                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Depoimentos reais, copiados do perfil da clínica no Google em 22/08/2026.
 * Alguns foram encurtados (marcados com "…") para caber no formato de
 * cartão — sempre a partir do início da avaliação, sem reescrever nem
 * juntar trechos de partes diferentes. Nada foi inventado.
 *
 * Formato: { texto: "...", autor: "Nome do tutor", pet: "Nome do pet" }
 * `fonte: "google"` liga o selo "Avaliação verificada no Google" no cartão.
 */
export const depoimentos: {
  texto: string;
  autor: string;
  pet?: string;
  fonte?: "google";
}[] = [
  {
    texto: "Dr Marcel cuidou com muito carinho e profissionalismo do meu menino Boris! Recomendo a clínica, ganharam uma nova cliente!",
    autor: "Andressa Uchoa",
    pet: "Boris",
    fonte: "google",
  },
  {
    texto: "Melhor clínica veterinária de Jundiaí! Atendimento e tratamento impecáveis. Cuidaram com muito carinho do nosso eterno Ozzy, que infelizmente faleceu após ingerir um corpo estranho. Agora, o Fred também está sendo acompanhado por eles, e continuamos recebendo um atendimento excepcional. Indico de olhos fechados.",
    autor: "Debora Porfirio",
    pet: "Fred",
    fonte: "google",
  },
  {
    texto: "Ambiente limpo, organizado e acolhedor. A equipe é extremamente atenciosa, profissional e transmite muita confiança. O atendimento é de excelência e o trabalho realizado é impecável. Confio plenamente neles e, por isso, não pretendo procurar outro lugar. Recomendo de olhos fechados!",
    autor: "Adna Miranda",
    fonte: "google",
  },
  {
    texto: "Quero deixar aqui meu agradecimento e minha admiração por toda a equipe da Clínica Veterinária Baby Dog, em especial o Dr. Marcel. Meus dois cachorros, Bob e Mel, foram cuidados com muito amor, carinho e dedicação por toda a equipe de veterinários e recepcionistas…",
    autor: "Henrique Paganatto",
    pet: "Bob e Mel",
    fonte: "google",
  },
  {
    texto: "Recebi indicação da Baby Dog através do plano da Pet Love. Tenho duas pugs, uma com 7 anos e 2 anos. A minha pug de 2 anos é paciente renal (nefropatia juvenil), e faz acompanhamento com a nefrologista Dra. Anna pela Baby Dog. Estamos adorando o tratamento que ela recebeu, ainda mais por ser uma paciente renal…",
    autor: "Beatriz Bogajo",
    fonte: "google",
  },
  {
    texto: "Sempre me atende muito bem, e o tratamento dos meus pets sempre da melhor qualidade. As doutoras e as meninas do atendimento são da melhor qualidade, recomendo a todos.",
    autor: "Johnny Christian",
    fonte: "google",
  },
];

/**
 * Prova social do Google — nota e total confirmados direto no perfil oficial
 * em 22/08/2026 (4,5 de 5, 232 avaliações). Substitui o "4,5 de 5 com 112
 * avaliações" que circulava em diretórios de terceiros (Solutudo, Petlove,
 * VetClínicas BR): aquele número vinha de fora, estava desatualizado e nunca
 * tinha sido conferido no perfil oficial.
 *
 * Se `GOOGLE_PLACES_API_KEY`/`GOOGLE_PLACES_ID` forem configuradas (ver
 * .env.example), a nota e o total ao vivo da Places API tomam prioridade
 * sobre estes valores estáticos — ver `lib/avaliacoes-google.ts`.
 */
export const avaliacao = {
  exibir: true,
  nota: "4,5" as string | null,
  total: "232",
  fonte: "Google",
} as const;

export const depoimentosSecao = {
  sobrelinha: "Quem já passou por aqui",
  titulo: "O que os tutores dizem",
  /**
   * Usado enquanto não houver depoimentos cadastrados. Prometer "o que os
   * tutores dizem" e não mostrar nenhuma fala deixa a seção com cara de
   * quebrada; sem depoimento, o título fala do que está de fato na tela.
   */
  tituloSemDepoimentos: "Tutores de Jundiaí já confiam na Baby Dog",
  chamadaGoogle: "Ver as avaliações no Google",
} as const;

/* -------------------------------------------------------------------------- */
/* Dúvidas frequentes                                                         */
/* -------------------------------------------------------------------------- */

export const duvidas = {
  sobrelinha: "Dúvidas frequentes",
  titulo: "Perguntas que recebemos com frequência",
  itens: [
    {
      pergunta: "Vocês atendem de madrugada, fim de semana e feriado?",
      resposta:
        "Sim. A Baby Dog funciona 24 horas por dia, todos os dias do ano. Se o seu pet precisar de atendimento fora do horário comercial, é só chamar no WhatsApp ou ligar.",
    },
    {
      pergunta: "Preciso agendar antes ou posso chegar direto?",
      resposta:
        "Fale com a gente pelo WhatsApp ou por telefone antes de vir. Assim conseguimos entender o caso do seu pet, orientar o próximo passo e organizar o atendimento da melhor forma para vocês dois.",
    },
    {
      pergunta: "Vocês atendem gatos também?",
      resposta:
        "Sim. Nosso atendimento clínico e cirúrgico contempla cães e gatos.",
    },
    {
      pergunta: "Os especialistas atendem em qualquer horário?",
      resposta:
        "As consultas com especialistas são feitas com hora marcada. Fale com a gente pelo WhatsApp ou por telefone antes, para confirmarmos a disponibilidade.",
    },
    {
      pergunta: "Vocês atendem animais silvestres ou exóticos?",
      resposta:
        "Sim, atendemos animais silvestres com hora marcada. Fale com a gente pelo WhatsApp ou telefone antes de vir, para confirmarmos a disponibilidade.",
    },
    {
      pergunta: "A clínica aceita plano de saúde pet?",
      resposta:
        "Somos credenciados à Petlove Saúde. Se você tem outro plano, fale com a gente antes da consulta para confirmarmos a cobertura.",
    },
    {
      pergunta: "Onde fica a Baby Dog?",
      resposta: `Estamos na ${clinica.endereco.logradouro}, ${clinica.endereco.numero}, no ${clinica.endereco.bairro}, em ${clinica.endereco.cidade}. Na seção de localização você abre a rota direto no Google Maps ou no Waze.`,
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Contato                                                                    */
/* -------------------------------------------------------------------------- */

export const contato = {
  sobrelinha: "Fale com a gente",
  titulo: "Seu pet precisa de atendimento? Estamos abertos agora.",
  subtitulo:
    "Escolha o canal mais confortável para você. A qualquer hora, todos os dias.",
  formulario: {
    titulo: "Prefere preencher e mandar pelo WhatsApp?",
    descricao:
      "Preencha os dados abaixo. Vamos abrir o WhatsApp com a mensagem pronta, direto para a nossa recepção — é só conferir e enviar por lá.",
    consentimento:
      "Autorizo a Baby Dog a usar meus dados para entrar em contato sobre este atendimento.",
    enviar: "Continuar no WhatsApp",
    sucesso:
      "Abrimos o WhatsApp com sua mensagem pronta. Confirme o envio por lá para falar com a nossa recepção.",
    erro:
      "Preencha os campos obrigatórios (e o nome do convênio, se marcado) e autorize o contato para continuar pelo WhatsApp.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Localização                                                                */
/* -------------------------------------------------------------------------- */

export const localizacao = {
  sobrelinha: "Como chegar",
  titulo: "Onde fica a Baby Dog",
  subtitulo:
    "Estamos na Avenida Antônio Frederico Ozanan, no Jardim Liberdade. Toque no mapa para abrir a rota no seu aplicativo de navegação.",
  ctaMaps: "Abrir no Google Maps",
  ctaWaze: "Abrir no Waze",
} as const;
