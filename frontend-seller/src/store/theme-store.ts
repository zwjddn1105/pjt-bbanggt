import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;

          // HTML 요소에 다크모드 클래스 적용
          if (typeof window !== "undefined") {
            if (newDarkMode) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }

          return { isDarkMode: newDarkMode };
        });
      },
    }),
    {
      name: "theme-storage", // localStorage에 저장될 키 이름
      getStorage: () => localStorage, // 스토리지 타입 (localStorage 사용)
    }
  )
);

// 앱 초기화 시 다크모드 상태 적용
export const initializeTheme = () => {
  const { isDarkMode } = useThemeStore.getState();

  if (typeof window !== "undefined") {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};
