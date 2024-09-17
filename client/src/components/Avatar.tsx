import assistantIcon from "~/assets/icons/triangle.png"
import userIcon from "~/assets/icons/human.png"

const icons: Record<string, string> = {
  assistant: assistantIcon,
  user: userIcon,
}

interface IconProps {
  name: "assistant" | "user"
}

const Avatar = ({ name }: IconProps) => {
  // Use the name to retrieve the correct image from the map
  const src = icons[name]

  return (
    <img
      alt={name}
      className="!m-0 min-w-[44px] min-h-[44px]"
      src={src}
      width="44"
      height="44"
    />
  )
}

export default Avatar
