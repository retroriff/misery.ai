import React, { useEffect, useState } from 'react';
import Button from './components/Button';
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
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        osc.open();

        return () => {
            osc.close();
        };
    }, []);

    const sendPrompt = async (): Promise<void> => {
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        const url = process.env.REACT_APP_OPENAI_API_URL;

        if (!url || !apiKey) {
            console.error(
                'API URL or API Key is not defined in the environment variables.'
            );
            setError('API configuration error.');
            return;
        }

        const messages = conversation.map((c) => ({
            role: c.role,
            content: c.content
        }));
        messages.push({ role: 'user', content: prompt });

        try {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: messages,
                    model: 'gpt-3.5-turbo'
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
            setResponse(content);
            setError(''); // Reset error if successful

            if (content.toLowerCase().includes('play')) {
                sendOscMessage('/play'); // Assuming 440 is a frequency
            } else if (content.toLowerCase().includes('stop')) {
                sendOscMessage('/stop'); // Assuming /stop is a valid command and 0 is a placeholder value
            }
            setPrompt('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
            setResponse(null); // Clear response if there's an error
        }
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
        <main className="h-screen bg-primary-bg">
            <div className="justify-betwee m-auto flex h-full w-full max-w-screen-lg flex-col">
                <div className="flex flex-grow items-center justify-center p-4">
                    {response && (
                        <p className="text-center text-white">{response}</p>
                    )}
                </div>
                <div className="m-auto w-full p-4">
                    <div className="flex items-center rounded-xl border border-gray-700 p-2">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your prompt"
                            className="flex-grow bg-transparent p-2 text-white placeholder-gray-400 outline-none"
                        />
                        <Button
                            icon="arrowRight"
                            onClick={sendPrompt}
                            hideText={true}
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
