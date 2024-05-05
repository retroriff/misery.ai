import React, { useState } from 'react';
import Button from './components/Button';
import './styles.css';

interface APIResponse {
    choices: { message: { content: string } }[];
}

const App: React.FC = () => {
    const [error, setError] = useState('');
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<APIResponse | null>(null);

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

        try {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'gpt-3.5-turbo'
                })
            });

            if (!result.ok) {
                throw new Error(`Failed to fetch API: ${result.status}`);
            }

            const data: APIResponse = await result.json();
            setResponse(data);
            setError(''); // Reset error if successful
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
            setResponse(null); // Clear response if there's an error
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
                    {response && response.choices.length > 0 && (
                        <p className="text-center text-white">
                            {response.choices[0].message.content}
                        </p>
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
