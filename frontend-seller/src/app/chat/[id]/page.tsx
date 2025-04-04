"use client";

import { useEffect, useState, useRef, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchChatMessages, sendChatMessage } from "../../../api/chat-messages";
import { useChatStore } from "../../../store/chat-store";
import type { ChatMessage } from "../../../types/chat-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useLoading } from "@/components/loading-provider";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const chatRoomId = Number(params.id);
  const { setLoading } = useLoading();

  // 채팅방 정보
  const { chatRooms } = useChatStore();
  const chatRoom = chatRooms.find((room) => room.chatRoomId === chatRoomId);

  // 상태 관리
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 스크롤 관련 ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 쿠키에서 userId 가져오는 useEffect 추가 (초기 메시지 로드 useEffect 위에 추가)
  // 스크롤 관련 ref 아래에 추가
  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const userIdFromCookie = getCookie("userId");
    if (userIdFromCookie) {
      setCurrentUserId(Number(userIdFromCookie));
    }
  }, []);

  // 초기 메시지 로드
  useEffect(() => {
    if (!chatRoomId) return;

    const loadInitialMessages = async () => {
      try {
        setLoading(true);
        const response = await fetchChatMessages(chatRoomId);
        setMessages(response.data.reverse()); // 최신 메시지가 아래에 오도록 역순 정렬
        setPageToken(response.pageToken);
        setHasMore(response.hasNext);
        setError(null);
      } catch (error) {
        console.error("메시지 로드 중 오류 발생:", error);
        setError("메시지를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialMessages();

    // 폴링 설정 (30초마다 새 메시지 확인)
    pollingIntervalRef.current = setInterval(() => {
      loadNewMessages();
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [chatRoomId, setLoading]);

  // 새 메시지 로드 (폴링)
  const loadNewMessages = async () => {
    if (!chatRoomId) return;

    try {
      const response = await fetchChatMessages(chatRoomId);

      // 새 메시지가 있는지 확인 (가장 최근 메시지 ID와 비교)
      if (
        messages.length === 0 ||
        response.data.some((msg) => !messages.find((m) => m.id === msg.id))
      ) {
        setMessages(response.data.reverse());
        setPageToken(response.pageToken);
        setHasMore(response.hasNext);

        // 새 메시지가 있으면 스크롤을 아래로 이동
        scrollToBottom();
      }
    } catch (error) {
      console.error("새 메시지 로드 중 오류 발생:", error);
    }
  };

  // 이전 메시지 로드 (무한 스크롤)
  const loadMoreMessages = async () => {
    if (!hasMore || isLoadingMore || !pageToken || !chatRoomId) return;

    try {
      setIsLoadingMore(true);
      const response = await fetchChatMessages(chatRoomId, pageToken);

      // 스크롤 위치 유지를 위한 현재 스크롤 높이 저장
      const container = messagesContainerRef.current;
      const scrollHeight = container?.scrollHeight || 0;

      // 새 메시지를 기존 메시지 앞에 추가 (역순)
      setMessages((prev) => [...response.data.reverse(), ...prev]);
      setPageToken(response.pageToken);
      setHasMore(response.hasNext);

      // 스크롤 위치 유지
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - scrollHeight;
      }
    } catch (error) {
      console.error("이전 메시지 로드 중 오류 발생:", error);
      setError("이전 메시지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 스크롤 이벤트 처리 (무한 스크롤)
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // 스크롤이 상단에 가까워지면 이전 메시지 로드
    if (container.scrollTop < 100 && hasMore && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  // 메시지 전송
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending || !chatRoomId) return;

    try {
      setIsSending(true);

      await sendChatMessage({
        content: newMessage,
        chatRoomId: chatRoomId,
      });

      // 메시지 전송 후 즉시 새 메시지 로드
      await loadNewMessages();

      // 입력 필드 초기화
      setNewMessage("");

      // 입력 필드에 포커스
      inputRef.current?.focus();
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
      setError("메시지를 전송하는 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 새 메시지가 추가되면 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messages.length > 0 && !isLoadingMore) {
      scrollToBottom();
    }
  }, [messages, isLoadingMore]);

  // 뒤로 가기
  const handleBack = () => {
    router.push("/inquiries");
  };

  // 메시지 날짜 포맷팅
  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // 메시지 날짜 그룹화 (날짜 구분선 표시용)
  const formatDateForDivider = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  // 메시지 발신자 확인 함수 (수정된 부분)
  const isCurrentUserMessage = (message: ChatMessage): boolean => {
    // 쿠키에서 가져온 userId와 메시지의 senderId 비교
    if (currentUserId !== null && message.senderId === currentUserId) {
      return true;
    }

    // 백업 로직: 테스트 메시지 확인 (개발 중에만 사용)
    if (message.content.includes("테스트메세지_김정우")) {
      return true;
    }

    // 백업 로직: senderId가 0인 경우 (기존 로직)
    return message.senderId === 0;
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-3xl">
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-md overflow-hidden">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2 text-orange-500 hover:bg-orange-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {chatRoom?.customerName || "고객"}
            </h2>
            <p className="text-xs text-gray-500">
              {chatRoom?.isOwner ? "답변 완료" : "답변 대기 중"}
            </p>
          </div>
        </div>

        {/* 메시지 컨테이너 */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
          onScroll={handleScroll}
        >
          {/* 로딩 인디케이터 (이전 메시지) */}
          {isLoadingMore && (
            <div className="flex justify-center py-2">
              <div className="bg-white rounded-full p-2 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-center shadow-sm border border-red-100">
              {error}
              <Button
                variant="link"
                className="text-red-600 p-0 h-auto ml-2 font-medium"
                onClick={() => loadNewMessages()}
              >
                다시 시도
              </Button>
            </div>
          )}

          {/* 메시지 목록 */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-600">아직 메시지가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-1">
                  첫 메시지를 보내보세요!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                // 수정된 부분: 현재 사용자 메시지 여부 확인
                const isCurrentUser = isCurrentUserMessage(message);
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showDateDivider =
                  !prevMessage ||
                  formatDateForDivider(message.createdAt) !==
                    formatDateForDivider(prevMessage.createdAt);

                // 연속된 메시지인지 확인 (같은 사용자의 연속 메시지)
                const isContinuous =
                  prevMessage &&
                  isCurrentUserMessage(prevMessage) === isCurrentUser &&
                  formatDateForDivider(message.createdAt) ===
                    formatDateForDivider(prevMessage.createdAt);

                return (
                  <div key={message.id}>
                    {/* 날짜 구분선 */}
                    {showDateDivider && (
                      <div className="flex justify-center my-4">
                        <div className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full">
                          {formatDateForDivider(message.createdAt)}
                        </div>
                      </div>
                    )}

                    {/* 메시지 */}
                    <div
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      } 
                      ${isContinuous ? "mt-1" : "mt-4"}`}
                    >
                      <div className="flex flex-col max-w-[75%]">
                        {/* 상대방 이름 (연속 메시지가 아닐 때만 표시) */}
                        {!isCurrentUser && !isContinuous && (
                          <span className="text-xs text-gray-500 ml-1 mb-1">
                            {chatRoom?.customerName || "고객"}
                          </span>
                        )}

                        {/* 메시지 말풍선 */}
                        <div
                          className={`px-4 py-2 rounded-lg shadow-sm 
                          ${
                            isCurrentUser
                              ? "bg-orange-500 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
                          }`}
                        >
                          {message.content}
                        </div>

                        {/* 시간 */}
                        <div
                          className={`text-xs text-gray-500 mt-1 ${
                            isCurrentUser ? "text-right mr-1" : "text-left ml-1"
                          }`}
                        >
                          {formatMessageDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 스크롤 위치 참조 */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 메시지 입력 영역 */}
        <div className="bg-white border-t border-gray-100 p-3">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <Input
              ref={inputRef}
              placeholder="메시지를 입력하세요..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending}
              className="flex-1 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              전송
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
