import { KeyboardEvent, useState } from "react"
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

const provider: AIProvider = "openai"

const App = () => {
  const [conversation, setConversation] = useState<Message[]>([initialPrompt])
  const [musicConversation, setMusicConversation] = useState<Message[]>([])
  const { handleMusicContent } = useOscMessages()
  const [hush, setHush] = useState(false)
  const [messageIndex, setMessageIndex] = useState(-1)
  const [prompt, setPrompt] = useState("")
  const [showReevaluateBadge, setShowReevaluateBadge] = useState(false)
  const { sendPrompt, isLoading, error, setError } = useAi()

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
        setMusicConversation((prev) => [
          ...prev,
          { content: musicCode, role: "assistant" },
        ])
        handleMusicContent(musicCode)
      }

      setError("")
      setPrompt("")
    } else {
      setError("Failed to fetch response.")
    }

    setMessageIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === ControlKeys.Enter && prompt.trim()) {
      handleSendPrompt()
      return
    }

    if (event.key === ControlKeys.At) {
      setShowReevaluateBadge(true)
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
    <main className="flex h-full w-full justify-between p-8 gap-8">
      <div className="flex-1 h-full flex flex-col">
        <div className="h-full flex-grow justify-center overflow-hidden">
          <div className="conversation flex h-full justify-center overflow-y-auto">
            <MessageDisplay conversation={conversation} responseType="chat" />
          </div>
        </div>
        <div className="m-auto w-full pt-4">
          <div className="m-auto max-w-4xl">
            <ChatForm
              isLoading={isLoading}
              onKeyDown={handleKeyDown}
              onClick={handleClick}
              prompt={prompt}
              setPrompt={setPrompt}
            />
            {error && <p className="text-red-500">{error}</p>}
            <ReevaluateBadge
              conversation={conversation}
              handleMusicContent={handleMusicContent}
              show={showReevaluateBadge}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col text-red-500">
        <div className="mt-auto">
          <MessageDisplay
            conversation={musicConversation}
            responseType="music"
          />
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col text-red-500">
        <div className="mt-auto"></div>
      </div>
      <Hydra shouldAnimate={shouldAnimate} />
    </main>
  )
}

export default App
