import {
  GenerateContentRequest,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
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
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  }

  console.log(
    "🚀 ~ file: useGemini.ts ~ line 64 ~ generateGeminiContent ~ request",
    request
  )

  const result = await model.generateContent(request)
  const response = await result.response
  return response.text()
}
