import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface HeaderProps {
  title: string
  icon?: LucideIcon
  count?: number
  backLink?: string
}

/**
 * 공통 헤더 컴포넌트
 *
 * @param title - 헤더 제목
 * @param icon - 우측에 표시할 아이콘 (선택사항)
 * @param count - 아이콘에 표시할 카운트 (선택사항)
 * @param backLink - 뒤로가기 링크 (선택사항)
 *
 * @remarks
 * API 연동 시 수정 사항:
 * - count 값은 API에서 가져온 실제 데이터로 대체 필요 (장바구니 개수, 알림 개수 등)
 * - 사용자 권한에 따라 특정 아이콘이나 기능을 조건부로 표시해야 할 수 있음
 */
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
            <Link href="/cart">
              <Icon className="h-6 w-6" />
              {count !== undefined && count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

