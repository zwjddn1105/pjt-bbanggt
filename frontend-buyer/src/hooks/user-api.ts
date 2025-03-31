"use client"

import { useState, useCallback } from "react"
import { fetchData, postData, putData, deleteData } from "@/lib/api"

// 제네릭 타입을 사용한 API 훅
export function useApi<T, P = any>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // GET 요청
  const get = useCallback(async (url: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchData<T>(url)
      setData(result)
      return result
    } catch (err: any) {
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // POST 요청
  const post = useCallback(async (url: string, payload: P) => {
    try {
      setLoading(true)
      setError(null)
      const result = await postData<T>(url, payload)
      setData(result)
      return result
    } catch (err: any) {
      setError(err.message || "데이터를 생성하는 중 오류가 발생했습니다.")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // PUT 요청
  const put = useCallback(async (url: string, payload: P) => {
    try {
      setLoading(true)
      setError(null)
      const result = await putData<T>(url, payload)
      setData(result)
      return result
    } catch (err: any) {
      setError(err.message || "데이터를 수정하는 중 오류가 발생했습니다.")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // DELETE 요청
  const remove = useCallback(async (url: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await deleteData<T>(url)
      setData(null)
      return result
    } catch (err: any) {
      setError(err.message || "데이터를 삭제하는 중 오류가 발생했습니다.")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, get, post, put, remove }
}

