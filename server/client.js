const WebSocket = require("ws")
const OSC = require("osc-js")

const SERVER_URL = "ws://localhost:8080"
let ws

function connect() {
  ws = new WebSocket(SERVER_URL)

  ws.on("open", () => {
    console.log("Connected to WebSocket server")
    const args = ["Px.play;"]
    const message = new OSC.Message("/px", ...args)
    console.log(
      "🚀 Message sent:",
      message.address,
      message.args,
      "to",
      SERVER_URL
    )
    ws.send(message.pack())
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
    ws.close()
  })
}

connect()
