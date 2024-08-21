import { useState } from "react"
import type { Message, StructuredResponse } from "~/types"
import { generateGeminiContent } from "./useGemini"
import { generateOpenAiContent } from "./useOpenAi"
import { generateOllamaContent } from "./useOllama"
import content from "~/prompt/orchestra.md?raw"

export type AIProvider = "gemini" | "ollama" | "openai"

type SendPrompt = {
  conversation: Message[]
  prompt: string
  provider?: AIProvider
}

const aiInstructions: Message = {
  content,
  role: "user",
}

export const useAi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const sendPrompt = async ({
    conversation,
    prompt,
    provider = "openai",
  }: SendPrompt): Promise<StructuredResponse | null> => {
    setIsLoading(true)
    setError("")

    const messages: Message[] = [
      aiInstructions,
      ...conversation.map((c) => ({ content: c.content, role: c.role })),
      { content: prompt, role: "user" },
    ]

    try {
      let structuredResponse: StructuredResponse

      switch (provider) {
        case "gemini":
          structuredResponse = await generateGeminiContent(messages)
          break
        case "openai":
          structuredResponse = await generateOpenAiContent(messages)
          break
        case "ollama":
          structuredResponse = await generateOllamaContent(messages)
          break
        default:
          throw new Error("Provider not supported")
      }

      console.log("structuredResponse", structuredResponse)

      setIsLoading(false)
      return structuredResponse
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to fetch response.")
      setIsLoading(false)
      return null
    }
  }

  return {
    error,
    isLoading,
    sendPrompt,
    setError,
  }
}
