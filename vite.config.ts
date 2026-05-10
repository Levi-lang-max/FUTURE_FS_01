import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
import path from "path";

resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
