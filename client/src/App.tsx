import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { ControlKeys, type Message } from "~/types"
import { useOscMessages } from "./composables/useOscMessages"
import { AIProvider, useAi } from "~/composables/useAi"

import ChatForm from "./components/ChatForm"
import Hydra from "./components/HydraAnimation"
import MessageDisplay from "./components/MessageDisplay"
import ReevaluateBadge from "./components/ReevaluateBadge"

const initialPrompt: Message = {
  content: "Hello, mere mortal. How can I help you?",
  role: "assistant",
}

const provider: AIProvider = "gemini"

const App = () => {
  const [conversation, setConversation] = useState<Message[]>([initialPrompt])
  const conversationRef = useRef<HTMLDivElement>(null)
  const { handleContent } = useOscMessages()
  const [hush, setHush] = useState(false)
  const [messageIndex, setMessageIndex] = useState(-1)
  const [prompt, setPrompt] = useState("")
  const [showReevaluateBadge, setShowReevaluateBadge] = useState(false)

  const { sendPrompt, isLoading, error, setError } = useAi()

  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const handleSendPrompt = async (): Promise<void> => {
    const userMessage = { role: "user", content: prompt } as Message

    setConversation((prevConversation) => [...prevConversation, userMessage])

    if (userMessage.content === "Hush") {
      setHush(true)
    }

    const newResponse = await sendPrompt({
      conversation,
      prompt,
      provider,
    })

    if (newResponse) {
      const { musicCode, responseText } = newResponse

      setConversation((prev) => [
        ...prev,
        { content: responseText, role: "assistant" },
      ])

      if (musicCode) {
        handleContent(musicCode)
      }

      setError("")
      setPrompt("")
    } else {
      setError("Failed to fetch response.")
    }

    setMessageIndex(-1)
  }

  const reevaluateCode = () => {
    const reevaluateCode = conversation[conversation.length - 1].content
    console.log("🔄 Reevaluate", reevaluateCode)
    handleContent(reevaluateCode)

    setShowReevaluateBadge(true)
    setTimeout(() => {
      setShowReevaluateBadge(false)
    }, 500)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === ControlKeys.Enter && prompt.trim()) {
      handleSendPrompt()
      return
    }

    if (event.key === ControlKeys.At) {
      reevaluateCode()
    }

    if (
      ![ControlKeys.ArrowDown, ControlKeys.ArrowUp].includes(
        event.key as ControlKeys
      )
    ) {
      return
    }

    const userMessages = conversation
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content)

    let newIndex = messageIndex

    if (event.key === ControlKeys.ArrowUp) {
      newIndex = newIndex <= 0 ? userMessages.length - 1 : newIndex - 1
    }

    if (event.key === ControlKeys.ArrowDown) {
      newIndex = newIndex >= userMessages.length - 1 ? -1 : newIndex + 1
    }

    setMessageIndex(newIndex)
    setPrompt(newIndex === -1 ? "" : userMessages[newIndex])
  }

  const handleClick = () => {
    if (prompt.trim()) {
      handleSendPrompt()
    }
  }

  const shouldAnimate = conversation.length > 1 && !hush

  return (
    <main className="transition-width h-full">
      <div className="m-auto flex h-full w-full flex-col justify-between">
        <div className="h-full flex flex-col">
          <div className="h-full flex-grow justify-center overflow-hidden">
            <div
              ref={conversationRef}
              className="conversation flex h-full justify-center overflow-y-scroll px-4"
            >
              <MessageDisplay conversation={conversation} />
            </div>
          </div>
          <div className="m-auto w-full p-4">
            <div className="m-auto max-w-4xl">
              <ChatForm
                isLoading={isLoading}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                prompt={prompt}
                setPrompt={setPrompt}
              />
              {error && <p className="text-red-500">{error}</p>}
              <ReevaluateBadge show={showReevaluateBadge} />
            </div>
          </div>
        </div>
      </div>
      <Hydra shouldAnimate={shouldAnimate} />
    </main>
  )
}

export default App
