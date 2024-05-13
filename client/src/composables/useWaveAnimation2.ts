import { useRef, useEffect } from 'react';

export const useWaveAnimation = (
    height: number,
    scale: number,
    isLoading: boolean
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.parentElement) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
                initWave(width);
            }
        });
        resizeObserver.observe(canvas.parentElement);

        let amplitudes: number[] = [];
        let frequencies: number[] = [];
        let phase = 0;

        function initWave(width: number) {
            const numPoints = Math.ceil(width / scale);
            amplitudes = new Array(numPoints)
                .fill(0)
                .map(() => Math.random() * 20 + 5);
            frequencies = new Array(numPoints)
                .fill(0)
                .map(() => Math.random() * 0.05 + 0.01);
        }

        const draw = () => {
            if (!canvas.width) return; // Guard against no width
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            for (let x = 0; x < amplitudes.length; x++) {
                let realX = x * scale;
                let y =
                    canvas.height / 2 +
                    Math.sin(realX * frequencies[x] + phase) * amplitudes[x];
                ctx.lineTo(realX, y);

                if (Math.random() < 0.1) {
                    amplitudes[x] = Math.random() * 20 + 5;
                    frequencies[x] = Math.random() * 0.05 + 0.01;
                }
            }

            ctx.strokeStyle = 'white';
            ctx.stroke();
            phase += 0.05;

            if (isLoading) {
                animationRef.current = requestAnimationFrame(draw);
            }
        };

        if (isLoading) {
            draw();
        }

        return () => {
            resizeObserver.disconnect();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [height, scale, isLoading]);

    return canvasRef;
};
