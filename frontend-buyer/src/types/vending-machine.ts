export interface VendingMachine {
  id: string
  name: string
  address: string
  longitude: number
  latitude: number
  distance: number
  remainSpaceCount: number
  availableCount: number
  isBookmarked?: boolean
}

