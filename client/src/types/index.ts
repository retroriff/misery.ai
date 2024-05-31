export enum ControlKeys {
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
  At = "@",
  Enter = "Enter",
}

export type Message = {
  role: "user" | "assistant"
  content: string
}
