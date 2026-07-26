

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target:
          "https://walkthisway-hyd-bus-stop-audit-coiw.vercel.app",

        changeOrigin: true,
      },
    },
  },
});