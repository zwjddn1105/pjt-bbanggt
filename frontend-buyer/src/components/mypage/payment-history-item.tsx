interface PaymentHistoryItemProps {
    date: string
    storeName: string
    items: string
    amount: number
    status: string
  }
  
  export function PaymentHistoryItem({ date, storeName, items, amount, status }: PaymentHistoryItemProps) {
    return (
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium">결제일시</div>
          <div className="text-gray-500 text-sm">{date}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
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
  
  