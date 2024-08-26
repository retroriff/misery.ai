import type { ColumnType, Message } from "~/types"
import Icon from "./Icon"
import RenderContent from "./RenderContent"
import RenderCode from "./RenderCode"
import { useEffect, useRef, useState } from "react"

type MessageDisplayProps = {
  conversation: Message[]
  responseType: ColumnType
}

const MessageDisplay = ({
  conversation,
  responseType,
}: MessageDisplayProps) => {
  const conversationRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLHeadingElement | null>(null)
  const [isFixed, setIsFixed] = useState(false)
  const RenderComponent = responseType === "Chat" ? RenderContent : RenderCode

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

  // Sticky header when scrolls to top
  useEffect(() => {
    const headerElement = headerRef.current

    if (headerElement) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.boundingClientRect.top <= 20) {
            setIsFixed(true)
          } else {
            setIsFixed(false)
          }
        },
        { threshold: 0, rootMargin: "0px 0px 0px 0px" }
      )

      observer.observe(headerElement)

      return () => {
        observer.unobserve(headerElement)
      }
    }
  }, [conversation])

  return (
    <section className="conversation mt-auto" ref={conversationRef}>
      {responseType !== "Chat" && conversation.length > 0 && (
        <h2
          className={`text-xl bg-primary-bg text-white px-4 py-2 rounded-t-lg bg-opacity-70 w-full
        ${isFixed ? "absolute -top-0 z-10" : ""}`}
          ref={headerRef}
        >
          {responseType}
        </h2>
      )}
      <div className="conversation-list flex flex-wrap flex-col">
        <div className="prose lg:prose-xl text-white w-full">
          {conversation.map((message, index) => (
            <div className="chat-message flex gap-4 mt-2" key={index}>
              {responseType === "Chat" && (
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
    </section>
  )
}

export default MessageDisplay
