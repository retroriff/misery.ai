import React from 'react';
import CodeBlock from './CodeBlock';

interface RenderContentProps {
    content: string;
}

const RenderContent: React.FC<RenderContentProps> = ({ content }) => {
    const elements: JSX.Element[] = [];
    const regex = /```(\w+)?\s*([\s\S]*?)```/gm;
    let lastIndex = 0;

    content.replace(regex, (match, lang, code, offset) => {
        // Extract and add the text before the code block as separate paragraphs
        const text = content.slice(lastIndex, offset);
        if (text.trim().length > 0) {
            // Split text by double newlines or use a fallback similar to the last explanation
            const paragraphs = text.split('\n\n');
            paragraphs.forEach((paragraph, index) => {
                if (paragraph.trim().length > 0) {
                    elements.push(
                        <p key={`text-${lastIndex}-${index}`}>{paragraph}</p>
                    );
                }
            });
        }

        // Add the code block
        elements.push(
            <CodeBlock
                key={`code-${offset}`}
                code={code.trim()}
                language={lang || 'javascript'} // Default language is javascript
            />
        );
        lastIndex = offset + match.length;
        return match;
    });

    // Handle any remaining text after the last code block
    if (lastIndex < content.length) {
        const remainingText = content.slice(lastIndex);
        const paragraphs = remainingText.split('\n\n');
        paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim().length > 0) {
                elements.push(
                    <p key={`text-remaining-${index}`}>{paragraph}</p>
                );
            }
        });
    }

    return <>{elements}</>;
};

export default RenderContent;
