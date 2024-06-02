import {
  GenerateContentRequest,
  GoogleGenerativeAI,
} from "@google/generative-ai"
import { Message } from "~/types"

const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export const generateGeminiContent = async (
  messages: Message[]
): Promise<string> => {
  const model = await gemini.getGenerativeModel({
    model: "gemini-1.5-flash",
  })
  const request: GenerateContentRequest = {
    contents: messages.map((message) => ({
      role: message.role.replace("assistant", "model"),
      parts: [{ text: message.content }],
    })),
  }
  const result = await model.generateContent(request)
  const response = await result.response
  return response.text()
}
