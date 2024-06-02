import { Ollama } from "ollama/dist/browser.mjs"
import { Message } from "~/types"

const ollama = new Ollama({ host: "http://localhost:11434" })

export const generateOllamaContent = async (
  messages: Message[]
): Promise<string> => {
  const dataOllama = await ollama.chat({
    model: "llama3",
    messages,
    options: {
      temperature: 0,
    },
  })
  return dataOllama.message.content
}
