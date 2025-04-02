"use client"

import { useEffect, useRef } from "react"

interface CustomMarkerProps {
  map: any // 카카오맵 객체
  position: {
    lat: number
    lng: number
  }
  title: string
  isBookmarked?: boolean // 북마크된 빵집이 있는지 여부
  onClick?: () => void
}

export default function CustomMarker({ map, position, title, isBookmarked, onClick }: CustomMarkerProps) {
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!map) return

    // 마커 위치 설정
    const markerPosition = new window.kakao.maps.LatLng(position.lat, position.lng)

    // 커스텀 마커 이미지 생성
    const createMarkerImage = () => {
      // 마커 색상 설정 (북마크 여부에 따라)
      const bgColor = isBookmarked ? "#FF9500" : "#FFFFFF"

      // SVG 마커 생성
      const svgMarker = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="${bgColor}" />
          <circle cx="20" cy="20" r="18" fill="${bgColor}" stroke="#FF6B00" strokeWidth="2" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#FF6B00">빵</text>
        </svg>
      `

      const markerSize = new window.kakao.maps.Size(40, 40)
      const markerOption = { offset: new window.kakao.maps.Point(20, 20) }

      // SVG를 Base64로 인코딩
      const encodedSvg = btoa(unescape(encodeURIComponent(svgMarker)))
      const dataUrl = `data:image/svg+xml;base64,${encodedSvg}`

      return new window.kakao.maps.MarkerImage(dataUrl, markerSize, markerOption)
    }

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: createMarkerImage(),
      map: map,
      title: title,
    })

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, "click", () => {
      if (onClick) onClick()
    })

    markerRef.current = marker

    // 컴포넌트 언마운트 시 마커 제거
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [map, position, title, isBookmarked, onClick])

  return null // 이 컴포넌트는 UI를 렌더링하지 않음
}

