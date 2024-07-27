// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useHydra } from "~/composables/useHydra"
import { useEffect, useRef, useState } from "react"
import Prism from "prismjs"
// import "prismjs/themes/prism-okaidia.css"
import "~/assets/css/prism-atom-dark.css" // Import Prism dark theme CSS

function App({ shouldAnimate }: { shouldAnimate: boolean }) {
  const [canvasRef, hydraLoaded] = useHydra()
  const [hydraCode, setHydraCode] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hydraLoaded) return

    const defaultHydraCode = `
      osc(5, 0.1)
        .modulate(noise(2), 0.22)
        .diff(o0)
        .modulateScrollY(osc(2).modulate(osc(1), 0.11))
        .scale(0.8)
        .color(0.59, 0.014, 1)
        .out()
    `

    const singleLineCode = defaultHydraCode
      .replace(/\s*\.\s*/g, ".")
      .replace(/\s+/g, " ")
      .trim()
    setHydraCode(singleLineCode)
    executeHydraCode(singleLineCode)
  }, [hydraLoaded])

  useEffect(() => {
    Prism.highlightAll()
  }, [hydraCode])

  const executeHydraCode = (code: string) => {
    try {
      new Function(code)()
    } catch (error) {
      console.error("Error executing Hydra code:", error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => {
      if (codeRef.current) {
        codeRef.current.focus()
        // Set caret position at the start
        const range = document.createRange()
        const sel = window.getSelection()
        range.setStart(codeRef.current.childNodes[0], 0)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }, 0)
  }

  const handleSave = () => {
    if (codeRef.current) {
      const updatedCode = codeRef.current.innerText.trim()
      setHydraCode(updatedCode)
      executeHydraCode(updatedCode)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault() // Prevent inserting newline
      if (isEditing) {
        handleSave()
      } else {
        handleEdit()
      }
    }
  }

  return (
    <>
      <pre
        className="absolute text-white right-0 top-0 bg-primary-bg bg-opacity-80 inline-block overflow-x-auto whitespace-nowrap"
        contentEditable={isEditing}
        onBlur={handleSave}
        onClick={handleEdit}
        onKeyDown={handleKeyDown}
        ref={codeRef}
        suppressContentEditableWarning={true}
        tabIndex={0}
      >
        <code className="language-javascript">{hydraCode}</code>
      </pre>
      <canvas
        className="absolute w-full h-full inset-0 -z-10"
        ref={canvasRef}
      />
    </>
  )
}

export default App
