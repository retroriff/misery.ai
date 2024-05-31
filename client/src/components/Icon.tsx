/// <reference types="vite-plugin-svgr/client" />

import ArrowRight from "../assets/icons/arrow-right.svg?react"
import ArrowUp from "../assets/icons/arrow-up.svg?react"
import Assistant from "../assets/icons/assistant.svg?react"
import Recycle from "../assets/icons/recycle.svg?react"
import Stop from "../assets/icons/stop.svg?react"
import User from "../assets/icons/user.svg?react"

export const iconTypes = {
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  assistant: Assistant,
  recycle: Recycle,
  stop: Stop,
  user: User,
}

interface IconProps {
  className?: string
  name: keyof typeof iconTypes
  size?: "sm" | "md"
  onClick?: () => void
}

const IconComponent = ({ name, size = "sm", ...props }: IconProps) => {
  const Icon = iconTypes[name]
  const iconSize = size === "sm" ? 16 : "24"

  return (
    <Icon
      {...props}
      width={iconSize}
      height={iconSize}
      className="fill-white"
    />
  )
}

export default IconComponent
