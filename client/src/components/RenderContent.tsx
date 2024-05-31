import CodeBlock from "./CodeBlock"

interface RenderContentProps {
  content: string
}

const RenderContent = ({ content }: RenderContentProps) => {
  const elements: JSX.Element[] = []
  const regex = /```(\w+)?\s*([\s\S]*?)```/gm
  let lastIndex = 0

  content.replace(regex, (match, lang, code, offset) => {
    const text = content.slice(lastIndex, offset)
    // Extract and add the text before the code block as separate paragraphs
    if (text.trim().length > 0) {
      const paragraphs = text.split("\n\n")

      paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim().length > 0) {
          elements.push(<p key={`text-${lastIndex}-${index}`}>{paragraph}</p>)
        }
      })
    }

    elements.push(
      <CodeBlock
        key={`code-${offset}`}
        code={code.trim()}
        language={lang || "javascript"}
      />
    )
    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex)
    const paragraphs = remainingText.split("\n\n")
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim().length > 0) {
        elements.push(<p key={`text-remaining-${index}`}>{paragraph}</p>)
      }
    })
  }

  return <>{elements}</>
}

export default RenderContent
