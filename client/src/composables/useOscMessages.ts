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
            const codeBlock = match[1];
            const tr08Regex = /TR08[^;]*;/g;
            let tr08Match;

            while ((tr08Match = tr08Regex.exec(codeBlock)) !== null) {
                console.log('Extracted code:', tr08Match[0]);
                // Check for 'preset' and extract parameters
                const presetRegex = /preset\((\S+),\s*(\d+)\)/;
                const presetMatch = tr08Match[0].match(presetRegex);
                if (presetMatch) {
                    const presetName = presetMatch[1];
                    const presetIndex = presetMatch[2];
                    console.log('Preset Name:', presetName);
                    console.log('Preset Index:', presetIndex);
                    sendOscMessage({
                        address: '/tr08/preset',
                        args: [presetName, presetIndex]
                    });
                }
            }
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

    return { sendOscMessage, handleContent };
};
