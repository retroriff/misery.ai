import { useEffect } from "react"
import OSC from "osc-js"

const config = {
  host: "localhost",
  port: 8080,
  secure: false,
}

const osc = new OSC({
  plugin: new OSC.WebsocketClientPlugin(config),
})

const handleCode = (codeBlock: string) => {
  const validClasses = /^\s*(Nfx|Ns|Play|Px|TR08)/
  const hasValidClasses = validClasses.test(codeBlock)
  console.log(codeBlock)

  if (hasValidClasses) {
    console.log("👍 Code contains Px valid classes", codeBlock)

    return sendOscMessage({
      address: "/px",
      args: [codeBlock],
    })
  }
  console.log("😬 Code does not contain Px valid classes")
}

type Message = {
  address: string
  args?: string[]
}

const sendOscMessage = (message: Message) => {
  const { address, args = [] } = message

  try {
    const message = new OSC.Message(address, ...args)
    osc.send(message)
    console.log(`🚀 OSC message sent: ${address}`)
  } catch (error) {
    console.error("Failed to send OSC message:", error)
  }
}

export const useOscMessages = () => {
  useEffect(() => {
    osc.open()

    return () => osc.close()
  }, [])

  const handleContent = (content: string) => {
    const codeRegex = /```([\s\S]+?)```/g
    let match

    while ((match = codeRegex.exec(content)) !== null) {
      handleCode(match[1])
    }
  }

  return { sendOscMessage, handleContent }
}
