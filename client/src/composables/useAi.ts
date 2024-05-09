import { useState } from 'react';

interface APIResponse {
    choices: { message: { content: string } }[];
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const useAi = () => {
    const [conversation, setConversation] = useState<Message[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendPrompt = async (prompt: string): Promise<string> => {
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
                setIsLoading(false);
                return '';
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
            setIsLoading(false);
            return content; // Returning the content of the response
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
            setIsLoading(false);
            return ''; // Return empty string in case of error
        }
    };

    return { conversation, error, isLoading, sendPrompt };
};
