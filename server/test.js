const OSC = require("osc-js")

const config = {
  udpClient: {
    port: 57120,
    host: "127.0.0.1",
  },
  udpServer: {
    port: 57121,
    host: "127.0.0.1",
  },
}

const osc = new OSC({ plugin: new OSC.DatagramPlugin(config) })

osc.open() // Opens UDP servers

// Listen for incoming OSC messages
osc.on("/test", (message) => {
  console.log("Received OSC message:", message)
})

// Send an OSC message
setTimeout(() => {
  const message = new OSC.Message("/test", 123)
  osc.send(message, { host: "127.0.0.1", port: 57121 })
  console.log("Sent OSC message:", message)
}, 1000)

osc.on("error", (error) => {
  console.error("OSC Error:", error)
})
