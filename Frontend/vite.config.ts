import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  logLevel: "error",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  esbuild: {
    sourcemap: false,
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist-build"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        sourcemap: false,
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
    reportCompressedSize: true,
  },
  server: {
    port: 3001,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://0.0.0.0:5001",
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port: 3001,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
