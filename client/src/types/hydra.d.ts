declare module "hydra-synth" {
  type HydraConfig = {
    canvas: HTMLCanvasElement | null
    detectAudio: boolean
  }

  interface HydraChain {
    kaleid: (n: number) => HydraChain
    rotate: (angle: number, speed: number) => HydraChain
    out: () => void
    scrollX: (scrollX: number, scrollY: number) => HydraChain
    scale: (x: number, y?: number) => HydraChain
    mult: (input: HydraChain) => HydraChain
  }

  class Hydra {
    constructor(config: HydraConfig)
  }

  export default Hydra
}

declare function osc(
  frequency: number,
  sync: number,
  offset: number
): HydraChain
