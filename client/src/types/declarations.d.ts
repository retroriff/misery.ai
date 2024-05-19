// Web Audio API: Property 'webkitAudioContext' does not exist on type 'Window & typeof globalThis'
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

export {}
