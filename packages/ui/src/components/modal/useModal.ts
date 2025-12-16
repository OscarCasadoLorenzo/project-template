'use client';

import { useContext } from 'react';
import { ModalContext } from './ModalProvider';
import type { ModalContextValue } from './types';

/**
 * useModal - Hook to access the modal API
 *
 * Provides functions to open, close, and manage modals from any component.
 * Must be used within a ModalProvider.
 *
 * @throws {Error} If used outside of ModalProvider
 *
 * @example
 * ```tsx
 * import { useModal } from '@project-template/ui';
 *
 * function MyComponent() {
 *   const { openModal, closeModal } = useModal();
 *
 *   const handleOpenConfirm = () => {
 *     openModal({
 *       id: 'confirm-delete',
 *       content: ConfirmDeleteModal,
 *       props: { entityId: '123' }
 *     });
 *   };
 *
 *   return <button onClick={handleOpenConfirm}>Delete</button>;
 * }
 * ```
 *
 * @example Opening a modal with ReactNode
 * ```tsx
 * const { openModal } = useModal();
 *
 * openModal({
 *   id: 'simple-modal',
 *   content: (
 *     <div>
 *       <h2>Hello World</h2>
 *       <p>This is a simple modal</p>
 *     </div>
 *   )
 * });
 * ```
 *
 * @example Using modal options
 * ```tsx
 * const { openModal } = useModal();
 *
 * openModal({
 *   id: 'critical-action',
 *   content: CriticalActionModal,
 *   dismissible: false, // Prevent closing with ESC or overlay click
 *   showCloseButton: false, // Hide the close button
 *   onClose: () => console.log('Modal closed')
 * });
 * ```
 *
 * @returns {ModalContextValue} Modal API with openModal, closeModal, etc.
 */
export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error(
      'useModal must be used within a ModalProvider. ' +
        'Make sure to wrap your app with <ModalProvider> and include <ModalRoot />.'
    );
  }

  return context;
}
