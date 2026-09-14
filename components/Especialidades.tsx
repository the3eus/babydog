import { especialidades, especialidadesSecao } from "@/lib/content";
import { IconeCheck } from "./icons";

/**
 * Lista as especialidades por nome, sem descrição por item — quem já sabe
 * que precisa de um oftalmologista, por exemplo, só quer confirmar que a
 * clínica tem. "Especialidades" em `atendimentos` (Atendimentos.tsx) já
 * cobre o conceito geral; esta seção detalha quais.
 */
export function Especialidades() {
  return (
    <section className="bg-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-dark">
            {especialidadesSecao.sobrelinha}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {especialidadesSecao.titulo}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            {especialidadesSecao.subtitulo}
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-3">
          {especialidades.map((especialidade) => (
            <li
              key={especialidade}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-brand/10"
            >
              <IconeCheck className="size-4 shrink-0 text-accent-dark" />
              {especialidade}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
