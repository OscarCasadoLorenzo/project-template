'use client';

import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ModalConfig, ModalContextValue, ModalState } from './types';

/**
 * Modal context - provides modal state and API to the component tree
 */
export const ModalContext = createContext<ModalContextValue | null>(null);

ModalContext.displayName = 'ModalContext';

/**
 * Props for ModalProvider component
 */
export interface ModalProviderProps {
  /**
   * Child components that can use the modal API
   */
  children: ReactNode;
}

/**
 * ModalProvider - Global provider that manages modal state and rendering
 *
 * This component should be mounted once at the app root level.
 * It provides the modal context to all child components.
 *
 * @example
 * ```tsx
 * import { ModalProvider } from '@project-template/ui';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ModalProvider>
 *           {children}
 *         </ModalProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalState[]>([]);

  /**
   * Open a new modal
   * Adds the modal to the stack (supports multiple modals)
   */
  const openModal = useCallback(
    <TProps = Record<string, unknown>,>(config: ModalConfig<TProps>) => {
      setModals((prev) => [
        ...prev,
        {
          id: config.id,
          config: config as ModalConfig,
        },
      ]);
    },
    []
  );

  /**
   * Close a specific modal by ID
   * Triggers onClose callback if provided
   */
  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modalToClose = prev.find((m) => m.id === id);
      if (modalToClose?.config.onClose) {
        modalToClose.config.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  /**
   * Close all modals
   * Triggers onClose callback for each modal
   */
  const closeAllModals = useCallback(() => {
    setModals((prev) => {
      prev.forEach((modal) => {
        if (modal.config.onClose) {
          modal.config.onClose();
        }
      });
      return [];
    });
  }, []);

  /**
   * Replace all existing modals with a new one
   * Useful for modal transitions or wizard flows
   */
  const replaceModal = useCallback(
    <TProps = Record<string, unknown>,>(config: ModalConfig<TProps>) => {
      setModals((prev) => {
        prev.forEach((modal) => {
          if (modal.config.onClose) {
            modal.config.onClose();
          }
        });
        return [
          {
            id: config.id,
            config: config as ModalConfig,
          },
        ];
      });
    },
    []
  );

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      modals,
      openModal,
      closeModal,
      closeAllModals,
      replaceModal,
    }),
    [modals, openModal, closeModal, closeAllModals, replaceModal]
  );

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}
