import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          [로그인화면]여기 카카오페이지로 만들거임ㅋㅋ
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          빵긋 판매자 포털에서 상품을 관리하고, 주문을 확인하고, 고객 문의에
          응답하세요.
        </p>
        <div className="relative w-full max-w-3xl h-64 md:h-80 mb-8">
          <Image
            src="/logo.png"
            alt="빵긋 판매자 대시보드"
            fill
            className="object-cover rounded-lg shadow-lg"
            priority
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-3">상품 관리</h2>
            <p className="text-muted-foreground">
              상품을 추가하고, 재고를 관리하고, 가격을 업데이트하세요.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-3">주문 처리</h2>
            <p className="text-muted-foreground">
              들어오는 주문을 확인하고, 상태를 업데이트하고, 배송을 관리하세요.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-3">고객 문의</h2>
            <p className="text-muted-foreground">
              고객 문의에 응답하고, 리뷰를 관리하고, 피드백을 수집하세요.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
