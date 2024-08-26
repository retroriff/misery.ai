import type { ColumnType, Message } from "~/types"
import Icon from "./Icon"
import RenderContent from "./RenderContent"
import RenderCode from "./RenderCode"
import { useEffect, useRef } from "react"
import CodeHeader from "./CodeHeader"

type MessageDisplayProps = {
  className?: string
  conversation: Message[]
  responseType?: ColumnType
}

const MessageDisplay = ({
  className,
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
      className={`h-full flex flex-col ${className ?? ""}
    ${responseType !== "chat" ? "relative pt-12" : ""} `}
    >
      <div className={`conversation mt-auto`} ref={conversationRef}>
        <CodeHeader
          conversation={conversation}
          conversationRef={conversationRef.current}
          responseType={responseType}
        />

        <div className="conversation-list flex flex-wrap flex-col">
          <div className="prose lg:prose-xl text-white w-full">
            {conversation.map((message, index) => (
              <div className="chat-message flex gap-4 mt-2" key={index}>
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
    </section>
  )
}

export default MessageDisplay
