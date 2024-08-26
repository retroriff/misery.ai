import { ReactNode } from "react"
import { ColumnType } from "~/types"

type ColumnProps = {
  children: ReactNode
  responseType: ColumnType
}

const Column = ({ children, responseType }: ColumnProps) => {
  return (
    <div
      className={`flex-1 h-full flex flex-col max-w-[33%] relative ${responseType ? "pt-12" : ""}`}
    >
      {children}
    </div>
  )
}

export default Column
