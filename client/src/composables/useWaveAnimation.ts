import { useRef, useEffect } from 'react';

export const useWaveAnimation = (
    height: number,
    scale: number,
    shouldAnimate: boolean,
    speed: number // New parameter to control the speed of the animation
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Early exit if canvas is null

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Early exit if canvas context couldn't be obtained

        const parent = canvas.parentElement;
        if (!parent) {
            console.error('Canvas parent element is null');
            return; // Early exit if there's no parent element
        }

        canvas.width = parent.offsetWidth;
        canvas.height = height;

        let amplitudes = new Array(Math.ceil(canvas.width / scale)).fill(0);
        let frequencies = new Array(amplitudes.length).fill(0);
        let phase = 0;

        function initWave() {
            if (shouldAnimate) {
                amplitudes = amplitudes.map(() => Math.random() * 20 + 5);
                frequencies = frequencies.map(
                    () => Math.random() * 0.05 + 0.01
                );
            } else {
                amplitudes.fill(0); // Ensure flat line
                frequencies.fill(0); // Irrelevant when not animating
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            for (let x = 0; x < amplitudes.length; x++) {
                let realX = x * scale;
                let y =
                    canvas.height / 2 +
                    (shouldAnimate
                        ? Math.sin(realX * frequencies[x] + phase) *
                          amplitudes[x]
                        : 0);
                ctx.lineTo(realX, y);
            }

            ctx.strokeStyle = 'white';
            ctx.stroke();

            if (shouldAnimate) {
                phase += 0.05 * speed; // Adjust phase increment based on speed
                animationRef.current = requestAnimationFrame(draw);
            } else {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            }
        };

        initWave();
        draw();

        const resizeObserver = new ResizeObserver(() => {
            if (!canvas.parentElement) return;
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = height;
            initWave();
            draw();
        });
        resizeObserver.observe(parent);

        return () => {
            resizeObserver.disconnect();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [height, scale, shouldAnimate, speed]);

    return canvasRef;
};
