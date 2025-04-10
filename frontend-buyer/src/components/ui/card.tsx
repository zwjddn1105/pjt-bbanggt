import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`border rounded-xl p-4 mb-4 ${className}`}>{children}</div>
}

