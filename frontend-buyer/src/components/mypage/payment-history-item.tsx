"use client"

// API 연동 시 이 인터페이스를 API 응답 구조에 맞게 수정해야 함
interface PaymentHistoryItemProps {
  date: string
  storeName: string
  items: string
  amount: number
  status: string
  // API 연동 시 추가 필요한 필드:
  // paymentId?: string; // 결제 ID
  // paymentMethod?: string; // 결제 수단
  // receiptUrl?: string; // 영수증 URL
  // refundable?: boolean; // 환불 가능 여부
}

/**
 * 결제 내역 아이템 컴포넌트
 *
 * @param date - 결제 일시
 * @param storeName - 매장 이름
 * @param items - 주문 항목 요약
 * @param amount - 결제 금액
 * @param status - 결제 상태
 *
 * @remarks
 * API 연동 시 수정 사항:
 * 1. 더미 이미지를 실제 매장/상품 이미지로 ���체
 * 2. 결제 상태를 API에서 받아온 실제 상태로 표시
 * 3. 결제 상세 내역 페이지로 이동하는 기능 추가
 * 4. 결제 상태에 따른 조건부 UI 표시
 *
 * 기능적 측면:
 * - 결제 내역 클릭 시 상세 내역 표시 기능 추가 필요
 * - 영수증 다운로드 기능 추가 필요
 * - 환불 신청 버튼 추가 필요 (환불 가능한 경우)
 * - 결제 상태별 색상 코드 적용 (완료, 취소, 환불 등)
 */
export function PaymentHistoryItem({ date, storeName, items, amount, status }: PaymentHistoryItemProps) {
  // 결제 상태에 따른 스타일 변경 (API 연동 후 구현)
  // const statusColor = status === '결제완료' ? 'text-primary-custom' :
  //                     status === '환불' ? 'text-red-500' :
  //                     'text-gray-500';

  // 상세 내역 페이지로 이동 함수 (API 연동 후 구현)
  const handleItemClick = () => {
    // 결제 상세 내역 페이지로 이동
    // router.push(`/mypage/payment-detail/${paymentId}`);
  }

  return (
    <div className="p-4 border-b" onClick={handleItemClick}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">결제일시</div>
        <div className="text-gray-500 text-sm">{date}</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* 매장/상품 이미지 - API 연동 시 실제 이미지로 교체 필요 */}
          <div className="w-10 h-10 bg-orange-100 rounded-md mr-3"></div>
          <div>
            <div className="font-medium">{storeName}</div>
            <div className="text-sm text-gray-500">{items}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">{amount.toLocaleString()}원</div>
          <div className="text-xs text-primary-custom">{status}</div>
        </div>
      </div>
    </div>
  )
}

