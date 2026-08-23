import type { Metadata, Viewport } from "next";
import { Oswald, Poppins } from "next/font/google";
import { Analytics, GtmNoscript } from "@/components/Analytics";
import { clinica } from "@/lib/content";
import "./globals.css";

/**
 * Poppins: geométrica e arredondada, é a família que mais se aproxima da
 * tipografia usada nas peças da clínica. Servida pelo próprio domínio via
 * next/font, sem requisição a servidor externo.
 */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Oswald: condensada e de traço firme, usada como fonte de destaque em
 * títulos pontuais (ver `font-oswald` em globals.css). Mesmo tratamento da
 * Poppins — self-hosted via next/font, sem link para fonts.googleapis.com.
 */
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const titulo = `${clinica.nomeCurto} — Clínica Veterinária 24h em ${clinica.endereco.cidade}`;
const descricao =
  "Centro médico veterinário em Jundiaí aberto 24 horas, todos os dias. Consultas, especialidades, exames, cirurgias e internação para cães, gatos e animais silvestres.";

export const metadata: Metadata = {
  metadataBase: new URL(clinica.site),
  title: {
    default: titulo,
    template: `%s | ${clinica.nomeCurto}`,
  },
  description: descricao,
  keywords: [
    "clínica veterinária Jundiaí",
    "veterinário 24 horas Jundiaí",
    "emergência veterinária Jundiaí",
    "centro médico veterinário",
    "veterinário Jardim Liberdade",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: clinica.site,
    siteName: clinica.nome,
    title: titulo,
    description: descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: descricao,
  },
  // Espelha o robots.txt: nada é indexado enquanto o domínio for provisório.
  robots: {
    index: clinica.indexavel,
    follow: clinica.indexavel,
  },
};

export const viewport: Viewport = {
  themeColor: "#076589",
};

/** Dados estruturados para busca local e para o painel do Google. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "VeterinaryCare",
  name: clinica.nome,
  description: descricao,
  url: clinica.site,
  telephone: clinica.telefone.e164,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${clinica.endereco.logradouro}, ${clinica.endereco.numero}`,
    addressLocality: clinica.endereco.cidade,
    addressRegion: clinica.endereco.uf,
    postalCode: clinica.endereco.cep,
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  sameAs: [clinica.redes.instagram, clinica.redes.facebook],
  areaServed: {
    "@type": "City",
    name: clinica.endereco.cidade,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <GtmNoscript />
        {children}
        <script
          type="application/ld+json"
          // O conteúdo é estático e definido no próprio código, sem entrada de usuário.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dadosEstruturados),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
