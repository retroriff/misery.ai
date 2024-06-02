import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"

type CodeBlockProps = {
  code: string
  language?: string
}

const CodeBlock = ({ code, language = "JavaScript" }: CodeBlockProps) => {
  return (
    <SyntaxHighlighter language={language} style={materialDark}>
      {code}
    </SyntaxHighlighter>
  )
}

export default CodeBlock
