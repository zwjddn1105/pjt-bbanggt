// src/components/client-wrapper.tsx
"use client";

import { LoadingProvider } from "./loading-provider";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoadingProvider>{children}</LoadingProvider>;
}
