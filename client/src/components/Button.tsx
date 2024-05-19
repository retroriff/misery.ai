import React from 'react';
import Icon from './Icon';
import { iconTypes } from './Icon';

interface ButtonProps {
    children: React.ReactNode;
    hideText: boolean;
    icon?: keyof typeof iconTypes;
    isLoading: boolean;
    onClick: () => void;
}

const Button = ({
    children,
    hideText,
    icon,
    isLoading,
    onClick
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center gap-2 rounded-lg bg-pink-600 fill-white p-4 font-bold text-white hover:bg-pink-800"
        >
            {icon && <Icon name={isLoading ? 'stop' : icon} />}
            {!hideText && children}
        </button>
    );
};

export default Button;
