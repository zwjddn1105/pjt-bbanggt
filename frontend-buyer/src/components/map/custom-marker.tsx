"use client"

import { useEffect, useRef, useId } from "react"

interface CustomMarkerProps {
  map: any // 카카오맵 객체
  position: {
    lat: number
    lng: number
  }
  title: string
  isBookmarked?: boolean // 북마크된 빵집이 있는지 여부
  availableCount: number // 재고 수량
  onClick?: () => void
}

export default function CustomMarker({
  map,
  position,
  title,
  isBookmarked,
  availableCount,
  onClick,
}: CustomMarkerProps) {
  const overlayRef = useRef<any>(null)
  const uniqueId = useId() // 고유 ID 생성

  // 재고 수량에 따른 배경색 결정
  const getBubbleColor = (count: number): string => {
    if (count <= 0) return "#FF3B30" // 빨간색 (0개)
    if (count <= 5) return "#FFCC00" // 노란색 (1~5개)
    return "#34C759" // 녹색 (6개 이상)
  }

  useEffect(() => {
    if (!map) return

    // 기존 오버레이 제거
    if (overlayRef.current) {
      overlayRef.current.setMap(null)
    }

    // 마커 위치 설정
    const markerPosition = new window.kakao.maps.LatLng(position.lat, position.lng)

    // 배경색 결정
    const bubbleColor = getBubbleColor(availableCount)

    // 통합된 마커와 말풍선을 위한 컨테이너 생성
    const container = document.createElement("div")
    container.className = `custom-marker-container-${uniqueId}`
    container.style.position = "relative"
    container.style.display = "flex"
    container.style.flexDirection = "column"
    container.style.alignItems = "center"
    container.style.cursor = "pointer"

    // 말풍선 부분 생성
    const bubble = document.createElement("div")
    bubble.style.backgroundColor = bubbleColor
    bubble.style.color = "white"
    bubble.style.padding = "2px 8px"
    bubble.style.borderRadius = "12px"
    bubble.style.fontSize = "12px"
    bubble.style.fontWeight = "bold"
    bubble.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"
    bubble.style.minWidth = "20px"
    bubble.style.textAlign = "center"
    bubble.style.marginBottom = "2px"
    bubble.innerText = `${availableCount}`

    // 말풍선 꼬리 부분 생성
    const tail = document.createElement("div")
    tail.style.width = "0"
    tail.style.height = "0"
    tail.style.borderLeft = "6px solid transparent"
    tail.style.borderRight = "6px solid transparent"
    tail.style.borderTop = `6px solid ${bubbleColor}`
    tail.style.marginBottom = "2px"

    // 마커 이미지 부분 생성
    const markerImg = document.createElement("img")
    markerImg.src = "/bread-pattern.png"
    markerImg.style.width = "36px"
    markerImg.style.height = "36px"
    markerImg.style.borderRadius = "50%"
    markerImg.alt = title

    // 컨테이너에 요소들 추가
    container.appendChild(bubble)
    container.appendChild(tail)
    container.appendChild(markerImg)

    // 클릭 이벤트 추가
    container.addEventListener("click", () => {
      if (onClick) onClick()
    })

    // 커스텀 오버레이 생성
    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: markerPosition,
      content: container,
      yAnchor: 1.0,
      zIndex: 1,
    })

    // 지도에 오버레이 표시
    customOverlay.setMap(map)

    overlayRef.current = customOverlay

    // 컴포넌트 언마운트 시 오버레이 제거
    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null)
      }
    }
  }, [map, position, title, isBookmarked, availableCount, onClick, uniqueId])

  return null // 이 컴포넌트는 UI를 렌더링하지 않음
}

