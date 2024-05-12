import { useWaveAnimation } from '../composables/useWaveAnimation';

type WaveAnimationProps = {
    isLoading: boolean;
};

const WaveAnimation = ({ isLoading }: WaveAnimationProps) => {
    const waveAnimationRef = useWaveAnimation(100, 5, isLoading);

    return (
        <div id="wave-animation">
            <canvas ref={waveAnimationRef}></canvas>
        </div>
    );
};

export default WaveAnimation;
