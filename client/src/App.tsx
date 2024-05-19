// import { playSineWave } from './composables/useWebAudioApi';

// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useAi } from './composables/useAi';
import { useOscMessages } from './composables/useOscMessages';
import './styles.css';

import ChatForm from './components/ChatForm';
import MessageDisplay from './components/MessageDisplay';
import WaveAnimation from './components/WaveAnimation';

const App: React.FC = () => {
    const { conversation, error, isLoading, prompt, setPrompt, sendPrompt } =
        useAi();
    const { handleContent } = useOscMessages();
    const conversationRef = useRef<HTMLDivElement>(null);
    const [hush, setHush] = useState(false);

    useEffect(() => {
        if (conversationRef.current) {
            conversationRef.current.scrollTop =
                conversationRef.current.scrollHeight;
        }
    }, [conversation]);

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            handleContent(lastMessage.content);
        }
    }, [conversation, handleContent]);

    useEffect(() => {
        const lastUserMessage = conversation
            .slice()
            .reverse()
            .find((msg) => msg.role === 'user');
        if (lastUserMessage?.content === 'Hush') {
            setHush(true);
        } else {
            setHush(false);
        }
    }, [conversation]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && prompt.trim()) {
            sendPrompt();
            return;
        }

        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return;
        }

        event.preventDefault();

        const userMessages = conversation
            .filter((msg) => msg.role === 'user')
            .map((msg) => msg.content);
        const currentIndex = userMessages.lastIndexOf(prompt);

        if (event.key === 'ArrowUp') {
            const newIndex = currentIndex - 1;
            if (newIndex >= 0) {
                setPrompt(userMessages[newIndex]);
                return;
            }

            setPrompt(userMessages[userMessages.length - 1]);
            return;
        }

        if (event.key === 'ArrowDown') {
            const newIndex = currentIndex + 1;
            if (newIndex < userMessages.length) {
                setPrompt(userMessages[newIndex]);
                return;
            }

            setPrompt('');
        }
    };

    const handleClick = () => {
        if (prompt.trim()) {
            sendPrompt();
        }
    };

    const shouldAnimate = conversation.length > 1 && !hush;

    return (
        <main className="transition-width h-full bg-primary-bg">
            <div className="m-auto flex h-full w-full flex-col justify-between">
                <div className="h-full flex-grow justify-center overflow-hidden">
                    <div
                        ref={conversationRef}
                        className="conversation flex h-full w-screen justify-center overflow-y-scroll pl-4"
                    >
                        <MessageDisplay conversation={conversation} />
                    </div>
                </div>
                <div className="m-auto w-full p-4">
                    <WaveAnimation
                        isLoading={isLoading}
                        shouldAnimate={shouldAnimate}
                    />
                    <div className="m-auto max-w-screen-lg">
                        <ChatForm
                            isLoading={isLoading}
                            onKeyDown={handleKeyDown}
                            onClick={handleClick}
                            prompt={prompt}
                            setPrompt={setPrompt}
                        />
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default App;
