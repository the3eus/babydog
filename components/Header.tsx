"use client";

import { useEffect, useState } from "react";
import { clinica, linkTelefone, navegacao } from "@/lib/content";
import { rastrear } from "@/lib/track";
import { useRolagemPassou } from "@/lib/use-scroll-passed";
import { BotaoWhatsApp } from "./CTA";
import { IconeFechar, IconeMenu, IconeTelefone } from "./icons";
import { Logo } from "./Logo";

export function Header() {
  const [aberto, setAberto] = useState(false);
  // Header fica sólido assim que a página sai do topo.
  const rolou = useRolagemPassou(16);

  // Com o menu aberto: trava o scroll do fundo e permite fechar com Esc
  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        rolou
          ? "bg-white/95 shadow-md shadow-brand/5 backdrop-blur-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <a
          href="#topo"
          className="shrink-0"
          aria-label={`${clinica.nomeCurto} — ir para o início`}
        >
          <Logo compacto />
        </a>

        {/* Navegação em telas grandes */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {navegacao.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-ink-soft transition-colors hover:bg-brand-light hover:text-brand"
            >
              {item.rotulo}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={linkTelefone}
            onClick={() => rastrear("clique_telefone", { origem: "header" })}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-brand transition-colors hover:bg-brand-light"
          >
            <IconeTelefone className="size-[1.15rem]" />
            <span className="hidden xl:inline">
              {clinica.telefone.exibicao}
            </span>
            <span className="xl:hidden">Ligar</span>
          </a>
          <BotaoWhatsApp
            origem="header"
            rotulo="Agendar"
            className="!min-h-[2.85rem] !px-5 text-[0.95rem]"
          />
        </div>

        {/* Botão do menu em telas pequenas */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="inline-flex size-11 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-light lg:hidden"
        >
          {aberto ? (
            <IconeFechar className="size-7" />
          ) : (
            <IconeMenu className="size-7" />
          )}
        </button>
      </div>

      {/* Painel do menu em telas pequenas */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="border-t border-brand-light bg-white lg:hidden"
      >
        <nav
          aria-label="Navegação principal"
          className="flex flex-col gap-1 px-5 py-4"
        >
          {navegacao.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setAberto(false)}
              className="rounded-2xl px-4 py-3.5 text-lg font-medium text-ink transition-colors hover:bg-brand-light hover:text-brand"
            >
              {item.rotulo}
            </a>
          ))}

          <div className="mt-3 flex flex-col gap-2.5 border-t border-brand-light pt-4">
            <BotaoWhatsApp origem="menu_mobile" className="w-full" />
            <a
              href={linkTelefone}
              onClick={() => {
                rastrear("clique_telefone", { origem: "menu_mobile" });
                setAberto(false);
              }}
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full bg-white px-7 font-semibold text-brand ring-2 ring-brand/15 transition-all hover:ring-brand/35"
            >
              <IconeTelefone className="size-5" />
              {clinica.telefone.exibicao}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
