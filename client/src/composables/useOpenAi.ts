import OpenAI from "openai"
import { Message } from "~/types"

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export const generateOpenAiContent = async (
  messages: Message[]
): Promise<string> => {
  const dataOpenai = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  })
  return dataOpenai.choices[0].message.content ?? ""
}
