import type { Message } from "~/types"
import Icon from "./Icon"
import RenderContent from "./RenderContent"
import RenderCode from "./RenderCode"
import { useEffect, useRef } from "react"

type MessageDisplayProps = {
  conversation: Message[]
  responseType: "chat" | "music" | "visual"
}

const MessageDisplay = ({
  conversation,
  responseType,
}: MessageDisplayProps) => {
  const RenderComponent = responseType === "chat" ? RenderContent : RenderCode

  const conversationRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight
    }
  }

  const addMarginWhenHasScroll = () => {
    if (conversationRef.current) {
      const hasScroll =
        conversationRef.current.scrollHeight >
        conversationRef.current.clientHeight
      conversationRef.current.classList.toggle("has-scroll", hasScroll)
    }
  }

  useEffect(() => {
    scrollToBottom()
    addMarginWhenHasScroll()
  }, [conversation])

  return (
    <div className="conversation mt-auto" ref={conversationRef}>
      <div className="conversation-list flex flex-wrap flex-col justify-end items-end">
        <div className="prose lg:prose-xl text-white w-full">
          {conversation.map((message, index) => (
            <div className="chat-message flex gap-4 mt-4" key={index}>
              {responseType === "chat" && (
                <div
                  className={`border-primary self-start rounded-full border p-2 mt-[4px] bg-primary-bg bg-opacity-80`}
                >
                  <Icon name={message.role} size="md" />
                </div>
              )}
              <div className="response w-full">
                <RenderComponent content={message.content} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MessageDisplay
