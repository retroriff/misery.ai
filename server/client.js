const WebSocket = require("ws")
const OSC = require("osc-js")

const SERVER_URL = "ws://localhost:8080"
let ws

function connect() {
  ws = new WebSocket(SERVER_URL)

  ws.on("open", () => {
    console.log("Connected to WebSocket server")

    // Create an OSC message
    const message = new OSC.Message("/play", 440)
    ws.send(message.pack()) // Send the packed OSC message
  })

  ws.on("message", (data) => {
    console.log("Received:", data)
  })

  ws.on("close", () => {
    console.log("Disconnected from WebSocket server")
    setTimeout(connect, 1000) // Reconnect after 1 second
  })

  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
    ws.close() // Close the current connection to clean up before reconnecting
  })
}

connect()
