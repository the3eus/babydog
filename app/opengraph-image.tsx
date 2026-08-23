import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { clinica } from "@/lib/content";

export const alt = `${clinica.nomeCurto} — Clínica Veterinária 24h em ${clinica.endereco.cidade}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagem de compartilhamento (og:image / twitter:image). Sem ela, mandar o
 * link no WhatsApp ou Instagram gerava preview quebrado — o Next deriva o
 * card do Twitter automaticamente a partir deste arquivo.
 */
export default async function Image() {
  const marcaBuffer = await readFile(
    join(process.cwd(), "public", "marca-babydog.png"),
  );
  const marcaSrc = `data:image/png;base64,${marcaBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#076589",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: "#28AA9E",
            opacity: 0.35,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#ffffff",
            }}
          >
            {/* next/image não funciona dentro de ImageResponse — o Satori
                exige <img> puro com a imagem embutida como data URI. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={marcaSrc} width={64} height={43} alt="" />
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 44, fontWeight: 800, color: "#ffffff" }}>
              Baby
            </span>
            <span style={{ fontSize: 44, fontWeight: 800, color: "#A5E9E1" }}>
              Dog
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              maxWidth: 920,
            }}
          >
            Cuidado completo para o seu pet, 24 horas por dia
          </span>
          <span style={{ display: "flex", fontSize: 30, color: "#E4F5F3" }}>
            Centro Médico Veterinário em {clinica.endereco.cidade}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: "#25D366",
              color: "#04372A",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {clinica.telefone.exibicao}
          </span>
          <span style={{ display: "flex", fontSize: 26, color: "#ffffff" }}>
            Aberto 24h, todos os dias
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
