"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carrossel horizontal com scroll-snap nativo — arrasta com o mouse ou passa
 * o dedo direto no trilho, sem botão de seta. Só se move quando alguém
 * interage; as bolinhas embaixo indicam a posição (não são clicáveis).
 */
export function Carrossel({
  itens,
  rotulo,
  className = "",
}: {
  itens: React.ReactNode[];
  rotulo: string;
  className?: string;
}) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const arrastoRef = useRef<{ ponteiroId: number; inicioX: number; scrollInicial: number } | null>(null);
  // true enquanto uma rolagem que nós mesmos disparamos ainda está em
  // andamento — evita que o listener de "scroll" recalcule a bolinha a
  // partir da posição final (que perto do fim pode coincidir com a de um
  // item vizinho, por causa do clamp do navegador) e sobrescreva o item que
  // realmente foi escolhido.
  const rolagemProgramaticaRef = useRef(false);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const irPara = useCallback((indice: number) => {
    const trilho = trilhoRef.current;
    const slide = trilho?.children[indice] as HTMLElement | undefined;
    if (!slide) return;
    rolagemProgramaticaRef.current = true;
    setIndiceAtivo(indice);
    slide.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
    window.setTimeout(() => {
      rolagemProgramaticaRef.current = false;
    }, 600);
  }, []);

  // Posição da bolinha por progresso da rolagem (0 a 1), não pela posição em
  // pixels de cada card: perto do fim, vários cards cabem na tela ao mesmo
  // tempo e a rolagem trava antes do penúltimo alinhar à esquerda — comparar
  // pixel a pixel deixava o dot desse item sem nunca acender.
  const indiceMaisProximo = useCallback(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return 0;
    const maxScroll = trilho.scrollWidth - trilho.clientWidth;
    if (maxScroll <= 0) return 0;
    const progresso = trilho.scrollLeft / maxScroll;
    return Math.round(progresso * (trilho.children.length - 1));
  }, []);

  // Mantém as bolinhas sincronizadas quando a pessoa arrasta manualmente.
  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    let frame: number;
    const aoRolar = () => {
      if (rolagemProgramaticaRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndiceAtivo(indiceMaisProximo()));
    };

    trilho.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      trilho.removeEventListener("scroll", aoRolar);
      cancelAnimationFrame(frame);
    };
  }, [indiceMaisProximo]);

  // Arrastar com o mouse: overflow-x-auto só rola nativamente por toque,
  // trackpad ou scrollbar — sem isto, quem usa mouse não tem nenhuma forma
  // de mover o carrossel (não há botão de seta).
  const aoPressionarPonteiro = (evento: React.PointerEvent<HTMLDivElement>) => {
    if (evento.pointerType !== "mouse") return;
    const trilho = trilhoRef.current;
    if (!trilho) return;
    arrastoRef.current = {
      ponteiroId: evento.pointerId,
      inicioX: evento.clientX,
      scrollInicial: trilho.scrollLeft,
    };
    trilho.setPointerCapture(evento.pointerId);
    trilho.style.scrollBehavior = "auto";
  };

  const aoMoverPonteiro = (evento: React.PointerEvent<HTMLDivElement>) => {
    const arrasto = arrastoRef.current;
    const trilho = trilhoRef.current;
    if (!arrasto || !trilho || arrasto.ponteiroId !== evento.pointerId) return;
    trilho.scrollLeft = arrasto.scrollInicial - (evento.clientX - arrasto.inicioX);
  };

  const aoSoltarPonteiro = (evento: React.PointerEvent<HTMLDivElement>) => {
    const trilho = trilhoRef.current;
    if (!trilho || arrastoRef.current?.ponteiroId !== evento.pointerId) return;
    trilho.releasePointerCapture(evento.pointerId);
    trilho.style.scrollBehavior = "";
    arrastoRef.current = null;
    irPara(indiceMaisProximo());
  };

  return (
    <div className={className}>
      <div
        ref={trilhoRef}
        role="group"
        aria-label={rotulo}
        onPointerDown={aoPressionarPonteiro}
        onPointerMove={aoMoverPonteiro}
        onPointerUp={aoSoltarPonteiro}
        onPointerCancel={aoSoltarPonteiro}
        className="scrollbar-none relative flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing active:snap-none select-none"
      >
        {itens.map((item, i) => (
          <div key={i} className="shrink-0 snap-start">
            {item}
          </div>
        ))}
      </div>

      {itens.length > 1 && (
        <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-2">
          {itens.map((_, i) => (
            <span
              key={i}
              className={`size-2 rounded-full transition-all ${
                i === indiceAtivo ? "w-5 bg-current" : "bg-current/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
