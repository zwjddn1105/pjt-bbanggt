export default function OrderSkeleton() {
    return (
      <div>
        {/* 탭 네비게이션 스켈레톤 */}
        <div className="flex border-b">
          <div className="flex-1 py-3 text-center">
            <div className="h-5 bg-gray-200 rounded w-20 mx-auto"></div>
          </div>
          <div className="flex-1 py-3 text-center">
            <div className="h-5 bg-gray-200 rounded w-20 mx-auto"></div>
          </div>
          <div className="p-3 flex justify-center">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
  
        {/* 주문 가능 시간 안내 스켈레톤 */}
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
  
        {/* 상품 목록 스켈레톤 */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="mx-4 mb-4 p-4 border rounded-3xl">
            <div className="flex">
              {/* 이미지 그리드 스켈레톤 */}
              <div className="flex-shrink-0 mr-4">
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((img) => (
                    <div key={img} className="w-10 h-10 bg-gray-200"></div>
                  ))}
                </div>
              </div>
  
              {/* 텍스트 정보 스켈레톤 */}
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
                  ))}
                </div>
              </div>
  
              {/* 버튼 스켈레톤 */}
              <div className="ml-auto">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  