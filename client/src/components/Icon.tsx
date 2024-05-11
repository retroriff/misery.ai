import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as ArrowUp } from '../assets/icons/arrow-up.svg';
import { ReactComponent as Assistant } from '../assets/icons/assistant.svg';
import { ReactComponent as Stop } from '../assets/icons/stop.svg';
import { ReactComponent as User } from '../assets/icons/user.svg';

export const iconTypes = {
    arrowRight: ArrowRight,
    arrowUp: ArrowUp,
    assistant: Assistant,
    user: User,
    stop: Stop
};

interface IconProps {
    className?: string;
    name: keyof typeof iconTypes;
    size?: 'sm' | 'md';
    onClick?: () => void;
}

const IconComponent = ({ name, size = 'sm', ...props }: IconProps) => {
    const Icon = iconTypes[name];
    const iconSize = size === 'sm' ? 16 : '24';

    return (
        <Icon
            {...props}
            width={iconSize}
            height={iconSize}
            className="fill-white"
        />
    );
};

export default IconComponent;
