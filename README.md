# Misery.ai

- Real-time communication between a React frontend and Node.js backend.
- OSC message forwarding to SuperCollider.
- Interactive UI for command input and response display.

## Installation

Install the required dependencies:

```bash
# Install dependencies for server
cd server
npm install

# Install dependencies for client
cd ../client
npm install

# Return to the root directory
cd ..
```

## Configuration

### Environment Variables

Create an `.env` file in your client directory:

```bash
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
VITE_GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
```

Ensure these variables are correctly referenced in your code.

## Running the Application

To run both the server and client simultaneously from the project root:

```bash
npm start
```

This command will start the server on port 3000 and the React development server on port 3001.

## Control Keys

- **Command + Up and Command + Down arrow keys**: Navigate through the history of user-sent messages. Use the Up arrow key to browse previous messages and the Down arrow key to browse next messages.
- **@**: Trigger a reevaluation of the last piece of code provided by the assistant. This can be useful for quickly rechecking or updating the last response without retyping.

## Hydra Animation

You can edit the animation by focusing on it and clicking or pressing the return key.

## OSC Messages

OSC Messages are sent from the server app to the listener, defined by the `udpClient` object. The connection can be debugged:

```
node server/test.js
```
