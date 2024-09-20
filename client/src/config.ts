import { AIProvider, Output } from "./types"

const config = {
  aiProvider: AIProvider.OPENAI,
  chat: {
    enableImages: true,
  },
  enableVisuals: false,
  initialAiMessage: "Welcome, my son.",
  musicOutput: Output.OSC,
  prompt: "welcome-to-the-machine",
}

export default config
