// 기본 서비스 워커 스크립트
self.addEventListener("install", (event) => {
    console.log("Service Worker installed")
  })
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker activated")
  })
  
  // 캐시 이름 정의
  const CACHE_NAME = "ppanggut-cache-v1"
  
  // 캐싱할 파일 목록
  const urlsToCache = ["/", "/index.html", "/mascot.png", "/logo.jpg"]
  
  // 설치 시 캐시 생성 및 파일 캐싱
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Cache opened")
        return cache.addAll(urlsToCache)
      }),
    )
  })
  
  // 네트워크 요청 가로채기
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // 캐시에서 찾으면 캐시된 응답 반환
        if (response) {
          return response
        }
  
        // 캐시에 없으면 네트워크 요청
        return fetch(event.request).then((response) => {
          // 유효한 응답이 아니면 그냥 반환
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }
  
          // 응답 복제 (스트림은 한 번만 사용 가능)
          const responseToCache = response.clone()
  
          // 응답을 캐시에 저장
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
  
          return response
        })
      }),
    )
  })
  
  // 오래된 캐시 정리
  self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME]
  
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              // 화이트리스트에 없는 캐시 삭제
              return caches.delete(cacheName)
            }
          }),
        )
      }),
    )
  })
  
  