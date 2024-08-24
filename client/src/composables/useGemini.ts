import {
  FunctionCallingMode,
  GenerateContentRequest,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SchemaType,
  Tool,
} from "@google/generative-ai"
import { Message, StructuredResponse } from "~/types"

const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

/*
TODO: Ollama "Tool" type doesn't allow child objects like:
code: {
  music: string
  visual: string
}
*/
export const codeGeneratorFunction = {
  name: "code_generator",
  description:
    "Returns code for playing music or visuals based on the user request and following the provided instructions",
  parameters: {
    properties: {
      musicCode: {
        description: "Only the code for playing music",
        type: SchemaType.STRING,
      },
      responseText: {
        description: "The answer from the model",
        type: SchemaType.STRING,
      },
      visualCode: {
        description: "Only the code for playing visuals",
        type: SchemaType.STRING,
      },
    },
    required: ["responseText"],
    type: SchemaType.OBJECT,
  },
}

const functionDeclarations = [codeGeneratorFunction]
const tools: Tool[] = [{ functionDeclarations }]

const safetySettings = [
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
]

export const generateGeminiContent = async (
  messages: Message[]
): Promise<StructuredResponse> => {
  const model = await gemini.getGenerativeModel({
    // Forced function calling only supported by gemini-1.5-pro-001
    // https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling
    model: "gemini-1.5-pro-latest",
    safetySettings,
    toolConfig: {
      functionCallingConfig: {
        mode: FunctionCallingMode.ANY,
        allowedFunctionNames: functionDeclarations.map((f) => f.name),
      },
    },
    tools,
  })

  const request: GenerateContentRequest = {
    contents: messages.map((message) => ({
      role: message.role.replace("assistant", "model"),
      parts: [{ text: message.content }],
    })),
  }

  const result = await model.generateContent(request)
  const response = await result.response
  const functionCallResponse = response.functionCalls() ?? []
  let structuredResponse = functionCallResponse[0].args as StructuredResponse

  // Check if the model used the provided function
  if (functionCallResponse.length === 0) {
    structuredResponse = { responseText: response.text() }
  }

  return structuredResponse
}
