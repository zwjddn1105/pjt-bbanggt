"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Header } from "@/components/ui/header"
import CartItem from "@/components/cart/cart-item"
import CartSummary from "@/components/cart/cart-summary"
import CartLocation from "@/components/cart/cart-location"
import CartActions from "@/components/cart/cart-actions"

export default function CartPage() {
  // 더미 데이터 - 나중에 API로 대체
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "맛있는 소보로",
      bakery: "빵긋빵긋",
      quantity: 3,
      price: 3200, // 이미 총 가격 (3개의 가격이 3200원)
      image: "/bread-pattern.png",
      isSelected: true,
    },
    {
      id: 2,
      name: "맛있는 소보로",
      bakery: "빵긋빵긋",
      quantity: 3,
      price: 3200, // 이미 총 가격
      image: "/bread-pattern.png",
      isSelected: true,
    },
    {
      id: 3,
      name: "맛있는 소보로",
      bakery: "빵긋빵긋",
      quantity: 3,
      price: 3200, // 이미 총 가격
      image: "/bread-pattern.png",
      isSelected: true,
    },
  ])

  // 선택 상태 변경 핸들러
  const handleSelectChange = (id: number, selected: boolean) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, isSelected: selected } : item)))
  }

  // 아이템 삭제 핸들러
  const handleDeleteItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // 선택된 아이템만 필터링
  const selectedItems = cartItems.filter((item) => item.isSelected)

  // 총 수량 및 가격 계산
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalTypes = cartItems.length

  // 선택된 아이템의 수량 및 가격 계산
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedTypesCount = selectedItems.length
  // 가격은 이미 총 가격이므로 수량을 곱하지 않음
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <main className="pb-20">
      <Header title="빵긋 장바구니" icon={ShoppingCart} count={totalItems} backLink="/" />

      {/* 매장 위치 */}
      <CartLocation storeName="빵긋빵긋 역삼점" />

      {/* 장바구니 아이템 목록 */}
      <div className="px-4 py-2">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.name}
              bakery={item.bakery}
              quantity={item.quantity}
              price={item.price}
              image={item.image}
              isSelected={item.isSelected}
              onSelectChange={handleSelectChange}
              onDelete={handleDeleteItem}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">장바구니가 비어있습니다.</p>
          </div>
        )}
      </div>

      {/* 장바구니 요약 정보 */}
      {cartItems.length > 0 && (
        <CartSummary
          selectedItems={selectedItemsCount}
          totalItems={totalItems}
          selectedTypes={selectedTypesCount}
          totalTypes={totalTypes}
          totalPrice={totalPrice}
        />
      )}

      {/* 하단 버튼 */}
      <CartActions />
    </main>
  )
}

