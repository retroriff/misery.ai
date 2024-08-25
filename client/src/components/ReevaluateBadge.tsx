import { useEffect } from "react"
import Icon from "./Icon"
import { Message } from "~/types"

interface BadgeProps {
  handleMusicCode: (content: string) => void
  hideReevaluateBadge: () => void
  musicConversation: Message[]
  showBadge: boolean
}

const ReevaluateBadge = ({
  musicConversation,
  handleMusicCode,
  hideReevaluateBadge,
  showBadge,
}: BadgeProps) => {
  useEffect(() => {
    if (showBadge) {
      const reevaluateCode =
        musicConversation[musicConversation.length - 1]?.content

      if (reevaluateCode) {
        console.log("🔄 Reevaluate", reevaluateCode)
        handleMusicCode(reevaluateCode)
      }

      // Hide the badge after a short delay
      setTimeout(() => {
        hideReevaluateBadge()
      }, 500)
    }
  }, [showBadge, musicConversation, handleMusicCode, hideReevaluateBadge])

  return (
    <div
      className="absolute left-4 top-4 flex items-center gap-1 rounded bg-pink-800 px-2 py-1 text-white"
      style={{
        transition: "opacity 0.5s ease",
        opacity: showBadge ? 1 : 0,
      }}
    >
      <Icon name="recycle" />
      <span>Reevaluate</span>
    </div>
  )
}

export default ReevaluateBadge
