"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  User,
  Calendar,
  ChevronDown,
  AlertCircle,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { useChatStore } from "../../store/chat-store";
import type { ChatFilter } from "../../types/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function InquiriesPage() {
  const {
    isLoading,
    error,
    loadChatRooms,
    filterStatus,
    setFilterStatus,
    loadNextPage,
    loadSpecificPage,
    currentResponse,
    getFilteredChatRooms,
    currentPage: storeCurrentPage,
  } = useChatStore();

  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  // 컴포넌트 마운트 시 채팅방 목록 로드
  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // 스토어의 현재 페이지가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setCurrentPage(storeCurrentPage);
  }, [storeCurrentPage]);

  // 필터링된 채팅방 목록
  const filteredChatRooms = getFilteredChatRooms() || [];

  // 현재 페이지에 표시할 데이터 - 서버 페이징을 사용하므로 클라이언트 페이징은 필요 없음
  const currentItems = filteredChatRooms;

  // 총 페이지 수 계산
  const totalPages = currentResponse?.totalPages || 1;

  // 페이지 변경 함수 - 수정된 부분
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    if (
      page > currentPage &&
      page === currentPage + 1 &&
      currentResponse &&
      !currentResponse.last
    ) {
      // 다음 페이지로만 이동하는 경우
      loadNextPage();
    } else {
      // 특정 페이지로 직접 이동하는 경우 (예: 1페이지 → 3페이지)
      loadSpecificPage(page);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } catch {
      return dateString;
    }
  };

  // 채팅방 클릭 핸들러 - 채팅방 상세 페이지로 이동
  const handleChatRoomClick = (chatRoomId: number) => {
    router.push(`/chat/${chatRoomId}`);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filter: ChatFilter) => {
    setFilterStatus(filter);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
    loadSpecificPage(0); // 첫 페이지 데이터 로드
  };

  // 마지막 페이지 여부 확인
  const isLastPage = (): boolean => {
    if (!currentResponse) return true;
    return currentResponse.last === true;
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const pages = [];

    // 처음 페이지로 이동
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(0)}
        disabled={currentPage === 0}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
        <ChevronLeft className="w-4 h-4 -ml-2" />
      </button>
    );

    // 이전 페이지로 이동
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );

    // 페이지 번호 (0부터 시작하는 페이지 번호를 1부터 시작하는 것처럼 표시)
    for (let i = 0; i < totalPages; i++) {
      // 현재 페이지 주변 2개와 첫/마지막 페이지 표시
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              currentPage === i
                ? "bg-orange-500 text-white"
                : "hover:bg-orange-100 text-gray-700"
            }`}
          >
            {i + 1} {/* 화면에는 1부터 시작하는 페이지 번호로 표시 */}
          </button>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 2) ||
        (i === currentPage + 2 && currentPage < totalPages - 3)
      ) {
        // 생략 부호 표시
        pages.push(
          <span
            key={i}
            className="w-8 h-8 flex items-center justify-center text-gray-500"
          >
            ...
          </span>
        );
      }
    }

    // 다음 페이지로 이동
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1 || isLastPage()}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );

    // 마지막 페이지로 이동
    pages.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1 || isLastPage()}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 -ml-2" />
      </button>
    );

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 text-orange-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">고객문의</h2>
          </div>

          {/* 필터 드롭다운 메뉴 */}
          <div className="relative" style={{ height: "40px", width: "120px" }}>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-10 w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-orange-300 transition-colors">
                <span className="text-sm text-gray-700">
                  상태: {filterStatus}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={5}
                className="w-[120px]"
                align="end"
                forceMount
              >
                <DropdownMenuItem onClick={() => handleFilterChange("전체")}>
                  전체
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("답장함")}>
                  답장함
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("답장 안함")}
                >
                  답장 안함
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="col-span-2">문의 고객</div>
            <div className="col-span-7">내용</div>
            <div className="col-span-3 text-center">일시</div>
          </div>

          {isLoading && filteredChatRooms.length === 0 ? (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
              <p>문의 내역을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 flex flex-col items-center justify-center">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p>{error}</p>
              <button
                onClick={() => loadChatRooms()}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              문의 내역이 없습니다.
            </div>
          ) : (
            currentItems.map((item) => (
              <div
                key={item.chatRoomId}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-orange-50 transition-colors cursor-pointer"
                onClick={() => handleChatRoomClick(item.chatRoomId)}
              >
                <div className="col-span-2 flex items-center">
                  <User className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">
                    {item.customerName}
                  </span>
                </div>
                <div className="col-span-7 flex items-center">
                  <p className="text-gray-700 truncate mr-2">
                    {item.lastContent || "(내용 없음)"}
                  </p>
                  {/* 답장 상태 표시 */}
                  {item.isOwner ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      답장함
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      <X className="w-3 h-3 mr-1" />
                      답장 필요
                    </span>
                  )}
                </div>
                <div className="col-span-3 flex items-center justify-end">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!isLoading &&
          !error &&
          filteredChatRooms.length > 0 &&
          currentResponse && (
            <div className="p-4 flex justify-center">
              <div className="flex space-x-1">{renderPagination()}</div>
            </div>
          )}
      </div>
    </div>
  );
}
