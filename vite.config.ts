import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // لتجنب مشكلة الـ Permission Denied
    port: 3001, // البورت الذي اشتغل معكِ قبل قليل
    proxy: {
      "/api": {
        target: "https://20.203.244.50",
        changeOrigin: true,
        secure: false, // هامة جداً لتجاوز شهادة الأمان الخارجي لسيرفر غيث
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
});
