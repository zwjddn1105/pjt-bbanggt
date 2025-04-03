// 카카오맵 관련 타입 정의
export interface KakaoMapAPI {
  maps: {
    Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
    MarkerImage: new (
      src: string,
      size: KakaoSize,
      options?: KakaoMarkerImageOptions
    ) => KakaoMarkerImage;
    Size: new (width: number, height: number) => KakaoSize;
    Point: new (x: number, y: number) => KakaoPoint; // Point 타입 추가
    InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
    Circle: new (options: KakaoCircleOptions) => KakaoCircle;
    CustomOverlay: new (
      options: KakaoCustomOverlayOptions
    ) => KakaoCustomOverlay; // CustomOverlay 추가
    event: {
      addListener: (
        target: object,
        type: string,
        handler: (e: KakaoEvent) => void
      ) => void;
    };
    load: (callback: () => void) => void;
  };
}

// 카카오 포인트 인터페이스 추가
export interface KakaoPoint {
  x: number;
  y: number;
  equals(point: KakaoPoint): boolean;
  toString(): string;
}

// 카카오 이벤트 인터페이스
export interface KakaoEvent {
  target: object;
  type: string;
  latLng?: KakaoLatLng;
  point?: { x: number; y: number };
  [key: string]: unknown;
}

// 카카오맵 옵션 인터페이스
export interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

// 카카오 위도/경도 인터페이스
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
  equals(latlng: KakaoLatLng): boolean;
  toString(): string;
}

// 카카오 지도 인터페이스
export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
  setMapTypeId(mapTypeId: string): void;
  getMapTypeId(): string;
}

// 카카오 마커 옵션 인터페이스
export interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap | null;
  title?: string;
  image?: KakaoMarkerImage;
  clickable?: boolean;
  draggable?: boolean;
  zIndex?: number;
}

// 카카오 마커 인터페이스
export interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  getMap(): KakaoMap | null;
  setPosition(position: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setVisible(visible: boolean): void;
  getVisible(): boolean;
  setTitle(title: string): void;
  getTitle(): string;
  setDraggable(draggable: boolean): void;
  getDraggable(): boolean;
  setClickable(clickable: boolean): void;
  getClickable(): boolean;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
  setImage(image: KakaoMarkerImage): void; // 이 메서드 추가
  getImage(): KakaoMarkerImage; // 이 메서드도 추가
}

// 카카오 사이즈 인터페이스
export interface KakaoSize {
  width: number;
  height: number;
}

// 카카오 마커 이미지 옵션 인터페이스
export interface KakaoMarkerImageOptions {
  offset?: KakaoPoint; // KakaoSize에서 KakaoPoint로 변경
  spriteOrigin?: KakaoPoint; // KakaoSize에서 KakaoPoint로 변경
  spriteSize?: KakaoSize;
}

// 카카오 마커 이미지 인터페이스
export interface KakaoMarkerImage {
  getSize(): KakaoSize;
  getOffset(): KakaoPoint; // KakaoSize에서 KakaoPoint로 변경
  getSpriteOrigin(): KakaoPoint; // KakaoSize에서 KakaoPoint로 변경
  getSpriteSize(): KakaoSize;
}

// 카카오 인포윈도우 옵션 인터페이스
export interface KakaoInfoWindowOptions {
  content: string;
  position?: KakaoLatLng;
  removable?: boolean;
  zIndex?: number;
}

// 카카오 인포윈도우 인터페이스
export interface KakaoInfoWindow {
  open(map: KakaoMap, marker?: KakaoMarker): void;
  close(): void;
  setContent(content: string): void;
  getContent(): string;
  setPosition(position: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
}

// 카카오 원 옵션 인터페이스
export interface KakaoCircleOptions {
  center: KakaoLatLng;
  radius: number;
  strokeWeight?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeStyle?: string;
  fillColor?: string;
  fillOpacity?: number;
  map?: KakaoMap;
}

// 카카오 원 인터페이스
export interface KakaoCircle {
  setMap(map: KakaoMap | null): void;
  getMap(): KakaoMap | null;
  setOptions(options: Partial<KakaoCircleOptions>): void;
  setPosition(position: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setRadius(radius: number): void;
  getRadius(): number;
}

// 카카오 커스텀 오버레이 옵션 인터페이스 추가
export interface KakaoCustomOverlayOptions {
  position: KakaoLatLng;
  content: HTMLElement | string;
  map?: KakaoMap | null;
  clickable?: boolean;
  xAnchor?: number;
  yAnchor?: number;
  zIndex?: number;
}

// 카카오 커스텀 오버레이 인터페이스 추가
export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
  getMap(): KakaoMap | null;
  setPosition(position: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setContent(content: HTMLElement | string): void;
  getContent(): HTMLElement | string;
  setVisible(visible: boolean): void;
  getVisible(): boolean;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
}

// Window 인터페이스 확장
declare global {
  interface Window {
    kakao: KakaoMapAPI;
  }
}

// 빵집 정보 타입
export interface Bakery {
  id: number;
  name: string;
  address: string;
  distance: string;
  category: string;
  rating: number;
}

// 빵집 위치 타입
export interface BakeryPosition {
  lat: number;
  lng: number;
}

// 빵긋 자판기 정보 타입
export interface VendingMachine {
  id: number | string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: string | number;
  remainSpaceCount?: number; // 남은 공간 수
  availableCount?: number; // 사용 가능한 수 (다른 앱에서 사용)
}

// API 응답 데이터 타입
export interface VendingMachineApiResponse {
  id: number | string;
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  remainSpaceCount?: number; // 남은 공간 수
  availableCount?: number; // 사용 가능한 수 (다른 앱에서 사용)
}
