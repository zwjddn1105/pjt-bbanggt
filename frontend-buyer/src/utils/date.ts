export function formatDate(dateString: string): string {
    if (!dateString) return ""
  
    try {
      const date = new Date(dateString)
      const hours = date.getHours()
      const minutes = date.getMinutes()
  
      const period = hours >= 12 ? "오후" : "오전"
      const displayHours = hours % 12 || 12
  
      return `${period} ${displayHours}:${minutes < 10 ? "0" + minutes : minutes}`
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }
  
  export function formatTime(dateString: string): string {
    if (!dateString) return ""
  
    try {
      const date = new Date(dateString)
      const hours = date.getHours()
      const minutes = date.getMinutes()
  
      return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`
    } catch (error) {
      console.error("Error formatting time:", error)
      return dateString
    }
  }
  
  