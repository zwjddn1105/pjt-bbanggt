"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  User,
  Calendar,
  ChevronDown,
} from "lucide-react";

// 더미 데이터 - API 연동 전 사용
const inquiryData = [
  {
    id: 1,
    customer: "고수정",
    content: "오늘 몇 번째 나왔죠?",
    date: "2023-11-15 14:30",
  },
  {
    id: 2,
    customer: "우성훈",
    content: "가격 더 내려주시면 안될까요...",
    date: "2023-11-15 13:22",
  },
  { id: 3, customer: "배준", content: "서울에", date: "2023-11-15 11:45" },
  { id: 4, customer: "곤두우두", content: "5", date: "2023-11-14 18:30" },
  {
    id: 5,
    customer: "고수",
    content: "너무 맛있어요!!",
    date: "2023-11-14 16:15",
  },
  {
    id: 6,
    customer: "정하니",
    content: "빵에서 머리카락 나왔어요",
    date: "2023-11-14 15:40",
  },
  {
    id: 7,
    customer: "김민지",
    content: "재입고 언제 되나요?",
    date: "2023-11-14 14:20",
  },
  {
    id: 8,
    customer: "이준호",
    content: "결제 오류가 발생했어요",
    date: "2023-11-14 12:10",
  },
  {
    id: 9,
    customer: "박서연",
    content: "배송이 늦어지고 있어요",
    date: "2023-11-13 17:45",
  },
  {
    id: 10,
    customer: "최지우",
    content: "교환 가능한가요?",
    date: "2023-11-13 16:30",
  },
];

export default function InquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(inquiryData.length / itemsPerPage);

  // 현재 페이지에 표시할 데이터
  const currentItems = inquiryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const pages = [];

    // 처음 페이지로 이동
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
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
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );

    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
      // 현재 페이지 주변 2개와 첫/마지막 페이지 표시
      if (
        i === 1 ||
        i === totalPages ||
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
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
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
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );

    // 마지막 페이지로 이동
    pages.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
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

          <div className="relative">
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-orange-300 transition-colors">
              <span className="text-sm text-gray-700 mr-2">
                상태: {selectedStatus}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="col-span-2">문의 고객</div>
            <div className="col-span-7">내용</div>
            <div className="col-span-3 text-center">일시</div>
          </div>

          {currentItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 px-6 py-4 items-center hover:bg-orange-50 transition-colors"
            >
              <div className="col-span-2 flex items-center">
                <User className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {item.customer}
                </span>
              </div>
              <div className="col-span-7">
                <p className="text-gray-700 truncate">{item.content}</p>
              </div>
              <div className="col-span-3 flex items-center justify-end space-x-3">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {item.date}
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1.5 rounded-full transition-colors flex items-center">
                  자세히
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          ))}

          {currentItems.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              문의 내역이 없습니다.
            </div>
          )}
        </div>

        <div className="p-4 flex justify-center">
          <div className="flex space-x-1">{renderPagination()}</div>
        </div>
      </div>
    </div>
  );
}
