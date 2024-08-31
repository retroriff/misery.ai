export const useMidiMessages = () => {
  const handleMidiMessages = (codeBlock: string): void => {
    console.log("Web MIDI API", codeBlock)
  }

  return { handleMidiMessages }
}
