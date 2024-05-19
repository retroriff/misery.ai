// src/api/useAi.ts
import { useState } from 'react';
import { initialPrompt, shortPrompt } from '../mocks/initialPrompt';
import type { Message } from '~/types';

interface APIResponse {
    choices: { message: { content: string } }[];
}

export const useAi = () => {
    const [conversation, setConversation] = useState<Message[]>([shortPrompt]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

    const fetchResponse = async (messages: Message[]): Promise<string> => {
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        const url = process.env.REACT_APP_OPENAI_API_URL;

        if (!url || !apiKey) {
            console.error(
                'API URL or API Key is not defined in the environment variables.'
            );
            setError('API configuration error.');
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
                model: 'gpt-4o'
            })
        });

        if (!result.ok) {
            throw new Error(`Failed to fetch API: ${result.status}`);
        }

        const data: APIResponse = await result.json();
        return data.choices[0].message.content;
    };

    const sendPrompt = async (): Promise<void> => {
        const userMessage: Message = { role: 'user', content: prompt };
        setConversation((prevConversation) => [
            ...prevConversation,
            userMessage
        ]);
        setIsLoading(true);
        setError('');

        const messages: Message[] = [
            initialPrompt,
            ...conversation.map((c) => ({ role: c.role, content: c.content })),
            { role: 'user', content: prompt }
        ];

        try {
            const content = await fetchResponse(messages);
            const newMessage: Message = { role: 'assistant', content };

            setConversation((prevConversation) => [
                ...prevConversation,
                newMessage
            ]);
            setError('');
            setPrompt('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
        }
        setIsLoading(false);
    };

    return {
        conversation,
        error,
        isLoading,
        prompt,
        setPrompt,
        sendPrompt
    };
};
