"use client"

import type React from "react"

import { useState } from "react"
import { Menu } from "lucide-react"
import SidebarMenu from "./sidebar-menu"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative h-full">
      {/* 메인 콘텐츠 */}
      <div className="h-full">
        {/* 햄버거 메뉴 버튼 */}
        <button className="absolute top-4 left-4 z-20" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>

        {/* 메인 콘텐츠 */}
        {children}
      </div>

      {/* 사이드바 오버레이 */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarMenu />
      </div>
    </div>
  )
}

