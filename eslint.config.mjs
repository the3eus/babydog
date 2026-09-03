import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scripts de geração de assets (CJS, rodam fora do app com `node scripts/*.js`).
    "scripts/**",
    // App estático independente do site (JS de navegador, sem build).
    "crm-consorcio/**",
  ]),
]);

export default eslintConfig;
