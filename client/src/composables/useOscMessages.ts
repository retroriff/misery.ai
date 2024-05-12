import { useEffect } from 'react';
import OSC from 'osc-js';

const config = {
    host: 'localhost',
    port: 8080,
    secure: false
};

const osc = new OSC({
    plugin: new OSC.WebsocketClientPlugin(config)
});

const sanitizeSymbolToString = (symbol: string): string => {
    if (symbol.startsWith('\\')) {
        return symbol.substring(1);
    }
    return symbol;
};

const handleTR08 = (codeBlock: string) => {
    // This regex now captures the entire TR08 command including play and stop
    const tr08Regex = /TR08\.([^;]*);/g;
    let tr08Match;

    while ((tr08Match = tr08Regex.exec(codeBlock)) !== null) {
        const action = tr08Match[1]; // This captures everything after TR08.
        console.log('Extracted TR08 command:', action);

        if (action.startsWith('preset')) {
            return handlePresets(tr08Match[0]);
        }

        return sendOscMessage({
            address: '/tr08',
            args: [action]
        });
    }
};

const handlePresets = (code: string) => {
    const presetRegex = /preset\((\S+),\s*(\d+)\)/;
    const presetMatch = code.match(presetRegex);

    if (presetMatch) {
        const presetName = sanitizeSymbolToString(presetMatch[1]);
        const presetIndex = presetMatch[2];

        console.log('Preset Name:', presetName);
        console.log('Preset Index:', presetIndex);

        sendOscMessage({
            address: '/tr08/preset',
            args: [presetName, presetIndex]
        });
    }
};

type Message = {
    address: string;
    args?: any[];
};

const sendOscMessage = (message: Message) => {
    const { address, args = [] } = message;

    try {
        const message = new OSC.Message(address, ...args);
        osc.send(message);
        console.log(`OSC message sent: ${address}`);
    } catch (error) {
        console.error('Failed to send OSC message:', error);
    }
};

export const useOscMessages = () => {
    useEffect(() => {
        osc.open();

        return () => osc.close();
    }, []);

    const handleContent = (content: string) => {
        if (content.toLowerCase().includes('play')) {
            sendOscMessage({ address: '/play' });
        } else if (content.toLowerCase().includes('stop')) {
            sendOscMessage({ address: '/stop' });
        }

        const codeRegex = /```([^`]+)```/g;
        let match;

        while ((match = codeRegex.exec(content)) !== null) {
            handleTR08(match[1]);
        }
    };

    return { sendOscMessage, handleContent };
};
