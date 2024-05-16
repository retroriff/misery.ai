import React, { useEffect, useRef, useState } from 'react';
import type { Message } from '~/types';
import { useOscMessages } from './composables/useOscMessages';
import { initialPrompt, shortPrompt } from './mocks/initialPrompt';
import './styles.css';

import ChatForm from './components/ChatForm';
import MessageDisplay from './components/MessageDisplay';
import WaveAnimation from './components/WaveAnimation';

interface APIResponse {
    choices: { message: { content: string } }[];
}

const App = () => {
    const [conversation, setConversation] = useState<Message[]>([shortPrompt]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const { handleContent } = useOscMessages();
    const conversationRef = useRef<HTMLDivElement>(null);
    const [hush, setHush] = useState(false);

    useEffect(() => {
        if (conversationRef.current) {
            conversationRef.current.scrollTop =
                conversationRef.current.scrollHeight;
        }
    }, [conversation]);

    const sendPrompt = async (): Promise<void> => {
        const userMessage = { role: 'user', content: prompt } as Message;
        setConversation((prevConversation) => [
            ...prevConversation,
            userMessage
        ]);
        setIsLoading(true);
        setError('');

        console.log('userMessage.content', userMessage.content);
        if (userMessage.content === 'Hush') {
            setHush(true);
        }

        const messages = [initialPrompt];

        messages.push(
            ...conversation.map((c) => ({
                role: c.role,
                content: c.content
            }))
        );

        messages.push({ role: 'user', content: prompt });

        try {
            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
            const url = process.env.REACT_APP_OPENAI_API_URL;

            if (!url || !apiKey) {
                console.error(
                    'API URL or API Key is not defined in the environment variables.'
                );
                setError('API configuration error.');
                return;
            }

            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: messages,
                    model: 'gpt-4o'
                })
            });

            if (!result.ok) {
                throw new Error(`Failed to fetch API: ${result.status}`);
            }

            const data: APIResponse = await result.json();
            const content = data.choices[0].message.content;
            const newMessage: Message = {
                role: 'assistant',
                content: content
            };

            setConversation((prevConversation) => [
                ...prevConversation,
                newMessage
            ]);
            handleContent(newMessage.content);
            setError('');
            setPrompt('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
        }
        setIsLoading(false);
    };

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
