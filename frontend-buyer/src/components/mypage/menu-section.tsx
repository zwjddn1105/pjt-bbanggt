import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface MenuSectionProps {
  title: string
  items: {
    label: string
    href: string
  }[]
}

export function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <div>
      <div className="px-4 py-3 text-gray-500 font-medium text-sm">{title}</div>
      <div>
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}

