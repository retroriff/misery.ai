import { AIProvider, Output } from "./types"

const config = {
  aiProvider: AIProvider.OPENAI,
  initialAiMessage: "Welcome, my son.",
  musicOutput: Output.OSC,
  prompt: "welcome-to-the-machine",
}

export default config
