import { useRef, useState, useEffect } from "react"
import Hydra from "hydra-synth"
import { Message } from "~/types"

export function useHydra(): [
  React.MutableRefObject<HTMLCanvasElement | null>,
  boolean,
] {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hydraLoaded, setHydraLoaded] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      new Hydra({
        canvas: canvasRef.current,
        detectAudio: false,
      })
      setHydraLoaded(true)
    }
  }, [])

  return [canvasRef, hydraLoaded]
}

export const defaultHydraCode: Message = {
  content: `osc(5, 0.1)
  .modulate(noise(2), 0.22)
  .diff(o0)
  .modulateScrollY(osc(2)
  .modulate(osc(1), 0.11))
  .scale(0.8)
  .color(0.59, 0.014, 1)
  .out()`,
  role: "assistant",
}
