import { Ollama } from "ollama/dist/browser.mjs"
import { Message, StructuredResponse } from "~/types"
import { codeGeneratorFunction } from "./useGemini"

const ollama = new Ollama({ host: "http://localhost:11434" })

export const generateOllamaContent = async (
  messages: Message[]
): Promise<StructuredResponse> => {
  const response = await ollama.chat({
    model: "llama3",
    messages,
    options: {
      temperature: 0,
    },
    tools: [
      {
        type: "function",
        function: codeGeneratorFunction,
      },
    ],
  })

  let structuredResponse: StructuredResponse = { responseText: "" }

  if (response.message.tool_calls) {
    for (const tool of response.message.tool_calls) {
      structuredResponse = tool.function.arguments as StructuredResponse
    }
  }

  // Check if the model used the provided function
  if (
    !response.message.tool_calls ||
    response.message.tool_calls.length === 0
  ) {
    structuredResponse = { responseText: response.message.content }
  }

  return structuredResponse
}
