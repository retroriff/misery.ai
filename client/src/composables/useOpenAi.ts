import OpenAI from "openai"
import z from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import type { Message, StructuredResponse } from "~/types"

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const aiResponse = z.object({
  musicCode: z.string().optional().describe("Only the code for playing music"),
  responseText: z.string().describe("The answer from the model without code"),
  visualCode: z
    .string()
    .optional()
    .describe("Only the code for playing visual animations"),
})

export const generateOpenAiContent = async (
  messages: Message[]
): Promise<StructuredResponse> => {
  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages,
    response_format: zodResponseFormat(aiResponse, "aiResponse"),
  })

  let structuredResponse = response.choices[0].message
    .parsed as StructuredResponse

  // Check if the model used the provided function
  if (!response.choices[0].message.parsed) {
    structuredResponse = {
      responseText: response.choices[0].message.content ?? "",
    }
  }

  return structuredResponse
}
