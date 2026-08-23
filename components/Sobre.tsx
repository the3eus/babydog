import { sobre } from "@/lib/content";

/**
 * Autoridade institucional: quem somos e o que temos. Vem logo depois do
 * hero porque é a primeira objeção de quem não conhece a clínica ("posso
 * confiar meu animal a vocês?").
 */
export function Sobre() {
  return (
    <section id="a-clinica" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              {sobre.titulo}
            </h2>

            {sobre.paragrafos.map((paragrafo, indice) => (
              <p
                key={indice}
                className="mt-5 text-lg leading-relaxed text-ink-soft"
              >
                {paragrafo}
              </p>
            ))}
          </div>

          {/* Números que reforçam a mensagem, sem inventar métrica nenhuma */}
          <ul className="grid gap-4 self-start sm:grid-cols-3 lg:grid-cols-1">
            {sobre.destaques.map((destaque) => (
              <li
                key={destaque.rotulo}
                className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg shadow-brand/15"
              >
                <p className="text-2xl font-extrabold leading-none tracking-tight">
                  {destaque.numero}
                </p>
                <p className="mt-2 text-sm leading-snug text-white/85">
                  {destaque.rotulo}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
