"use client";

import { ToastProvider } from "@/components/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider, ModalRoot } from "@project-template/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider } from "jotai";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000, // 5 seconds
            refetchInterval: 30 * 1000, // 30 seconds
          },
        },
      }),
  );

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ModalProvider>
            <ToastProvider />
            {children}
            <ModalRoot />
            <ReactQueryDevtools initialIsOpen={false} />
          </ModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
