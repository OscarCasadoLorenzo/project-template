'use client';

import { isValidElement, useContext, type ComponentType } from 'react';
import { Dialog, DialogContent } from '../../primitives/dialog';
import { ModalContext } from './ModalProvider';
import type { ModalConfig } from './types';

/**
 * ModalRoot - Renders all active modals
 *
 * This component should be included once in your app layout.
 * It automatically renders all modals managed by the ModalProvider.
 *
 * @example
 * ```tsx
 * import { ModalProvider, ModalRoot } from '@project-template/ui';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ModalProvider>
 *           {children}
 *           <ModalRoot />
 *         </ModalProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ModalRoot() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error(
      'ModalRoot must be used within a ModalProvider. ' +
        'Make sure to wrap your app with <ModalProvider>.'
    );
  }

  const { modals, closeModal } = context;

  if (modals.length === 0) {
    return null;
  }

  return (
    <>
      {modals.map((modal) => (
        <Modal key={modal.id} config={modal.config} onClose={() => closeModal(modal.id)} />
      ))}
    </>
  );
}

/**
 * Internal component that renders a single modal instance
 */
function Modal({ config, onClose }: { config: ModalConfig; onClose: () => void }) {
  const { content, props = {}, className, showCloseButton = true, dismissible = true } = config;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (!dismissible) return; // Prevent closing if not dismissible
      onClose();
    }
  };

  const renderContent = () => {
    if (isValidElement(content)) return content;
    if (typeof content === 'function') {
      const Component = content as ComponentType<typeof props>;
      return <Component {...props} />;
    }
    return content;
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent
        className={className}
        showCloseButton={showCloseButton}
        onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
        onPointerDownOutside={(e) => !dismissible && e.preventDefault()}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
