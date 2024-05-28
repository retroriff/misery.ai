import { useMemo, useState } from 'react';
import { Ollama } from 'ollama/dist/browser.mjs';
import OpenAI from 'openai';
import type { Message } from '~/types';
import { aIInstructions } from '../prompt/instructions';

export type AIProvider = 'openai' | 'ollama';

type SendPromt = {
    conversation: Message[];
    prompt: string;
    provider?: AIProvider;
};

export const useAi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const openai = useMemo(
        () =>
            new OpenAI({
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
                dangerouslyAllowBrowser: true
            }),
        []
    );

    const ollama = new Ollama({ host: 'http://localhost:11434' });

    const sendPrompt = async ({
        conversation,
        prompt,
        provider = 'openai'
    }: SendPromt): Promise<Message | null> => {
        setIsLoading(true);
        setError('');

        const messages: Message[] = [
            aIInstructions,
            ...conversation.map((c) => ({ role: c.role, content: c.content })),
            { role: 'user', content: prompt }
        ];

        try {
            let content = '';

            switch (provider) {
                case 'openai':
                    const dataOpenai = await openai.chat.completions.create({
                        model: 'gpt-4o',
                        messages
                    });
                    content = dataOpenai.choices[0].message.content ?? '';
                    break;
                case 'ollama':
                    const dataOllama = await ollama.chat({
                        model: 'llama3',
                        messages
                    });
                    content = dataOllama.message.content;
                    break;
                default:
                    console.log('😬 Provider not supported');
                    break;
            }

            const newMessage: Message = {
                role: 'assistant',
                content
            };

            setIsLoading(false);

            return newMessage;
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch response.');
            setIsLoading(false);

            return null;
        }
    };

    return {
        error,
        isLoading,
        sendPrompt,
        setError
    };
};
