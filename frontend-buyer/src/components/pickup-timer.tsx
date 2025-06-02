"use client"

import { useState, useEffect } from "react"

export default function PickupTimer() {
  const [remainingTime, setRemainingTime] = useState<string>("00:00:00")
  const [isAvailable, setIsAvailable] = useState<boolean>(false)

  useEffect(() => {
    // 타이머 업데이트 함수
    const updateTimer = () => {
      const now = new Date()

      // 한국 시간으로 변환 (실제 배포 시에는 서버 시간이나 사용자 로컬 시간 사용 가능)
      const koreaTime = new Date(now.getTime())

      // 오늘 오전 9시 30분 설정 (픽업 불가능 시작 시간)
      const todayPickupStartTime = new Date(koreaTime)
      todayPickupStartTime.setHours(9, 30, 0, 0)

      // 오늘 오후 8시 설정 (픽업 불가능 종료 시간)
      const todayPickupEndTime = new Date(koreaTime)
      todayPickupEndTime.setHours(20, 0, 0, 0)

      // 내일 오전 9시 30분 설정
      const tomorrowPickupStartTime = new Date(koreaTime)
      tomorrowPickupStartTime.setDate(koreaTime.getDate() + 1)
      tomorrowPickupStartTime.setHours(9, 30, 0, 0)

      let targetTime: Date
      let timeAvailable = false
      // 개발 중에는 항상 픽업 가능하도록 설정
      targetTime = todayPickupEndTime; // 타이머는 계속 보이도록
      timeAvailable = true; // 항상 픽업 가능 시간으로 설정
      // 현재 시간이 오전 9시 30분 ~ 오후 8시 사이인 경우 (픽업 불가능 시간)
      if (koreaTime >= todayPickupStartTime && koreaTime <= todayPickupEndTime) {
        targetTime = todayPickupEndTime // 픽업 불가능 종료 시간까지 남은 시간 계산
        timeAvailable = false // 픽업 불가능 시간
      }
      // 현재 시간이 오전 9시 30분 이전인 경우
      else if (koreaTime < todayPickupStartTime) {
        targetTime = todayPickupStartTime // 픽업 불가능 시작 시간까지 남은 시간 계산
        timeAvailable = true // 픽업 가능 시간
      }
      // 현재 시간이 오후 8시 이후인 경우
      else {
        targetTime = tomorrowPickupStartTime // 내일 픽업 불가능 시작 시간까지 남은 시간 계산
        timeAvailable = true // 픽업 가능 시간
      }

      // 남은 시간 계산
      let diff = targetTime.getTime() - koreaTime.getTime()

      // 시, 분, 초 계산
      const hours = Math.floor(diff / (1000 * 60 * 60))
      diff -= hours * (1000 * 60 * 60)

      const mins = Math.floor(diff / (1000 * 60))
      diff -= mins * (1000 * 60)

      const secs = Math.floor(diff / 1000)

      // 형식에 맞게 표시 (HH:MM:SS)
      setRemainingTime(
        `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
      )

      setIsAvailable(timeAvailable)
    }

    // 초기 실행
    updateTimer()

    // 1초마다 업데이트
    const timerId = setInterval(updateTimer, 1000)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timerId)
  }, [])

  return (
    <div className="bg-orange-100 p-3 rounded-md mb-4">
      <div className="font-bold text-lg text-orange-600">남은 시간: {remainingTime}</div>
      <p className="text-sm text-gray-600">
        {isAvailable
          ? "빵긋빵긋에서 픽업 가능합니다."
          : "픽업 불가능 시간입니다. 오후 8시 이후에 다시 시도해주세요."}
      </p>
    </div>
  )
}

