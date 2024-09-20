import config from "~/config"
import ChatImageAvatar from "./ChatImageAvatar"
import Icon from "./Icon"

interface IconProps {
  role: "assistant" | "user"
}

const ChatAvatar = ({ role }: IconProps) => {
  const { enableImages } = config.chat
  const Avatar = enableImages ? ChatImageAvatar : Icon

  return (
    <div
      className={`flex justify-center items-center min-w-[44px] min-h-[44px] border-primary self-start bg-primary-bg bg-opacity-80 ${!enableImages ? "rounded-full border p-2 mt-1" : ""}`}
    >
      <Avatar name={role} {...(!enableImages && { size: "md" })} />
    </div>
  )
}

export default ChatAvatar
