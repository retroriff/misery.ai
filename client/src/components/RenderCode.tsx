import CodeBlock from "./CodeBlock"

interface RenderCodeProps {
  content: string
}

const RenderCode = ({ content }: RenderCodeProps) => {
  const elements: JSX.Element[] = []
  const lines = content.split("\n")

  lines.forEach((line, index) => {
    elements.push(
      <CodeBlock key={`code-${index}`} code={line} language="javascript" />
    )
  })

  return <>{elements}</>
}

export default RenderCode
