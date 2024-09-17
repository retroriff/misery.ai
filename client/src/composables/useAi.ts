import config from "~/config"
import { useState } from "react"
import { generateGeminiContent } from "./useGemini"
import { generateOpenAiContent } from "./useOpenAi"
import { generateOllamaContent } from "./useOllama"
import generalPrompt from "~/prompt/general.md?raw"
// import prompt from "~/prompt/welcome-to-the-machine.md?raw"
import type { AIProvider, Message, StructuredResponse } from "~/types"

export const initialPrompt: Message = {
  content: config.initialAiMessage,
  role: "assistant",
}

type SendPrompt = {
  conversation: Message[]
  prompt: string
  provider?: AIProvider
}

const getPrompt = async (): Promise<Message> => {
  const { prompt } = config
  const sessionPrompt = await import(`../prompt/${prompt}.md?raw`)

  return {
    content: `${generalPrompt}\n${sessionPrompt.default}`,
    role: "user",
  }
}

export const useAi = () => {
  const { aiProvider } = config
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendPrompt = async ({
    conversation,
    prompt,
  }: SendPrompt): Promise<StructuredResponse | null> => {
    setIsLoading(true)
    setError("")

    const messages: Message[] = [
      await getPrompt(),
      ...conversation.map((c) => ({ content: c.content, role: c.role })),
      { content: prompt, role: "user" },
    ]

    try {
      let structuredResponse: StructuredResponse

      switch (aiProvider) {
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
