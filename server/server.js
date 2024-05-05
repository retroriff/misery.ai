const express = require("express")
const OSC = require("osc-js")

const app = express()
const PORT = 3000 // HTTP server port
const WSPORT = 8080 // WebSocket port, used by BridgePlugin

const config = {
  udpClient: {
    port: 57120,
    host: "127.0.0.1",
  },
}

const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })

osc.open() // Opens UDP and WebSocket servers

app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`)
  console.log(`WebSocket bridge running on ws://localhost:${WSPORT}`)
})
