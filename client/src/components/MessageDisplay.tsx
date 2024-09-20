import { useEffect, useRef } from "react"
import ChatAvatar from "./ChatAvatar"
import CodeHeader from "./CodeHeader"
import RenderCode from "./RenderCode"
import RenderContent from "./RenderContent"
import type { ColumnType, Message } from "~/types"

type MessageDisplayProps = {
  conversation: Message[]
  responseType?: ColumnType
}

const MessageDisplay = ({
  conversation,
  responseType,
}: MessageDisplayProps) => {
  const conversationRef = useRef<HTMLDivElement>(null)
  const RenderComponent = responseType === "chat" ? RenderContent : RenderCode

  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  return (
    <section
      id={responseType}
      className={`h-full flex flex-col overflow-y-auto lg:relative lg:pt-14`}
    >
      <div className={`scrollable mt-auto`} ref={conversationRef}>
        <CodeHeader
          conversation={conversation}
          conversationRef={conversationRef.current}
          responseType={responseType}
        />

        <div className="conversation-list flex flex-wrap flex-col mt-4">
          <div className="prose lg:prose-xl text-white w-full">
            {conversation.map((message, index) => (
              <div className="chat-message flex gap-4 mt-2" key={index}>
                {responseType === "chat" && <ChatAvatar role={message.role} />}
                <div className="response w-full">
                  <RenderComponent content={message.content} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MessageDisplay
