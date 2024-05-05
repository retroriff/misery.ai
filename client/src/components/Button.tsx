import React from 'react';
import Icon from './Icon'; // Import the Icon component
import { iconTypes } from './Icon';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    icon?: keyof typeof iconTypes;
    hideText?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    icon,
    hideText
}) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center gap-2 rounded-lg bg-pink-600 fill-white p-4 font-bold text-white hover:bg-pink-800"
        >
            {icon && <Icon name={icon} />}
            {!hideText && children}
        </button>
    );
};

export default Button;
