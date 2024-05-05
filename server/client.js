const WebSocket = require("ws")

const ws = new WebSocket("ws://127.0.0.1:8080")

ws.on("open", function open() {
  console.log("Connected to WebSocket server")
  const message = JSON.stringify({
    address: "/play",
    args: [440], // Adjust the args to match the expected types in the server
  })
  ws.send(message)
  console.log("Message sent:", message)
})

ws.on("message", function incoming(data) {
  console.log("Received from server:", data)
})

ws.on("close", function close() {
  console.log("Disconnected from WebSocket server")
})

ws.on("error", function error(err) {
  console.error("WebSocket error:", err)
})
