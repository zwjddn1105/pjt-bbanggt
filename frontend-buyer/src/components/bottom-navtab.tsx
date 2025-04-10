"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ShoppingCart } from "lucide-react";

export default function BottomNavTab() {
  const pathname = usePathname();

  const tabs = [
    { id: "문의", icon: MessageCircle, href: "/inquiry" },
    { id: "주문", icon: ShoppingCart, href: "/" },
    { id: "픽업", icon: ShoppingCart, href: "/pickup" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-end h-18 px-2 py-2">
        {tabs.map((tab) => {
          // 경로가 정확히 일치하거나, 하위 경로인 경우 활성화 (예: /pickup/history)
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex flex-col items-center w-full"
            >
              {tab.id !== "주문" ? (
                <>
                  <tab.icon
                    className={`h-7 w-7 ${
                      isActive ? "text-primary-custom" : "text-secondary-custom"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium mt-1 ${
                      isActive ? "text-primary-custom" : "text-secondary-custom"
                    }`}
                  >
                    {tab.id}
                  </span>
                </>
              ) : (
                <>
                  <div className="relative -mt-10">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isActive ? "bg-orange-500" : "bg-bread-brown"
                      }`}
                    >
                      <Image
                        src={`/buyer/bread-pattern.png`}
                        alt="로고"
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <span className="invisible text-sm mt-1">주문</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
