import { useState, useEffect } from 'react';
import Icon from './Icon';

interface BadgeProps {
    show: boolean;
}

const ReevaluateBadge = ({ show }: BadgeProps) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    const handleAnimationEnd = () => {
        if (!show) {
            setIsVisible(false);
        }
    };

    return (
        <div
            className="absolute left-4 top-4 flex items-center gap-1 rounded bg-pink-800 px-2 py-1 text-white"
            onAnimationEnd={handleAnimationEnd}
            style={{
                transition: 'opacity 0.5s ease',
                opacity: isVisible ? 1 : 0
            }}
        >
            <Icon name="recycle" />
            <span>Reevaluate</span>
        </div>
    );
};

export default ReevaluateBadge;
