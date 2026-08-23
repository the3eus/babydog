import Image from "next/image";
import marcaBabyDog from "@/public/marca-babydog.png";

/**
 * Marca Baby Dog — recorte oficial extraído da arte em alta resolução
 * enviada pela clínica (ver `scripts/gen-marca.js`). `next/image` recebe o
 * import estático, então já conhece as dimensões intrínsecas (585×391) e
 * evita layout shift; a altura é controlada por `className` (h-9, h-11...)
 * e a largura acompanha via `w-auto`.
 */
export function MarcaBabyDog({ className }: { className?: string }) {
  return <Image src={marcaBabyDog} alt="" className={className} />;
}

/** Marca + tipografia, do jeito que aparece nas peças da clínica. */
export function Logo({
  className = "",
  compacto = false,
}: {
  className?: string;
  compacto?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <MarcaBabyDog className={compacto ? "h-9 w-auto" : "h-11 w-auto"} />
      <span
        className={`font-extrabold tracking-tight leading-none ${
          compacto ? "text-xl" : "text-2xl"
        }`}
      >
        <span className="text-brand">Baby</span>
        <span className="text-accent-dark">Dog</span>
      </span>
    </span>
  );
}
