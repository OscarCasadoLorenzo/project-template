import { atom } from "jotai";

/**
 * Toast notification types
 */
export type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Toast configuration interface
 */
export interface ToastConfig {
  id?: string | number;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Global atom to trigger toast notifications
 * This atom holds the latest toast configuration to be displayed
 */
export const toastAtom = atom<ToastConfig | null>(null);

/**
 * Write-only atom to trigger a new toast
 * This ensures we can trigger toasts from anywhere in the app
 */
let toastIdCounter = 0;
export const triggerToastAtom = atom(null, (get, set, config: ToastConfig) => {
  set(toastAtom, {
    ...config,
    id: config.id ?? `toast-${Date.now()}-${++toastIdCounter}`,
  });
});
