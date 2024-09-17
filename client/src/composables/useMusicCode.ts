import config from "~/config"
import { useMidiMessages } from "./useMidiMessages"
import { useOscMessages } from "./useOscMessages"
import { useMemo } from "react"
import { Output } from "~/types"

export const useMusicCode = () => {
  const { handleMidiMessages } = useMidiMessages()
  const { handleOscMessages } = useOscMessages()

  const musicHandler = useMemo(() => {
    return config.musicOutput === Output.MIDI
      ? handleMidiMessages
      : handleOscMessages
  }, [handleMidiMessages, handleOscMessages])

  return musicHandler
}
