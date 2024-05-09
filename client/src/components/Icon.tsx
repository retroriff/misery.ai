import React from 'react';

import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as ArrowUp } from '../assets/icons/arrow-up.svg';
import { ReactComponent as Stop } from '../assets/icons/stop.svg';

export const iconTypes = {
    arrowRight: ArrowRight,
    arrowUp: ArrowUp,
    stop: Stop
};

interface IconProps {
    name: keyof typeof iconTypes;
    className?: string;
    onClick?: () => void;
}

const IconComponent = ({ name, ...props }: IconProps) => {
    const Icon = iconTypes[name];
    return <Icon {...props} />;
};

export default IconComponent;
