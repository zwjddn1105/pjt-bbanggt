"use client"

import { useState, useEffect } from "react"
import { fetchVendingMachines, fetchBookmarkedVendingMachines } from "./breadgut-api"
import type { VendingMachine } from "@/types/vending-machine"

interface UseVendingMachinesProps {
  latitude?: number
  longitude?: number
  distance?: number
  bookmarkedOnly?: boolean
}

export function useVendingMachines({
  latitude,
  longitude,
  distance = 5,
  bookmarkedOnly = false,
}: UseVendingMachinesProps) {
  const [vendingMachines, setVendingMachines] = useState<VendingMachine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!latitude || !longitude) return

      setLoading(true)
      try {
        let data
        if (bookmarkedOnly) {
          // 북마크된 빵집의 빵이 담긴 자판기 조회 (수정된 부분)
          data = await fetchBookmarkedVendingMachines(latitude, longitude, distance)
        } else {
          // 모든 자판기 조회
          data = await fetchVendingMachines(latitude, longitude, distance)
        }
        setVendingMachines(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("빵긋 데이터를 가져오는데 실패했습니다."))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [latitude, longitude, distance, bookmarkedOnly])

  return { vendingMachines, loading, error }
}

