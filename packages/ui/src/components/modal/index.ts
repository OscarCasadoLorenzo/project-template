/**
 * Modal System
 *
 * A production-grade modal management system built on Radix Dialog primitives.
 * Provides a clean, hook-based API for opening and managing modals from anywhere in your app.
 *
 * @module modal
 *
 * @example Basic Setup
 * ```tsx
 * // app/providers.tsx
 * import { ModalProvider, ModalRoot } from '@project-template/ui';
 *
 * export function Providers({ children }) {
 *   return (
 *     <ModalProvider>
 *       {children}
 *       <ModalRoot />
 *     </ModalProvider>
 *   );
 * }
 * ```
 *
 * @example Using the Modal API
 * ```tsx
 * import { useModal } from '@project-template/ui';
 *
 * function MyComponent() {
 *   const { openModal } = useModal();
 *
 *   const handleClick = () => {
 *     openModal({
 *       id: 'my-modal',
 *       content: MyModalContent,
 *       props: { message: 'Hello!' }
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Open Modal</button>;
 * }
 * ```
 */

export { ModalProvider } from './ModalProvider';
export type { ModalProviderProps } from './ModalProvider';

export { ModalRoot } from './ModalRoot';

export { useModal } from './useModal';

export { ConfigurableModal } from './ConfigurableModal';
export type { ConfigurableModalProps, ModalButtonConfig } from './ConfigurableModal';

export type { ModalConfig, ModalContextValue, ModalState } from './types';
