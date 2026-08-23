"use client";

import { agencia, clinica, linkTelefone, navegacao } from "@/lib/content";
import { rastrear } from "@/lib/track";
import {
  IconeFacebook,
  IconeInstagram,
  IconeTelefone,
} from "./icons";
import { Logo } from "./Logo";

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-light bg-surface-alt">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identidade */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs leading-relaxed text-ink-soft">
              Centro médico veterinário em {clinica.endereco.cidade}, de portas
              abertas 24 horas por dia para cães, gatos e animais silvestres.
            </p>

            <div className="mt-5 flex gap-2.5">
              <a
                href={clinica.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Baby Dog"
                onClick={() =>
                  rastrear("clique_rede_social", { rede: "instagram" })
                }
                className="inline-flex size-11 items-center justify-center rounded-full bg-white text-brand ring-1 ring-brand/10 transition-colors hover:bg-brand hover:text-white"
              >
                <IconeInstagram className="size-5" />
              </a>
              <a
                href={clinica.redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Baby Dog"
                onClick={() =>
                  rastrear("clique_rede_social", { rede: "facebook" })
                }
                className="inline-flex size-11 items-center justify-center rounded-full bg-white text-brand ring-1 ring-brand/10 transition-colors hover:bg-brand hover:text-white"
              >
                <IconeFacebook className="size-5" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <nav aria-label="Rodapé">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
              Navegação
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block py-1 text-ink-soft transition-colors hover:text-brand"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
              Contato
            </h2>
            <address className="mt-4 space-y-3 not-italic leading-relaxed text-ink-soft">
              <p>
                {clinica.endereco.logradouro}, {clinica.endereco.numero}
                <br />
                {clinica.endereco.bairro} — {clinica.endereco.cidade}/
                {clinica.endereco.uf}
                <br />
                CEP {clinica.endereco.cep}
              </p>
              <p>
                <a
                  href={linkTelefone}
                  onClick={() =>
                    rastrear("clique_telefone", { origem: "rodape" })
                  }
                  className="inline-flex items-center gap-2 py-1 font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  <IconeTelefone className="size-4" />
                  {clinica.telefone.exibicao}
                </a>
              </p>
              <p className="font-medium text-ink">{clinica.horario}</p>
            </address>
          </div>
        </div>

        {/* Linha legal + crédito da agência */}
        <div className="mt-12 flex flex-col gap-4 border-t border-brand-light pt-7 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {/*
              O CNPJ só entra depois de confirmado. O registro público ainda diz
              "Preti & Fernandes", mas a clínica informou que hoje a proprietária
              é única — ver CONTEUDO-PENDENTE.md.
            */}
            <p>
              © {ano} {clinica.nome}.
              {clinica.exibirDadosLegais ? ` CNPJ ${clinica.cnpj}.` : ""}
            </p>
            <p>
              {clinica.responsavelTecnica.cargo}:{" "}
              {clinica.responsavelTecnica.nome} —{" "}
              {clinica.responsavelTecnica.crmv}.
            </p>
          </div>

          <p>
            Feito pela{" "}
            <a
              href={`https://wa.me/${agencia.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-1 font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-dark hover:decoration-brand"
            >
              {agencia.nome}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
