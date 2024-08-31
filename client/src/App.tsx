import { KeyboardEvent, useState } from "react"
import { ControlKeys, type Message } from "~/types"
import { initialPrompt, useAi } from "~/composables/useAi"
import { defaultHydraCode } from "./composables/useHydra"
import { useMusicCode } from "./composables/useMusicCode"

import ChatForm from "./components/ChatForm"
import Animation from "./components/Animation"
import MessageDisplay from "./components/MessageDisplay"
import ReevaluateBadge from "./components/ReevaluateBadge"

const App = () => {
  const [conversation, setConversation] = useState<Message[]>([initialPrompt])
  const [musicConversation, setMusicConversation] = useState<Message[]>([])
  const [visualConversation, setVisualConversation] = useState<Message[]>([
    defaultHydraCode,
  ])
  const handleMusicCode = useMusicCode()
  const [messageIndex, setMessageIndex] = useState(-1)
  const [prompt, setPrompt] = useState("")
  const [showReevaluateBadge, setShowReevaluateBadge] = useState(false)
  const { sendPrompt, isLoading, error, setError } = useAi()

  const handleSendPrompt = async (): Promise<void> => {
    const userMessage = { role: "user", content: prompt } as Message

    setConversation((prevConversation) => [...prevConversation, userMessage])

    const newResponse = await sendPrompt({
      conversation,
      prompt,
    })

    if (newResponse) {
      const { musicCode, responseText, visualCode } = newResponse

      if (responseText) {
        setConversation((prev) => [
          ...prev,
          { content: responseText, role: "assistant" },
        ])
      }

      if (musicCode) {
        setMusicConversation((prev) => [
          ...prev,
          { content: musicCode, role: "assistant" },
        ])
        handleMusicCode(musicCode)
      }

      if (visualCode) {
        setVisualConversation((prev) => [
          ...prev,
          { content: visualCode, role: "assistant" },
        ])
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

  return (
    <main className="grid-container md:h-full p-4 gap-8 max-w-screen-2xl">
      <MessageDisplay conversation={conversation} responseType="chat" />

      <div id="form">
        <ChatForm
          isLoading={isLoading}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          prompt={prompt}
          setPrompt={setPrompt}
        />
        {error && <p className="text-red-500">{error}</p>}
        <ReevaluateBadge
          handleMusicCode={handleMusicCode}
          hideReevaluateBadge={() => setShowReevaluateBadge(false)}
          musicConversation={musicConversation}
          showBadge={showReevaluateBadge}
        />
      </div>

      <MessageDisplay
        conversation={visualConversation}
        responseType="visuals"
      />

      <MessageDisplay conversation={musicConversation} responseType="music" />

      <Animation
        code={visualConversation[visualConversation.length - 1].content}
      />
    </main>
  )
}

export default App
function useMusic(): { handleMusicCode: any } {
  throw new Error("Function not implemented.")
}
