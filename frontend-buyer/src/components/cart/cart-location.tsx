import { MapPin } from "lucide-react"

interface CartLocationProps {
  storeName: string
}

export default function CartLocation({ storeName }: CartLocationProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-2">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <span className="font-medium">{storeName}</span>
      </div>
      <button className="ml-auto text-sm text-gray-500">매장 변경</button>
    </div>
  )
}

