import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    define: {
      "process.env.OLLAMA_API_URL": JSON.stringify(env.OLLAMA_API_URL),
      "process.env.OPENAI_API_KEY": JSON.stringify(env.OPENAI_API_KEY),
      "process.env.OPENAI_API_URL": JSON.stringify(env.OPENAI_API_URL),
    },
    plugins: [react(), svgr()],
    server: {
      open: true,
      port: 3001,
    },
  }
})
