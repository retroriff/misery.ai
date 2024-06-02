import { useState } from "react"
import type { Message } from "~/types"
import { generateGeminiContent } from "./useGemini"
import { generateOpenAiContent } from "./useOpenAi"
import { generateOllamaContent } from "./useOllama"
import content from "~/prompt/orchestra.md?raw"

export type AIProvider = "gemini" | "openai" | "ollama"

type SendPrompt = {
  conversation: Message[]
  prompt: string
  provider?: AIProvider
}

const aiInstructions: Message = {
  role: "user",
  content,
}

export const useAi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const sendPrompt = async ({
    conversation,
    prompt,
    provider = "openai",
  }: SendPrompt): Promise<Message | null> => {
    setIsLoading(true)
    setError("")

    const messages: Message[] = [
      aiInstructions,
      ...conversation.map((c) => ({ role: c.role, content: c.content })),
      { role: "user", content: prompt },
    ]

    try {
      let content = ""

      switch (provider) {
        case "gemini":
          content = await generateGeminiContent(messages)
          break
        case "openai":
          content = await generateOpenAiContent(messages)
          break
        case "ollama":
          content = await generateOllamaContent(messages)
          break
        default:
          throw new Error("Provider not supported")
      }

      const newMessage: Message = {
        role: "assistant",
        content,
      }

      setIsLoading(false)
      return newMessage
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
