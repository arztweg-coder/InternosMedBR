import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  define: {
    'import.meta.env.VITE_APP_NAME':   JSON.stringify('InternosMed'),
    'import.meta.env.VITE_APP_DOMAIN': JSON.stringify('www.internos.med.br'),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
