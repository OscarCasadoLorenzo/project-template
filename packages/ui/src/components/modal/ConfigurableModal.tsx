'use client';

import type { ReactNode } from 'react';
import { Button } from '../../primitives/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../primitives/dialog';

/**
 * Button configuration for modal actions
 */
export interface ModalButtonConfig {
  /**
   * Button label text
   */
  label: string;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Button variant
   * @default 'default'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * Button size
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Disable the button
   * @default false
   */
  disabled?: boolean;

  /**
   * Show loading state
   * @default false
   */
  loading?: boolean;
}

/**
 * Props for the ConfigurableModal component
 */
export interface ConfigurableModalProps {
  /**
   * Modal title
   */
  title: string;

  /**
   * Optional description/subtitle
   */
  description?: string;

  /**
   * Modal body content
   */
  children?: ReactNode;

  /**
   * Button configurations
   * If not provided, no footer will be rendered
   */
  buttons?: ModalButtonConfig[];

  /**
   * Whether to show the header
   * @default true
   */
  showHeader?: boolean;

  /**
   * Custom header content (overrides title/description)
   */
  customHeader?: ReactNode;

  /**
   * Custom footer content (overrides buttons)
   */
  customFooter?: ReactNode;
}

/**
 * ConfigurableModal - Reusable modal component with configurable header, body, and footer
 *
 * This is a Higher-Order Component that provides a standardized modal structure
 * using shadcn/ui Dialog primitives. Perfect for confirmation dialogs, forms,
 * and other modal interactions.
 *
 * @example Basic confirmation modal
 * ```tsx
 * import { useModal } from '@project-template/ui';
 *
 * function MyComponent() {
 *   const { openModal, closeModal } = useModal();
 *
 *   const handleDelete = () => {
 *     openModal({
 *       id: 'confirm-delete',
 *       content: ConfigurableModal,
 *       props: {
 *         title: 'Delete Item',
 *         description: 'Are you sure? This action cannot be undone.',
 *         buttons: [
 *           {
 *             label: 'Cancel',
 *             onClick: () => closeModal('confirm-delete'),
 *             variant: 'outline',
 *           },
 *           {
 *             label: 'Delete',
 *             onClick: () => {
 *               performDelete();
 *               closeModal('confirm-delete');
 *             },
 *             variant: 'destructive',
 *           },
 *         ],
 *       },
 *     });
 *   };
 *
 *   return <button onClick={handleDelete}>Delete</button>;
 * }
 * ```
 *
 * @example Modal with custom body content
 * ```tsx
 * openModal({
 *   id: 'user-info',
 *   content: ConfigurableModal,
 *   props: {
 *     title: 'User Information',
 *     description: 'Please review the details below',
 *     children: (
 *       <div className="space-y-2">
 *         <p><strong>Name:</strong> John Doe</p>
 *         <p><strong>Email:</strong> john@example.com</p>
 *       </div>
 *     ),
 *     buttons: [
 *       {
 *         label: 'Close',
 *         onClick: () => closeModal('user-info'),
 *       },
 *     ],
 *   },
 * });
 * ```
 *
 * @example Modal with loading state
 * ```tsx
 * const [loading, setLoading] = useState(false);
 *
 * openModal({
 *   id: 'submit-form',
 *   content: ConfigurableModal,
 *   props: {
 *     title: 'Submit Form',
 *     description: 'Ready to submit?',
 *     buttons: [
 *       {
 *         label: 'Cancel',
 *         onClick: () => closeModal('submit-form'),
 *         variant: 'outline',
 *         disabled: loading,
 *       },
 *       {
 *         label: 'Submit',
 *         onClick: async () => {
 *           setLoading(true);
 *           await submitForm();
 *           setLoading(false);
 *           closeModal('submit-form');
 *         },
 *         loading: loading,
 *       },
 *     ],
 *   },
 * });
 * ```
 */
export function ConfigurableModal({
  title,
  description,
  children,
  buttons,
  showHeader = true,
  customHeader,
  customFooter,
}: ConfigurableModalProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
        <>
          {customHeader || (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
        </>
      )}

      {/* Body */}
      {children && <div className="py-4">{children}</div>}

      {/* Footer */}
      {(buttons || customFooter) && (
        <>
          {customFooter || (
            <DialogFooter>
              {buttons?.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || 'default'}
                  size={button.size || 'default'}
                  onClick={button.onClick}
                  disabled={button.disabled || button.loading}
                >
                  {button.loading ? 'Loading...' : button.label}
                </Button>
              ))}
            </DialogFooter>
          )}
        </>
      )}
    </div>
  );
}
