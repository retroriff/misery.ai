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

    const sendOscMessage = (command: string) => {
        try {
            const message = new OSC.Message(command);
            osc.send(message);
            console.log(`OSC message sent: ${command}`);
        } catch (error) {
            console.error('Failed to send OSC message:', error);
        }
    };

    return { sendOscMessage };
};
