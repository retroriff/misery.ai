// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useHydra } from "~/composables/useHydra"
import { useEffect } from "react"

type AnimationProps = {
  code: string
}

function Animation({ code }: AnimationProps) {
  const [canvasRef, hydraLoaded] = useHydra()

  useEffect(() => {
    if (!hydraLoaded) return

    executeHydraCode(code)
  }, [code, hydraLoaded])

  const executeHydraCode = (code: string) => {
    try {
      new Function(code)()
    } catch (error) {
      console.error("Error executing Hydra code:", error)
    }
  }

  return (
    <canvas className="fixed w-full h-full inset-0 -z-10" ref={canvasRef} />
  )
}

export default Animation
