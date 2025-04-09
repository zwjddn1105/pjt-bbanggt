import axios from "axios"
import type { ChatRequest, ChatRoomCreateRequest } from "../types/chat"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://43.203.248.254:8082"

// Create a function to get the token from localStorage safely (only on client)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// For testing purposes, you can set a dummy token
// This should be removed in production
if (typeof window !== "undefined") {
  // Check if token exists, if not set a dummy one for testing
  if (!localStorage.getItem("accessToken")) {
    // You can get a test token from your /api/v1/access-tokens endpoint
    localStorage.setItem("accessToken", "your-test-token-here")
  }
}

export const chatService = {
  // Get buyer's chat rooms
  getBuyerChatRooms: async (pageToken?: string) => {
    try {
      const response = await api.get("/api/v1/chat-rooms/buyer", {
        params: { pageToken },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching buyer chat rooms:", error)
      // Return empty data structure to prevent errors
      return { data: [], pageToken: null, hasNext: false }
    }
  },

  // Create a new chat room
  createChatRoom: async (data: ChatRoomCreateRequest) => {
    const response = await api.post("/api/v1/chat-rooms", data)
    return response.data
  },

  // Get chat messages for a specific room
  getChatMessages: async (chatRoomId: number, pageToken?: string) => {
    try {
      const response = await api.get("/api/v1/chats", {
        params: { chatRoomId, pageToken },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching chat messages:", error)
      // Return empty data structure to prevent errors
      return { data: [], pageToken: null, hasNext: false }
    }
  },

  // Send a chat message
  sendChatMessage: async (data: ChatRequest) => {
    const response = await api.post("/api/v1/chats", data)
    return response.data
  },
}

