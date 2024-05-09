import React, { useEffect, useState } from 'react';
import Button from './components/Button';
import RenderContent from './components/RenderContent';
import OSC from 'osc-js';
import './styles.css';

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

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const App = () => {
    const [conversation, setConversation] = useState<Message[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

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
            setError(''); // Reset error if successful

            if (content.toLowerCase().includes('play')) {
                sendOscMessage('/play');
            } else if (content.toLowerCase().includes('stop')) {
                sendOscMessage('/stop');
            }
            setPrompt('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
        }
        setIsLoading(false);
    };

    const sendOscMessage = (command: string) => {
        try {
            const message = new OSC.Message(command);
            osc.send(message);
            console.log(`OSC message sent: ${command}`);
        } catch (error) {
            console.error('Failed to send OSC message:', error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendPrompt();
        }
    };

    return (
        <main className="transition-width h-full overflow-auto bg-primary-bg">
            <div className="m-auto flex h-full w-full flex-col justify-between">
                <div className="h-full flex-grow justify-center overflow-hidden">
                    <div className="h-full overflow-auto">
                        <div className="prose lg:prose-xl m-auto flex h-full w-full max-w-screen-lg flex-col justify-center p-4 text-white">
                            {conversation.map((message, index) => (
                                <RenderContent
                                    content={message.content}
                                    key={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="m-auto w-full max-w-screen-lg p-4">
                    <div className="flex items-center rounded-xl border border-gray-700 p-2 text-xl">
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
