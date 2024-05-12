import { useWaveAnimation } from '../composables/useWaveAnimation';

type WaveAnimationProps = {
    isLoading: boolean;
};

const WaveAnimation = ({ isLoading }: WaveAnimationProps) => {
    const scale = isLoading ? 5 : 20;
    const waveAnimationRef = useWaveAnimation(100, scale, true);

    return (
        <div id="wave-animation">
            <canvas ref={waveAnimationRef} />
        </div>
    );
};

export default WaveAnimation;
