export const playSineWave = () => {
    // Check if AudioContext is available
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        alert('Web Audio API is not supported in this browser');
        return;
    }

    // Create an AudioContext
    const audioContext = new AudioContext();

    // Create an OscillatorNode
    const oscillator = audioContext.createOscillator();

    // Set the oscillator type to 'sine'
    oscillator.type = 'sine';

    // Set the frequency of the oscillator (in Hz)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note

    // Connect the oscillator to the audio context's destination (speakers)
    oscillator.connect(audioContext.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after 2 seconds
    oscillator.stop(audioContext.currentTime + 2);
};
