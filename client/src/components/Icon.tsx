import React from 'react';

import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';

export const iconTypes = {
    arrowRight: ArrowRight
};

interface IconProps {
    name: keyof typeof iconTypes;
    className?: string;
    onClick?: () => void;
}

const IconComponent: React.FC<IconProps> = ({ name, ...props }) => {
    const Icon = iconTypes[name];
    return <Icon {...props} />;
};

export default IconComponent;
