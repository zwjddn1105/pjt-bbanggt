/**
 * API 타입 정의 파일
 * 백엔드 API와 통신할 때 사용되는 모든 타입을 정의합니다.
 */

// ===== 공통 타입 =====

/**
 * 빵 종류 타입
 * 자판기에서 판매되는 빵의 종류를 정의합니다.
 */
export type BreadType =
  | "SOBORO" // 소보로빵
  | "SWEET_RED_BEAN" // 단팥빵
  | "WHITE_BREAD" // 식빵
  | "BAGUETTE" // 바게트
  | "CROISSANT" // 크루아상
  | "DONUT" // 도넛
  | "CREAM_BREAD" // 크림빵
  | "GARLIC_BREAD" // 마늘빵
  | "OTHER" // 기타
  | "MIXED_BREAD" // 모듬빵

/**
 * 상품 상태 타입
 * 자판기 내 상품의 현재 상태를 정의합니다.
 */
export type ProductState =
  | "AVAILABLE" // 구매 가능
  | "RESERVED" // 예약됨
  | "SOLD_OUT" // 품절
  | "EXPIRED" // 유통기한 만료

// ===== 인증 관련 타입 =====

/**
 * 로그인 요청 인터페이스
 * 카카오 로그인 시 사용되는 인증 코드를 포함합니다.
 */
export interface LoginRequest {
  code: string // 카카오 인증 코드
}

/**
 * 액세스 토큰 응답 인터페이스
 * 로그인 성공 시 반환되는 액세스 토큰을 포함합니다.
 */
export interface AccessTokenResponse {
  accessToken: string // JWT 액세스 토큰
}

/**
 * 사용자 토큰 인터페이스
 * 사용자 인증에 필요한 액세스 토큰과 리프레시 토큰을 포함합니다.
 */
export interface UserTokens {
  accessToken: string // JWT 액세스 토큰
  refreshToken: string // JWT 리프레시 토큰
}

// ===== 자판기 관련 타입 =====

/**
 * 자판기 응답 인터페이스
 * 위치 기반 자판기 조회 시 반환되는 자판기 정보를 포함합니다.
 */
export interface VendingMachineResponse {
  id: string // 자판기 ID
  name: string // 자판기 이름
  address: string // 주소
  remainSpaceCount: number // 남은 공간 수
  availableCount: number // 이용 가능한 수량
  longitude: number // 경도
  latitude: number // 위도
  distance: number // 현재 위치로부터의 거리(km)
  isBookmarked?: boolean // 북마크 여부
}

/**
 * 자판기 생성 요청 인터페이스
 * 새로운 자판기 생성 시 필요한 정보를 포함합니다.
 */
export interface VendingMachineCreateJsonRequest {
  latitude: number // 위도
  longitude: number // 경도
  address: string // 주소
  row: number // 행 수
  column: number // 열 수
  name: string // 자판기 이름
}

// ===== 빵집 관련 타입 =====

/**
 * 빵집 요청 인터페이스
 * 빵집 생성 및 수정 시 필요한 정보를 포함합니다.
 */
export interface BakeryRequest {
  name: string // 빵집 이름
  businessNumber: string // 사업자 등록번호
  homepageUrl?: string // 홈페이지 URL(선택)
  address: string // 주소
  phone: string // 전화번호
}

/**
 * 빵집 응답 인터페이스
 * 빵집 조회 시 반환되는 빵집 정보를 포함합니다.
 */
export interface BakeryResponse {
  id: number // 빵집 ID
  name: string // 빵집 이름
  homepageUrl?: string // 홈페이지 URL(선택)
  address: string // 주소
  phone: string // 전화번호
}

// ===== 리뷰 관련 타입 =====

/**
 * 점수 인터페이스
 * 리뷰 점수를 포함합니다.
 */
export interface Score {
  score: number // 리뷰 점수(1-5)
}

/**
 * 리뷰 요청 인터페이스
 * 리뷰 생성 시 필요한 정보를 포함합니다.
 */
export interface ReviewRequest {
  content: string // 리뷰 내용
  score: Score // 리뷰 점수
  imageUrls?: string[] // 이미지 URL 목록(선택)
}

/**
 * 리뷰 응답 인터페이스
 * 리뷰 조회 시 반환되는 리뷰 정보를 포함합니다.
 */
export interface ReviewResponse {
  id: number // 리뷰 ID
  name: string // 작성자 이름
  content: string // 리뷰 내용
  score: number // 리뷰 점수
  imageUrls?: string[] // 이미지 URL 목록(선택)
}

/**
 * 페이지 객체 인터페이스
 * 페이지네이션 정보를 포함합니다.
 */
export interface PageableObject {
  offset: number // 오프셋
  sort: SortObject // 정렬 정보
  pageSize: number // 페이지 크기
  paged: boolean // 페이지 여부
  pageNumber: number // 페이지 번호
  unpaged: boolean // 페이지 아님 여부
}

/**
 * 정렬 객체 인터페이스
 * 정렬 정보를 포함합니다.
 */
export interface SortObject {
  empty: boolean // 비어있음 여부
  sorted: boolean // 정렬됨 여부
  unsorted: boolean // 정렬되지 않음 여부
}

/**
 * 페이지 요청 인터페이스
 * 페이지네이션 요청 시 필요한 정보를 포함합니다.
 */
export interface Pageable {
  page: number // 페이지 번호
  size: number // 페이지 크기
  sort?: string[] // 정렬 기준(선택)
}

/**
 * 페이지 리뷰 응답 인터페이스
 * 페이지네이션된 리뷰 목록 조회 시 반환되는 정보를 포함합니다.
 */
export interface PageReviewResponse {
  totalElements: number // 전체 요소 수
  totalPages: number // 전체 페이지 수
  size: number // 페이지 크기
  content: ReviewResponse[] // 리뷰 목록
  number: number // 현재 페이지 번호
  sort: SortObject // 정렬 정보
  numberOfElements: number // 현재 페이지 요소 수
  pageable: PageableObject // 페이지 정보
  first: boolean // 첫 페이지 여부
  last: boolean // 마지막 페이지 여부
  empty: boolean // 비어있음 여부
}

// ===== 주문 관련 타입 =====

/**
 * 주문 요청 인터페이스
 * 주문 생성 시 필요한 정보를 포함합니다.
 */
export interface OrderRequest {
  price: number // 가격
  count: number // 수량
  discount: number // 할인율
  breadType: BreadType // 빵 종류
}

/**
 * 주문 응답 인터페이스
 * 주문 조회 시 반환되는 주문 정보를 포함합니다.
 */
export interface OrderResponse {
  id: number // 주문 ID
  address: string // 주소
  bakeryName: string // 빵집 이름
  price: number // 원가
  salePrice: number // 판매가
  count: number // 수량
  image: string // 이미지 URL
  productState: ProductState // 상품 상태
  breadType: BreadType // 빵 종류
}

/**
 * 주문 재고 응답 인터페이스
 * 주문 재고 조회 시 반환되는 정보를 포함합니다.
 */
export interface OrderStackResponse {
  id: number // 주문 ID
  memo?: string // 메모(선택)
  count: number // 수량
  productState: ProductState // 상품 상태
}

/**
 * 페이지 정보가 포함된 주문 재고 응답 인터페이스
 */
export interface PageInfoOrderStackResponse {
  pageToken: string // 다음 페이지 토큰
  data: OrderStackResponse[] // 주문 재고 목록
  hasNext: boolean // 다음 페이지 존재 여부
}

// ===== 채팅 관련 타입 =====

/**
 * 채팅 요청 인터페이스
 * 채팅 메시지 전송 시 필요한 정보를 포함합니다.
 */
export interface ChatRequest {
  content: string // 메시지 내용
  chatRoomId: number // 채팅방 ID
}

/**
 * 채팅 응답 인터페이스
 * 채팅 메시지 조회 시 반환되는 정보를 포함합니다.
 */
export interface ChatResponse {
  id: number // 채팅 메시지 ID
  senderId: number // 발신자 ID
  roomId: number // 채팅방 ID
  createdAt: string // 생성 시간(ISO 8601 형식)
  content: string // 메시지 내용
}

/**
 * 채팅방 생성 요청 인터페이스
 * 새로운 채팅방 생성 시 필요한 정보를 포함합니다.
 */
export interface ChatRoomCreateRequest {
  bakeryId: number // 빵집 ID
}

/**
 * 판매자용 채팅방 응답 인터페이스
 * 판매자 관점에서 채팅방 목록 조회 시 반환되는 정보를 포함합니다.
 */
export interface ChatRoomSellerOnlyResponse {
  chatRoomId: number // 채팅방 ID
  customerName: string // 고객 이름
  createdAt: string // 생성 시간(ISO 8601 형식)
  lastContent: string // 마지막 메시지 내용
  isOwner: boolean // 소유자 여부
}

/**
 * 구매자용 채팅방 응답 인터페이스
 * 구매자 관점에서 채팅방 목록 조회 시 반환되는 정보를 포함합니다.
 */
export interface ChatRoomBuyerOnlyResponse {
  chatRoomId: number // 채팅방 ID
  name: string // 빵집 이름
  lastContent: string // 마지막 메시지 내용
  createdAt: string // 생성 시간(ISO 8601 형식)
}

/**
 * 채팅 페이지 정보 인터페이스
 * 채팅 메시지 목록 조회 시 반환되는 페이지네이션 정보를 포함합니다.
 */
export interface PageInfoChatResponse {
  pageToken: string // 다음 페이지 토큰
  data: ChatResponse[] // 채팅 메시지 목록
  hasNext: boolean // 다음 페이지 존재 여부
}

/**
 * 판매자용 채팅방 페이지 정보 인터페이스
 * 판매자 관점에서 채팅방 목록 조회 시 반환되는 페이지네이션 정보를 포함합니다.
 */
export interface PageChatRoomSellerOnlyResponse {
  totalElements: number // 전체 요소 수
  totalPages: number // 전체 페이지 수
  size: number // 페이지 크기
  content: ChatRoomSellerOnlyResponse[] // 채팅방 목록
  number: number // 현재 페이지 번호
  sort: SortObject // 정렬 정보
  numberOfElements: number // 현재 페이지 요소 수
  pageable: PageableObject // 페이지 정보
  first: boolean // 첫 페이지 여부
  last: boolean // 마지막 페이지 여부
  empty: boolean // 비어있음 여부
}

/**
 * 구매자용 채팅방 페이지 정보 인터페이스
 * 구매자 관점에서 채팅방 목록 조회 시 반환되는 페이지네이션 정보를 포함합니다.
 */
export interface PageInfoChatRoomBuyerOnlyResponse {
  pageToken: string // 다음 페이지 토큰
  data: ChatRoomBuyerOnlyResponse[] // 채팅방 목록
  hasNext: boolean // 다음 페이지 존재 여부
}

/**
 * 계정 응답 인터페이스
 */
export interface AccountResponse {
  bankName: string // 은행 이름
  accountNo: string // 계좌 번호
  accountBalance: number // 계좌 잔액
}

/**
 * 주문 요약 응답 인터페이스
 * 스웨거 문서 기반으로 업데이트됨
 */
export interface OrderSummaryResponse {
  orderId: number // 주문 ID
  bakeryName: string // 빵집 이름
  breadType: BreadType // 빵 종류
  productState: ProductState // 상품 상태
  mark: boolean // 북마크 여부
}

/**
 * 슬롯 응답 인터페이스
 * 스웨거 문서 기반으로 업데이트됨
 */
export interface SlotResponse {
  slotNumber: number // 슬롯 번호
  orderSummaryResponse: OrderSummaryResponse | null // 주문 요약 정보
}

/**
 * 자판기 슬롯 응답 인터페이스
 * 스웨거 문서 기반으로 업데이트됨
 */
export interface VendingMachineSlotResponse {
  vendingMachineName: string // 자판기 이름
  height: number // 자판기 높이
  width: number // 자판기 너비
  slotResponseList: SlotResponse[] // 슬롯 응답 목록
}

