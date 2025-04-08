"use client";

import type React from "react";

import { useEffect } from "react";
import { initializeTheme } from "../store/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 앱 초기화 시 테마 적용
  useEffect(() => {
    initializeTheme();
  }, []);

  return <>{children}</>;
}
