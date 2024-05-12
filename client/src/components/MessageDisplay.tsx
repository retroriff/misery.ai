import type { Message } from '~/types';
import Icon from './Icon';
import RenderContent from './RenderContent';

type MessageDisplayProps = {
    conversation: Message[];
};

const MessageDisplay = ({ conversation }: MessageDisplayProps) => (
    <div className="prose lg:prose-xl m-auto w-full max-w-screen-lg p-4 text-white">
        {conversation.map((message, index) => (
            <div className="flex gap-4" key={index}>
                <div
                    className={`border-primary self-start rounded-full border p-2`}
                >
                    <Icon name={message.role} size="md" />
                </div>
                <div className="response w-full">
                    <RenderContent content={message.content} />
                </div>
            </div>
        ))}
    </div>
);

export default MessageDisplay;