import type { Message } from "~/types"
import Icon from "./Icon"
import RenderContent from "./RenderContent"

type MessageDisplayProps = {
  conversation: Message[]
}

const MessageDisplay = ({ conversation }: MessageDisplayProps) => (
  <div className="prose m-auto w-full max-w-4xl text-white lg:prose-xl">
    {conversation.map((message, index) => (
      <div className="flex gap-4" key={index}>
        <div
          className={`border-primary self-start rounded-full border p-2 mt-[4px] bg-primary-bg bg-opacity-80`}
        >
          <Icon name={message.role} size="md" />
        </div>
        <div className="response w-full">
          <RenderContent content={message.content} />
        </div>
      </div>
    ))}
  </div>
)

export default MessageDisplay
