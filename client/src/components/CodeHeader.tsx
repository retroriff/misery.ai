import { useEffect, useRef, useState } from "react"
import { ColumnType, Message } from "~/types"

type CodeHeaderProps = {
  conversationRef?: HTMLDivElement | null
  conversation: Message[]
  responseType?: ColumnType
}

const CodeHeader = ({
  conversation,
  conversationRef,
  responseType,
}: CodeHeaderProps) => {
  const headerRef = useRef<HTMLHeadingElement | null>(null)
  const [isFixed, setIsFixed] = useState(false)

  // Handle has-scroll class
  useEffect(() => {
    if (conversationRef) {
      const hasScroll =
        conversationRef.scrollHeight > conversationRef.clientHeight
      conversationRef.classList.toggle("has-scroll", hasScroll)
    }
  }, [conversation, conversationRef])

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

  const headingText =
    responseType === "chat" ? "What did you dream?" : "Pipeline"

  return (
    conversation.length > 0 && (
      <h2
        className={`heading bg-white text-xl px-4 py-2 rounded-t-lg  w-full font-bold capitalize
          ${responseType === "chat" && !isFixed ? "xl:opacity-0" : ""}
          ${isFixed ? "lg:absolute lg:-top-0 lg:z-10" : ""}`}
        ref={headerRef}
      >
        {headingText}
      </h2>
    )
  )
}

export default CodeHeader
