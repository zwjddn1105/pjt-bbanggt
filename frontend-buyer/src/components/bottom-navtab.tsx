"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Home, MessageCircle, ShoppingCart, User } from "lucide-react"

export default function BottomNavTab() {
  const pathname = usePathname()

  const tabs = [
    { id: "홈", icon: Home, href: "/" },
    { id: "문의", icon: MessageCircle, href: "/inquiry" },
    { id: "주문", icon: ShoppingCart, href: "/order" },
    { id: "픽업", icon: ShoppingCart, href: "/pickup" },
    { id: "MY", icon: User, href: "/mypage" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-end h-16 px-2">
        {tabs.map((tab) => {
          // 경로가 정확히 일치하거나, 하위 경로인 경우 활성화 (예: /mypage/payment-history)
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex flex-col items-center w-full"
            >
              {tab.id !== "주문" ? (
                <tab.icon
                  className={`h-5 w-5 ${isActive ? "text-primary-custom" : "text-secondary-custom"}`}
                />
              ) : (
                <div className="relative -mt-8 mb-1">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    isActive ? "bg-orange-500" : "bg-bread-brown"
                  }`}>
                    <Image src="/logo.jpg" alt="로고" width={30} height={30} className="rounded-full" />
                  </div>
                </div>
              )}
              <span className={`text-xs mt-1 ${isActive ? "text-primary-custom" : "text-secondary-custom"}`}>
                {tab.id}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
