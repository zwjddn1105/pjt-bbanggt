import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 리프레시 토큰 추출
    const { refreshToken } = await request.json()

    // 디버깅: 요청 정보 로깅
    console.log("🚀 토큰 갱신 API 요청:", {
      refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : "없음",
    })

    if (!refreshToken) {
      console.error("❌ 리프레시 토큰이 없습니다.")
      return NextResponse.json({ message: "리프레시 토큰이 없습니다." }, { status: 401 })
    }

    // 백엔드 API URL - 수정된 경로 사용
    const backendApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reissue`

    // 디버깅을 위해 전체 URL 로깅 추가
    console.log("🔗 백엔드 토큰 갱신 API URL:", backendApiUrl)

    try {
      // 백엔드 API 호출
      const response = await axios.post(
        backendApiUrl,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      // 디버깅: 백엔드 응답 상태 로깅
      console.log("🔍 백엔드 토큰 갱신 응답 상태:", response.status)
      console.log("🔍 백엔드 토큰 갱신 응답 데이터:", response.data)

      // 응답 데이터에서 새 토큰 가져오기
      const { accessToken, refreshToken: newRefreshToken } = response.data

      // 응답 반환
      return NextResponse.json({
        message: "토큰 갱신 성공",
        accessToken,
        refreshToken: newRefreshToken,
      })
    } catch (backendError: any) {
      // 백엔드 API 호출 자체가 실패한 경우
      console.error("❌ 백엔드 토큰 갱신 API 호출 오류:", backendError)

      // 오류 세부 정보 출력
      if (axios.isAxiosError(backendError)) {
        console.error("API 오류 상세:", {
          status: backendError.response?.status,
          data: backendError.response?.data,
          message: backendError.message,
        })
      }

      return NextResponse.json(
        {
          message: "토큰 갱신에 실패했습니다.",
          error: backendError.response?.data?.message || backendError.message,
        },
        { status: backendError.response?.status || 500 },
      )
    }
  } catch (error) {
    // 디버깅: 오류 로깅
    console.error("❌ 토큰 갱신 처리 오류:", error)
    return NextResponse.json(
      {
        message: "토큰 갱신 처리 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

