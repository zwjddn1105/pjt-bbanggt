"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, MapPin } from "lucide-react"

interface SidebarMenuProps {
  username?: string
  profileImage?: string
}

export default function SidebarMenu({ username = "random1234", profileImage = "/mascot.png" }: SidebarMenuProps) {
  // 드롭다운 메뉴 상태 관리
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    빵집리스트: false,
    빵긋긋리스트: false,
    빵리스트: false,
  })

  // 드롭다운 토글 함수
  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* 프로필 섹션 */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt="프로필 이미지"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-orange-400 text-lg font-medium">{username}님,</p>
            <p className="font-medium">반갑습니다!</p>
          </div>
        </div>
        <button className="px-4 py-1.5 border border-orange-400 text-orange-400 rounded-full">설정</button>
      </div>

      {/* 메뉴 항목들 */}
      <div className="flex-1 overflow-auto">
        <Link href="/my-bread" className="block px-4 py-3 border-b">
          MY 빵긋긋 보기
        </Link>
        <Link href="/my-bakery" className="block px-4 py-3 border-b">
          MY 빵집 보기
        </Link>
        <Link href="/my-bread-items" className="block px-4 py-3 border-b">
          MY 빵 보기
        </Link>
        <Link href="/my-location" className="flex items-center px-4 py-3 border-b">
          <span>내 위치 바로가기</span>
          <MapPin className="ml-2 h-4 w-4" />
        </Link>

        {/* 드롭다운 메뉴 - 빵집 리스트 */}
        <div className="border-b">
          <button
            className="w-full flex justify-between items-center px-4 py-3"
            onClick={() => toggleMenu("빵집리스트")}
          >
            <span>MY 빵집 리스트</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${openMenus["빵집리스트"] ? "rotate-180" : ""}`} />
          </button>
          {openMenus["빵집리스트"] && (
            <div className="bg-gray-50 py-2 px-6">
              <Link href="/bakery/list/favorite" className="block py-2">
                즐겨찾는 빵집
              </Link>
              <Link href="/bakery/list/recent" className="block py-2">
                최근 방문 빵집
              </Link>
              <Link href="/bakery/list/all" className="block py-2">
                모든 빵집
              </Link>
            </div>
          )}
        </div>

        {/* 드롭다운 메뉴 - 빵긋긋 리스트 */}
        <div className="border-b">
          <button
            className="w-full flex justify-between items-center px-4 py-3"
            onClick={() => toggleMenu("빵긋리스트")}
          >
            <span>MY 빵긋 리스트</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${openMenus["빵긋긋리스트"] ? "rotate-180" : ""}`} />
          </button>
          {openMenus["빵긋긋리스트"] && (
            <div className="bg-gray-50 py-2 px-6">
              <Link href="/bread/list/favorite" className="block py-2">
                즐겨찾는 빵긋
              </Link>
              <Link href="/bread/list/recent" className="block py-2">
                최근 주문 빵긋
              </Link>
              <Link href="/bread/list/all" className="block py-2">
                모든 빵긋
              </Link>
            </div>
          )}
        </div>

        {/* 드롭다운 메뉴 - 빵 리스트 */}
        <div className="border-b">
          <button className="w-full flex justify-between items-center px-4 py-3" onClick={() => toggleMenu("빵리스트")}>
            <span>MY 빵 리스트</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${openMenus["빵리스트"] ? "rotate-180" : ""}`} />
          </button>
          {openMenus["빵리스트"] && (
            <div className="bg-gray-50 py-2 px-6">
              <Link href="/bread-items/list/favorite" className="block py-2">
                즐겨찾는 빵
              </Link>
              <Link href="/bread-items/list/recent" className="block py-2">
                최근 주문 빵
              </Link>
              <Link href="/bread-items/list/all" className="block py-2">
                모든 빵
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

