import { useRef, useState, useEffect } from "react"
import Hydra from "hydra-synth"

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
