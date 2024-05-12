import { useCallback, useState } from 'react';

interface Message {
    content: string;
    role: 'user' | 'assistant';
}

export const useMessageHistory = (initialMessages: Message[] = []) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [index, setIndex] = useState<number>(-1);

    const addMessage = useCallback((message: Message) => {
        setMessages((prev) => [message, ...prev]);
        setIndex(-1);
    }, []);

    const getMessageForIndex = useCallback(
        (direction: 'up' | 'down'): string => {
            let newIndex = direction === 'up' ? index + 1 : index - 1;
            newIndex = Math.max(Math.min(newIndex, messages.length - 1), -1);
            setIndex(newIndex);
            return newIndex >= 0 ? messages[newIndex].content : '';
        },
        [index, messages]
    );

    return { addMessage, getMessageForIndex };
};
