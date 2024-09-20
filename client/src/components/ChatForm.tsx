import React, { KeyboardEvent, useRef, useEffect } from "react"
import Button from "./Button"
import { ControlKeys } from "~/types"
import config from "~/config"

type ChatFormProps = {
  isLoading: boolean
  prompt: string
  setPrompt: React.Dispatch<React.SetStateAction<string>>
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onClick: () => void
}

const InputArea = ({
  prompt,
  setPrompt,
  onKeyDown,
  onClick,
  isLoading,
}: ChatFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isControlKey = (key: string): key is ControlKeys => {
    return Object.values(ControlKeys).includes(key as ControlKeys)
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isControlKey(event.key)) {
      if (event.key === ControlKeys.Enter && !event.shiftKey) {
        event.preventDefault()
        onKeyDown(event)
      } else if (
        (event.key === ControlKeys.ArrowUp ||
          event.key === ControlKeys.ArrowDown) &&
        event.metaKey
      ) {
        event.preventDefault()
        onKeyDown(event)
      } else if (event.key === ControlKeys.At) {
        event.preventDefault()
        onKeyDown(event)
      }
    }
  }

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.style.height = "44px"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 500)}px`
    }
  }, [isLoading, prompt])

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus()
    }
  }, [isLoading])

  return (
    <div
      className={`flex items-center gap-4 p-2 text-xl ${config.enableVisuals ? "bg-primary-bg bg-opacity-80" : "rounded-xl border border-gray-200"}`}
    >
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Enter your prompt"
        className="flex-grow bg-transparent p-2 text-white placeholder-gray-500 outline-none resize-none max-h-48 overflow-auto"
        disabled={isLoading}
      />
      <Button
        hideText={true}
        icon="arrowUp"
        onClick={onClick}
        isLoading={isLoading}
        className="self-end"
      >
        Send
      </Button>
    </div>
  )
}

export default InputArea
