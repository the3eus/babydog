import { Atendimentos } from "@/components/Atendimentos";
import { ComoFunciona } from "@/components/ComoFunciona";
import { Contato } from "@/components/Contato";
import { Depoimentos } from "@/components/Depoimentos";
import { Diferenciais } from "@/components/Diferenciais";
import { Duvidas } from "@/components/Duvidas";
import { Estrutura } from "@/components/Estrutura";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Localizacao } from "@/components/Localizacao";
import { Sobre } from "@/components/Sobre";
import { WhatsAppFlutuante } from "@/components/WhatsAppFlutuante";
import { buscarAvaliacoesGoogle } from "@/lib/avaliacoes-google";

/**
 * Ordem das seções na página — ver histórico de commits para o raciocínio
 * por trás da ordem atual.
 *
 *   Hero, Sobre, Contato, Estrutura, Atendimentos, Como funciona,
 *   Depoimentos, Dúvidas, Diferenciais, Localização
 */
export default async function Home() {
  const avaliacoesGoogle = await buscarAvaliacoesGoogle();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo" className="flex-1">
        <Hero />
        <Sobre />
        <Contato />
        <Estrutura />
        <Atendimentos />
        <ComoFunciona />
        <Depoimentos avaliacoesGoogle={avaliacoesGoogle} />
        <Duvidas />
        <Diferenciais />
        <Localizacao />
      </main>

      <Footer />
      <WhatsAppFlutuante />
    </>
  );
}
