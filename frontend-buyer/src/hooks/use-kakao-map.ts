"use client"

import { useEffect, useState, useRef } from "react"

interface UseKakaoMapProps {
  container: HTMLElement | null
  options?: {
    center?: {
      lat: number
      lng: number
    }
    level?: number
  }
}

interface UseKakaoMapReturn {
  map: any
  loading: boolean
  error: Error | null
}

export default function useKakaoMap({ container, options = {} }: UseKakaoMapProps): UseKakaoMapReturn {
  const [map, setMap] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // 컨테이너가 없거나 이미 초기화된 경우 리턴
    if (!container || initialized.current) return

    // 카카오맵이 로드되었는지 확인
    if (!window.kakao?.maps) {
      setError(new Error("Kakao Maps SDK가 로드되지 않았습니다."))
      setLoading(false)
      return
    }

    try {
      // 지도 옵션 설정
      const mapOptions = {
        center: new window.kakao.maps.LatLng(
          options.center?.lat || 37.5665, // 기본값: 서울 중심 좌표
          options.center?.lng || 126.978,
        ),
        level: options.level || 3, // 기본 확대 레벨
      }

      // 지도 생성
      const kakaoMap = new window.kakao.maps.Map(container, mapOptions)
      setMap(kakaoMap)
      initialized.current = true
    } catch (err) {
      setError(err instanceof Error ? err : new Error("지도 초기화 중 오류가 발생했습니다."))
    } finally {
      setLoading(false)
    }
  }, [container, options])

  return { map, loading, error }
}

