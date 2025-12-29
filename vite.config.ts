import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      "https://nwxrukvgsanuougehruq.supabase.co"
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eHJ1a3Znc2FudW91Z2VocnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjcxMTUsImV4cCI6MjA3ODM0MzExNX0.Om06rD8f3dXpCf2D1m70Ekr6cVG7csF8OU-rwrBN660"
    ),
    "import.meta.env.VITE_BLOG_ADMIN_PASSWORD": JSON.stringify(
      "admin123"
    ),
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./public/assets"),
    },
  },
}));
