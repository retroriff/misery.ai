import OpenAI from "openai"
import z from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import type { Message } from "~/types"

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const AiResponse = z.object({
  code: z.object({
    content: z.string().describe("The code for playing music or visuals"),
    type: z.enum(["music", "visual"]),
  }),
  response: z.string().describe("The response text from the assistant"),
})

export const generateOpenAiContent = async (
  messages: Message[]
): Promise<string> => {
  const dataOpenai = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages,
    response_format: zodResponseFormat(AiResponse, "aiResponse"),
  })
  return dataOpenai.choices[0].message.content ?? ""
}
