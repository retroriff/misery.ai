import CodeBlock from "./CodeBlock"

interface RenderCodeProps {
  content: string
}

const RenderCode = ({ content }: RenderCodeProps) => {
  const formattedContent = `${content}`.trim()
  const elements: JSX.Element[] = []
  const lines = formattedContent.split("\n")

  lines.forEach((line, index) => {
    elements.push(
      <CodeBlock key={`code-${index}`} code={line} language="javascript" />
    )
  })

  return elements
}

export default RenderCode
