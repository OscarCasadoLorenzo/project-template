import { triggerToastAtom, type ToastConfig } from "@/atoms/toast.atoms";
import { useSetAtom } from "jotai";

/**
 * Global toast hook
 *
 * Provides methods to trigger different types of toast notifications from anywhere in the app.
 *
 * @example
 * ```tsx
 * const toast = useGlobalToast();
 *
 * // Simple success message
 * toast.success('Operation completed!');
 *
 * // Error with description
 * toast.error('Failed to save', 'Please try again later');
 *
 * // Info with custom duration
 * toast.info('Processing...', undefined, 5000);
 *
 * // With action button
 * toast.warning('Unsaved changes', 'You have unsaved changes', 0, {
 *   label: 'Save',
 *   onClick: () => handleSave()
 * });
 * ```
 */
export function useGlobalToast() {
  const triggerToast = useSetAtom(triggerToastAtom);

  return {
    /**
     * Display a success toast
     */
    success: (
      title: string,
      description?: string,
      duration?: number,
      action?: ToastConfig["action"],
    ) => {
      triggerToast({
        title,
        description,
        type: "success",
        duration,
        action,
      });
    },

    /**
     * Display an error toast
     */
    error: (
      title: string,
      description?: string,
      duration?: number,
      action?: ToastConfig["action"],
    ) => {
      triggerToast({
        title,
        description,
        type: "error",
        duration,
        action,
      });
    },

    /**
     * Display an info toast
     */
    info: (
      title: string,
      description?: string,
      duration?: number,
      action?: ToastConfig["action"],
    ) => {
      triggerToast({
        title,
        description,
        type: "info",
        duration,
        action,
      });
    },

    /**
     * Display a warning toast
     */
    warning: (
      title: string,
      description?: string,
      duration?: number,
      action?: ToastConfig["action"],
    ) => {
      triggerToast({
        title,
        description,
        type: "warning",
        duration,
        action,
      });
    },

    /**
     * Display a default toast
     */
    default: (
      title: string,
      description?: string,
      duration?: number,
      action?: ToastConfig["action"],
    ) => {
      triggerToast({
        title,
        description,
        type: "default",
        duration,
        action,
      });
    },

    /**
     * Display a custom toast with full configuration
     */
    custom: (config: ToastConfig) => {
      triggerToast(config);
    },
  };
}
