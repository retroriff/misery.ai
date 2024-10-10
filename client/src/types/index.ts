export enum AIProvider {
  GEMINI = "gemini",
  OLLAMA = "ollama",
  OPENAI = "openai",
}

export type ColumnType = "chat" | "music" | "visuals"

export enum ControlKeys {
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
  At = "@",
  Enter = "Enter",
}

export type Message = {
  content: string
  role: "assistant" | "system" | "user"
  structuredResponse?: StructuredResponse
}

export enum Output {
  MIDI = "midi",
  OSC = "osc",
}

export type StructuredResponse = {
  musicCode?: string
  responseText: string
  visualCode?: string
}
