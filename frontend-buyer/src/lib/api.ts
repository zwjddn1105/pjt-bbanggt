import { apiClient } from "@/config/api"
import type { AxiosRequestConfig } from "axios"

// 에러 타입
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

// 기존 함수들 유지\
export const fetchData = async <T>(url: string, config?: AxiosRequestConfig)
: Promise<T> =>
{
  try {
    const response = await apiClient.get<T>(url, config)
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "서버 오류가 발생했습니다.",
      errors: error.response?.data?.errors,
    }
    throw apiError
  }
}

export const postData = async <T>(url: string, data?: any, config?: AxiosRequestConfig)
: Promise<T> =>
{
  try {
    const response = await apiClient.post<T>(url, data, config)
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "서버 오류가 발생했습니다.",
      errors: error.response?.data?.errors,
    }
    throw apiError
  }
}

export const putData = async <T>(url: string, data?: any, config?: AxiosRequestConfig)
: Promise<T> =>
{
  try {
    const response = await apiClient.put<T>(url, data, config)
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "서버 오류가 발생했습니다.",
      errors: error.response?.data?.errors,
    }
    throw apiError
  }
}

// PATCH 함수 추가
export const patchData = async <T>(url: string, data?: any, config?: AxiosRequestConfig)
: Promise<T> =>
{
  try {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "서버 오류가 발생했습니다.",
      errors: error.response?.data?.errors,
    }
    throw apiError
  }
}

export const deleteData = async <T>(url: string, config?: AxiosRequestConfig)
: Promise<T> =>
{
  try {
    const response = await apiClient.delete<T>(url, config)
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "서버 오류가 발생했습니다.",
      errors: error.response?.data?.errors,
    }
    throw apiError
  }
}

// 파일 업로드 함수 추가
export const uploadFile = async <T>(url: string, formData: FormData, config?: AxiosRequestConfig)
: Promise<T> =>
{
  try {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "서버 오류가 발생했습니다.",
      errors: error.response?.data?.errors,
    }
    throw apiError
  }
}

// api 객체 추가 (서비스 파일들에서 사용)
export const api = {
  get: fetchData,
  post: postData,
  put: putData,
  patch: patchData, // patch 메서드 추가
  delete: deleteData,
  upload: uploadFile,
}

// 타입 정의 (기존 코드와의 호환성 유지)
export interface User {
  id: number
  name: string
  email: string
}

export interface UserCreateData {
  name: string
  email: string
  password?: string
}

