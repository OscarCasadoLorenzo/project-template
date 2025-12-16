import type { ComponentType, ReactNode } from 'react';

/**
 * Configuration options for a modal instance
 */
export interface ModalConfig<TProps = Record<string, unknown>> {
  /**
   * Unique identifier for the modal instance
   */
  id: string;

  /**
   * The component to render inside the modal
   * Can be a React component or a ReactNode
   */
  content: ComponentType<TProps> | ReactNode;

  /**
   * Props to pass to the modal content component
   * Only used when content is a ComponentType
   */
  props?: TProps;

  /**
   * Custom className for the modal content wrapper
   */
  className?: string;

  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Callback invoked when the modal is closed
   */
  onClose?: () => void;

  /**
   * Whether the modal can be closed by clicking the overlay or pressing ESC
   * @default true
   */
  dismissible?: boolean;
}

/**
 * Internal modal state used by the provider
 */
export interface ModalState {
  id: string;
  config: ModalConfig;
}

/**
 * Modal context API
 */
export interface ModalContextValue {
  /**
   * Currently active modals (supports stacking)
   */
  modals: ModalState[];

  /**
   * Open a new modal
   */
  openModal: <TProps = Record<string, unknown>>(config: ModalConfig<TProps>) => void;

  /**
   * Close a specific modal by ID
   */
  closeModal: (id: string) => void;

  /**
   * Close all modals
   */
  closeAllModals: () => void;

  /**
   * Replace all existing modals with a new one
   */
  replaceModal: <TProps = Record<string, unknown>>(config: ModalConfig<TProps>) => void;
}
