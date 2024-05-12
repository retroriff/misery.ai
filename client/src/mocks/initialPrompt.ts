import type { Message } from '~/App';

export const initialPrompt: Message = {
    role: 'user',
    content: `
    Hola!
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
\`\`\`SuperCollider
TR08.preset(\electro, 2);
\`\`\`
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore illo ab?
\`\`\`js
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
const test = 5
\`\`\`
    `.replace(/\n\s*/g, '\n')
};

export const shortPrompt: Message = {
    role: 'assistant',
    content: 'Hello, stupid human. How can I help you?'
};
