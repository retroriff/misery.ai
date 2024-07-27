import { useWaveAnimation } from "../composables/useWaveAnimation"

type WaveAnimationProps = {
  isLoading: boolean
  shouldAnimate: boolean
}

const WaveAnimation = ({ isLoading, shouldAnimate }: WaveAnimationProps) => {
  const scale = isLoading ? 10 : 10
  const speed = isLoading ? 4 : 2
  const waveAnimationRef = useWaveAnimation(100, scale, shouldAnimate, speed)

  return (
    <div id="wave-animation" className="w-full h-full">
      <canvas ref={waveAnimationRef}>
        A wave animation that changes behavior while we are loading a new
        response
      </canvas>
    </div>
  )
}

export default WaveAnimation
