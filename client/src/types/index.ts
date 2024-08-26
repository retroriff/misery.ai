export enum ControlKeys {
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
  At = "@",
  Enter = "Enter",
}

export type Message = {
  content: string
  role: "user" | "assistant"
  structuredResponse?: StructuredResponse
}

export type StructuredResponse = {
  musicCode?: string
  responseText: string
  visualCode?: string
}

export type ColumnType = "Chat" | "Music" | "Visuals"
