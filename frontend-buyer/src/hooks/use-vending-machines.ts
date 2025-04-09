"use client"

import { useState, useCallback } from "react"
import { VendingMachineService } from "../services"
import type { VendingMachineResponse } from "../types/api-types"

export const useVendingMachines = () => {
  const [vendingMachines, setVendingMachines] = useState<VendingMachineResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 위치 기반 자판기 조회
  const findNearbyVendingMachines = useCallback(async (latitude: number, longitude: number, distance: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const machines = await VendingMachineService.findAll(latitude, longitude, distance)
      setVendingMachines(machines)

      return machines
    } catch (err: any) {
      setError(err.message || "자판기 조회 중 오류가 발생했습니다.")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    vendingMachines,
    isLoading,
    error,
    findNearbyVendingMachines,
  }
}

