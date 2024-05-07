const express = require("express")
const OSC = require("osc-js")

const app = express()
const PORT = 3000 // HTTP server port
const WSPORT = 8080 // WebSocket port, used by BridgePlugin

const config = {
  udpClient: {
    port: 57120, // OSC server port
    host: "127.0.0.1", // OSC server address
  },
}

// Initialize OSC with the BridgePlugin
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })

// Serve static files (if needed)
app.use(express.static("public"))

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`)
})

// Open the WebSocket connection and bind OSC events
osc.open({ port: WSPORT }) // Open WebSocket on specified port

console.log(`WebSocket OSC Bridge running on ws://localhost:${WSPORT}`)

// Handle incoming OSC messages from other OSC sources
osc.on("/test", (message) => {
  console.log("Received OSC message:", message.args)
  // Here you can also forward or process OSC messages as needed
})

// You might also want to handle WebSocket connections to interact with the web clients
osc.on("open", (socket) => {
  console.log("A client has connected.")
})

osc.on("message", (message, rinfo) => {
  console.log(
    "Received WebSocket message:",
    message.args,
    "from",
    rinfo.address
  )
  // Process the WebSocket message as needed
})

osc.on("error", (error) => {
  console.error("Error:", error)
})
