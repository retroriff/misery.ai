# Misery.ai

- Real-time communication between a React frontend and Node.js backend.
- OSC message forwarding to SuperCollider or similar applications.
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

Create `.env` files in your server and client directories:

```plaintext
# Client configuration
REACT_APP_OPENAI_API_URL=https://api.openai.com/v1/chat/completions
REACT_APP_OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

Ensure these variables are correctly referenced in your code.

## Running the Application

To run both the server and client simultaneously from the project root:

```bash
npm start
```

This command will start the server on port 3000 and the React development server on port 3001.
