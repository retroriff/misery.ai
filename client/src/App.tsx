import React, { useEffect, useState } from 'react';
import Button from './components/Button';
import RenderContent from './components/RenderContent';
import { useOscMessages } from './composables/useOscMessages';
import OSC from 'osc-js';
import './styles.css';
import { initialPrompt, shortPrompt } from './mocks/initialPrompt';
import Icon from './components/Icon';

const config = {
    host: 'localhost',
    port: 8080,
    secure: false
};

const osc = new OSC({
    plugin: new OSC.WebsocketClientPlugin(config)
});

interface APIResponse {
    choices: { message: { content: string } }[];
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const App = () => {
    const [conversation, setConversation] = useState<Message[]>([shortPrompt]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const { handleContent } = useOscMessages();

    useEffect(() => {
        osc.open();

        return () => {
            osc.close();
        };
    }, []);

    const sendPrompt = async (): Promise<void> => {
        setIsLoading(true);
        setError('');

        const messages = conversation.map((c) => ({
            role: c.role,
            content: c.content
        }));
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
                    model: 'gpt-4-turbo'
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
            setConversation([
                ...conversation,
                { role: 'user', content: prompt },
                newMessage
            ]);
            handleContent(content);
            setError('');
            setPrompt('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
        }
        setIsLoading(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendPrompt();
        }
    };

    return (
        <main className="transition-width h-full bg-primary-bg">
            <div className="m-auto flex h-full w-full flex-col justify-between">
                <div className="h-full flex-grow justify-center overflow-hidden">
                    <div className="scroll-container flex h-full w-screen justify-center overflow-y-scroll pl-4">
                        <div className="prose lg:prose-xl m-auto max-w-screen-lg p-4 text-white">
                            {conversation.map((message, index) => (
                                <div className="response flex gap-4">
                                    <div className="border-primary self-start rounded-full border p-2">
                                        <Icon name={message.role} size="md" />
                                    </div>
                                    <RenderContent
                                        content={message.content}
                                        key={index}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="m-auto w-full max-w-screen-lg p-4">
                    <div className="flex items-center rounded-xl border border-gray-500 p-2 text-xl">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your prompt"
                            className="flex-grow bg-transparent p-2 text-white placeholder-gray-400 outline-none"
                        />
                        <Button
                            hideText={true}
                            icon="arrowUp"
                            isLoading={isLoading}
                            onClick={sendPrompt}
                        >
                            Send
                        </Button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>
        </main>
    );
};

export default App;
