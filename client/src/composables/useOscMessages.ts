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

const handleCode = (codeBlock: string) => {
    const validClasses = /^\s*(TR08|Ns)/;
    const hasValidClasses = validClasses.test(codeBlock);

    if (hasValidClasses) {
        // const sanitizedCode = codeBlock.replace(/\\/g, '\\\\');
        return sendOscMessage({
            address: '/px',
            args: [codeBlock]
        });
    }

    console.log('😬 Code does not contain Px valid classes');
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
        console.log(`🚀 OSC message sent: ${address}`);
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
        // console.log('👀 Handling content:', content);
        const codeRegex = /```([\s\S]+?)```/g;
        let match;

        while ((match = codeRegex.exec(content)) !== null) {
            handleCode(match[1]);
        }
    };

    return { sendOscMessage, handleContent };
};
