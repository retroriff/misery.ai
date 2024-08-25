import { useState, useEffect } from "react"
import Icon from "./Icon"
import { Message } from "~/types"

interface BadgeProps {
  show: boolean
  conversation: Message[]
  handleMusicCode: (content: string) => void
}

const ReevaluateBadge = ({
  show,
  conversation,
  handleMusicCode,
}: BadgeProps) => {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const reevaluateCode = conversation[conversation.length - 1]?.content

      if (reevaluateCode) {
        console.log("🔄 Reevaluate", reevaluateCode)
        handleMusicCode(reevaluateCode)
      }

      // Hide the badge after a short delay
      setTimeout(() => {
        setIsVisible(false)
      }, 500)
    }
  }, [show, conversation, handleMusicCode])

  const handleAnimationEnd = () => {
    if (!isVisible) {
      setIsVisible(false)
    }
  }

  return (
    <div
      className="absolute left-4 top-4 flex items-center gap-1 rounded bg-pink-800 px-2 py-1 text-white"
      onAnimationEnd={handleAnimationEnd}
      style={{
        transition: "opacity 0.5s ease",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Icon name="recycle" />
      <span>Reevaluate</span>
    </div>
  )
}

export default ReevaluateBadge
