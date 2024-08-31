import { useCallback, useEffect, useState } from "react"

const useMidiAccess = () => {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null)

  useEffect(() => {
    const handleMIDI = async () => {
      if (navigator.requestMIDIAccess) {
        try {
          const access = await navigator.requestMIDIAccess()
          setMidiAccess(access)
          console.log("MIDI Access obtained:", access)
        } catch (error) {
          console.error("Failed to obtain MIDI access.", error)
        }
      } else {
        console.error("😬 Web MIDI API is not supported in this browser.")
      }
    }

    handleMIDI()
  }, [])

  return midiAccess
}

// Function to convert BPM to milliseconds per beat
const bpmToMillisecondsPerBeat = (bpm: number) => {
  return 60000 / bpm // 60000 ms in a minute divided by BPM
}

// Define the BPM (Beats Per Minute)
const BPM = 120 // Example BPM value

export const useMidiMessages = () => {
  const midiAccess = useMidiAccess()

  // Calculate delay based on BPM
  const millisecondsPerBeat = bpmToMillisecondsPerBeat(BPM)

  const sendMidiMessage = useCallback(
    (message: Uint8Array) => {
      if (midiAccess) {
        const outputs = Array.from(midiAccess.outputs.values())
        if (outputs.length > 0) {
          outputs[0].send(message)
          console.log("MIDI message sent:", message)
        } else {
          console.error("No MIDI outputs available.")
        }
      } else {
        console.error("MIDI access not available.")
      }
    },
    [midiAccess]
  )

  const sendNoteOn = useCallback(
    (note: number, velocity: number) => {
      console.log("Hola")
      const message = new Uint8Array([0x90, note, velocity])
      sendMidiMessage(message)
    },
    [sendMidiMessage]
  )

  const sendNoteOff = useCallback(
    (note: number) => {
      const message = new Uint8Array([0x80, note, 0])
      sendMidiMessage(message)
    },
    [sendMidiMessage]
  )

  const handleMidiMessages = useCallback(
    (codeBlock?: string) => {
      console.log("Hol2a2")
      const noteDuration = millisecondsPerBeat / 2 // Example: half a beat duration

      sendNoteOn(70, 127) // C3 Note On
      setTimeout(() => sendNoteOff(60), noteDuration) // C3 Note Off after half a beat

      // Example: Scheduling a note every beat
      setInterval(() => {
        console.log("Hola2", codeBlock)
        sendNoteOn(80, 127) // C3 Note On
        setTimeout(() => sendNoteOff(60), noteDuration) // C3 Note Off
      }, millisecondsPerBeat) // Schedule the next note on every beat
    },
    [sendNoteOn, sendNoteOff, millisecondsPerBeat]
  )

  return { handleMidiMessages }
}
