import { defineConfig } from "vite";

// Configuração simples — só serve HTML/CSS/JS puro
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
});
