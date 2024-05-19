import React, { useRef, useEffect } from 'react';
import Button from './Button';

type ChatFormProps = {
    isLoading: boolean;
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onClick: () => void;
};

const InputArea = ({
    prompt,
    setPrompt,
    onKeyDown,
    onClick,
    isLoading
}: ChatFormProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (['ArrowDown', 'ArrowUp', 'Enter', '@'].includes(event.key)) {
            event.preventDefault();
            onKeyDown(event);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    return (
        <div className="flex items-center rounded-xl border border-gray-200 p-2 text-xl">
            <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your prompt"
                className="flex-grow bg-transparent p-2 text-white placeholder-gray-500 outline-none"
                disabled={isLoading}
            />
            <Button
                hideText={true}
                icon="arrowUp"
                onClick={onClick}
                isLoading={isLoading}
            >
                Send
            </Button>
        </div>
    );
};

export default InputArea;
