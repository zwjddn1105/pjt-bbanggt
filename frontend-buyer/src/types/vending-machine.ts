export interface VendingMachine {
  id: string
  name: string
  address: string
  longitude: number
  latitude: number
  distance: number
  availableCount: number
  isBookmarked?: boolean
}

export interface VendingMachineResponse {
  id: string
  name: string
  address: string
  longitude: number
  latitude: number
  distance: number
  availableCount: number
  isBookmarked?: boolean
}

