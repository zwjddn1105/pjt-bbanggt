import SidebarLayout from "@/components/sidebar-layout"

export default function SidebartestPage() {
  return (
    <SidebarLayout>
      <div className="p-4 pt-16">
        <h1 className="text-2xl font-bold mb-4">사이드바가 있는 페이지</h1>
        <p>왼쪽 상단의 메뉴 버튼을 클릭하여 사이드바를 열어보세요.</p>

        {/* 페이지 콘텐츠 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">페이지 콘텐츠</h2>
          <p className="text-gray-600">
            이 페이지는 사이드바 레이아웃을 사용하는 예시입니다. 사이드바는 기본적으로 숨겨져 있으며, 메뉴 버튼을
            클릭하면 나타납니다.
          </p>
        </div>
      </div>
    </SidebarLayout>
  )
}

