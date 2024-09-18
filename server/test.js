const OSC = require("osc-js")

const config = {
  udpClient: {
    host: "127.0.0.1",
    port: 57120,
  },
  udpServer: {
    host: "127.0.0.1",
    port: 57121,
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
  const message = new OSC.Message("/px", 123)
  osc.send(message, { host: "127.0.0.1", port: 57121 })
  console.log("Sent OSC message:", message)
}, 1000)

osc.on("error", (error) => {
  console.error("OSC Error:", error)
})
