import axios from "axios";
import type {
  ChatMessagesResponse,
  SendMessageRequest,
} from "../types/chat-message";

// 쿠키에서 auth_token 가져오는 함수
const getAuthToken = (): string | null => {
  if (typeof document === "undefined") return null; // 서버 사이드에서는 실행하지 않음

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }
  return null;
};

// 채팅 메시지 목록 가져오기 함수
export const fetchChatMessages = async (
  chatRoomId: number,
  pageToken?: string
): Promise<ChatMessagesResponse> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const response = await axios.get<ChatMessagesResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/chats`,
      {
        params: {
          chatRoomId,
          pageToken,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // console.error("채팅 메시지를 가져오는 중 오류가 발생했습니다:", error);
    throw error;
  }
};

// 채팅 메시지 전송 함수
export const sendChatMessage = async (
  message: SendMessageRequest
): Promise<void> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/chats`,
      message,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  } catch (error) {
    // console.error("채팅 메시지를 전송하는 중 오류가 발생했습니다:", error);
    throw error;
  }
};
