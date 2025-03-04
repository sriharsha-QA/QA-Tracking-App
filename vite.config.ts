import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-headers",
      closeBundle: () => {
        copyFileSync(resolve("public/_headers"), resolve("dist/_headers"));
        console.log("✅ _headers file copied to dist/");
      },
    },
  ],
});
