import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // Ensures relative asset paths
  plugins: [react()],
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"],
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
