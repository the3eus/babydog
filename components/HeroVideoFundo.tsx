"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/use-media-query";
import { usePrefereMenosMovimento } from "@/lib/use-reduced-motion";
import posterFrame from "@/public/hero-video-poster.webp";
import posterFrameMobile from "@/public/hero-video-poster-mobile.webp";

/**
 * Fundo em vídeo da Hero: toca uma vez a animação oficial da marca (a
 * mesma logo se formando a partir dos pontinhos coloridos) e, ao terminar,
 * congela na imagem estática do último frame — sem loop.
 *
 * Sem áudio de propósito: além do navegador bloquear autoplay com som, um
 * fundo decorativo não deveria competir por atenção sonora com o resto da
 * página (o vídeo original foi reprocessado sem a trilha, ver
 * `public/hero-video.mp4`).
 *
 * Abaixo de `sm` a seção fica retrato (bem mais alta que larga). O mobile
 * usa `hero-video-mobile.mp4`/`hero-video-poster-mobile.webp` (gerados por
 * `scripts/gen-hero-mobile-poster.js` a partir do vídeo vertical enviado
 * pela clínica, 720x1280/9:16) em vez do widescreen original — mas mesmo
 * vertical, a proporção da marca dentro do vídeo (as orelhas quase
 * encostam nas bordas) não bate exatamente com a da seção em todo
 * tamanho de tela. Por isso o mobile usa `object-contain` em vez de
 * `object-cover`: garante a marca 100% visível sempre, em troca de uma
 * leve redução (o vídeo passa a caber pela largura, sem esticar até a
 * altura toda da seção) — bem menor do que a redução do fundo anterior,
 * já que a proporção do vídeo é bem mais próxima da seção agora.
 *
 * Quem prefere menos movimento na tela (`prefers-reduced-motion`) nunca vê
 * o vídeo tocar — recebe direto a imagem estática do último frame.
 */
export function HeroVideoFundo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [terminouPlayback, setTerminouPlayback] = useState(false);
  const prefereMenosMovimento = usePrefereMenosMovimento();
  const ehMobile = useMediaQuery("(max-width: 639px)");

  const mostrarImagemEstatica = terminouPlayback || prefereMenosMovimento;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pausa (não só "não inicia") quando a pessoa liga "menos movimento" no
    // meio da reprodução, e nunca reinicia um vídeo que já terminou — sem
    // isto, alternar a preferência do sistema depois do fim tocava o vídeo
    // de novo escondido atrás da imagem estática.
    if (prefereMenosMovimento || terminouPlayback) {
      video.pause();
      return;
    }

    video.muted = true;
    video.play().catch(() => {
      // Autoplay bloqueado pelo navegador (raro com muted+playsInline) —
      // a imagem estática por baixo já cobre esse caso.
    });
  }, [prefereMenosMovimento, terminouPlayback]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-brand-tint">
      {/* Camada de baixo: imagem estática do último frame. Sempre presente,
          então funciona mesmo se o autoplay for bloqueado. Duas versões
          (vertical vs. widescreen) porque são dois enquadramentos
          diferentes, não só tamanhos diferentes da mesma imagem. `priority`
          só na que a tela atual realmente mostra — nas duas ao mesmo tempo,
          o Next.js pré-carregava a imagem escondida à toa. */}
      <Image
        src={posterFrameMobile}
        alt=""
        fill
        priority={ehMobile}
        sizes="100vw"
        className="object-contain sm:hidden"
      />
      <Image
        src={posterFrame}
        alt=""
        fill
        priority={!ehMobile}
        sizes="100vw"
        className="hidden object-cover sm:block"
      />

      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster={ehMobile ? "/hero-video-poster-mobile.webp" : "/hero-video-poster.webp"}
        onEnded={() => setTerminouPlayback(true)}
        className={`absolute inset-0 size-full object-contain transition-opacity duration-500 sm:object-cover ${
          mostrarImagemEstatica ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Vídeo vertical (9:16) para telas < 640px, widescreen original a
            partir daí — precisa bater com o `sm:` de cima e com os
            breakpoints usados no resto da Hero. */}
        <source src="/hero-video-mobile.mp4" type="video/mp4" media="(max-width: 639px)" />
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
