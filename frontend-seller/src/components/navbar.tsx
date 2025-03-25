"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/map"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              빵긋 지도
            </Link>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              상품관리
            </Link>
          </div>

          {/* Logo (center on desktop) */}
          <div className="flex items-center justify-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* Replace with your actual logo */}
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.png"
                  alt="빵긋 로고"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Right navigation items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/inquiries"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              고객 문의 관리
            </Link>
            <Button asChild>
              <Link href="/login">로그인</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isMobileMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/map"
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
          >
            빵긋 지도
          </Link>
          <Link
            href="/products"
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
          >
            상품관리
          </Link>
          <Link
            href="/inquiries"
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
          >
            고객 문의 관리
          </Link>
          <div className="px-3 py-2">
            <Button className="w-full" asChild>
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
