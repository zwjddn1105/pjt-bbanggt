import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface HeaderProps {
  title: string
  icon?: LucideIcon
  count?: number
  backLink?: string
}

export function Header({ title, icon: Icon, count, backLink }: HeaderProps) {
  return (
    <header className="p-4 border-b">
      <div className="flex items-center">
        {backLink && (
          <Link href={backLink} className="mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
        {Icon && (
          <div className="relative ml-auto">
            <Icon className="h-6 w-6" />
            {count !== undefined && count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

