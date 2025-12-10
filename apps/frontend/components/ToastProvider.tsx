"use client";

import { toastAtom } from "@/atoms/toast.atoms";
import { Toaster } from "@project-template/ui";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { toast as sonnerToast } from "sonner";

/**
 * Global Toast Provider Component
 *
 * This component listens to toast atom changes and triggers Sonner toasts accordingly.
 * It should be mounted once at the app root level to handle all toast notifications.
 *
 * Features:
 * - Automatic toast triggering based on global state
 * - Support for multiple toast types (success, error, info, warning)
 * - Custom actions and durations
 * - Accessible and visually consistent with shadcn UI
 *
 * @example
 * ```tsx
 * // In your root layout
 * <Providers>
 *   <ToastProvider />
 *   {children}
 * </Providers>
 * ```
 */
export function ToastProvider() {
  const toastConfig = useAtomValue(toastAtom);

  useEffect(() => {
    if (!toastConfig) return;

    const {
      title,
      description,
      type = "default",
      duration,
      action,
    } = toastConfig;

    // Build the toast message (always use title, even if description exists)
    const message = title;

    // Build the options object
    const toastOptions: any = {
      duration,
      description: description,
    };

    // Add action if provided
    if (action) {
      toastOptions.action = {
        label: action.label,
        onClick: (event: any) => {
          event.preventDefault();
          action.onClick();
        },
      };
    }

    // Trigger the appropriate toast type
    switch (type) {
      case "success":
        sonnerToast.success(message, toastOptions);
        break;
      case "error":
        sonnerToast.error(message, toastOptions);
        break;
      case "info":
        sonnerToast.info(message, toastOptions);
        break;
      case "warning":
        sonnerToast.warning(message, toastOptions);
        break;
      default:
        sonnerToast(message, toastOptions);
    }
  }, [toastConfig]);

  return <Toaster position="top-right" richColors closeButton />;
}
