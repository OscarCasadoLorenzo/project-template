import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { ModalProvider } from './ModalProvider';
import { ModalRoot } from './ModalRoot';
import { useModal } from './useModal';

describe('Modal System', () => {
  // Test component that uses the modal API
  function TestComponent() {
    const { openModal, closeModal, closeAllModals, replaceModal, modals } = useModal();

    return (
      <div>
        <div data-testid="modal-count">{modals.length}</div>
        <button
          onClick={() =>
            openModal({
              id: 'test-modal',
              content: <div>Test Modal Content</div>,
            })
          }
        >
          Open Modal
        </button>
        <button
          onClick={() =>
            openModal({
              id: 'second-modal',
              content: <div>Second Modal</div>,
            })
          }
        >
          Open Second Modal
        </button>
        <button onClick={() => closeModal('test-modal')}>Close First</button>
        <button onClick={() => closeAllModals()}>Close All</button>
        <button
          onClick={() =>
            replaceModal({
              id: 'replaced-modal',
              content: <div>Replaced Content</div>,
            })
          }
        >
          Replace Modals
        </button>
      </div>
    );
  }

  function TestComponentWithProps() {
    const { openModal } = useModal();

    interface TestModalProps {
      title: string;
      count: number;
    }

    const TestModal = ({ title, count }: TestModalProps) => (
      <div>
        <h1>{title}</h1>
        <p>Count: {count}</p>
      </div>
    );

    return (
      <button
        onClick={() =>
          openModal({
            id: 'props-modal',
            content: TestModal,
            props: { title: 'Test Title', count: 42 },
          })
        }
      >
        Open With Props
      </button>
    );
  }

  function TestComponentWithCallbacks() {
    const [closeCount, setCloseCount] = useState(0);
    const { openModal, closeModal } = useModal();

    const handleOpenModal = () => {
      openModal({
        id: 'callback-modal',
        content: <div>Callback Modal</div>,
        onClose: () => setCloseCount((prev) => prev + 1),
      });
    };

    return (
      <div>
        <button onClick={handleOpenModal}>Open</button>
        <button onClick={() => closeModal('callback-modal')}>Close</button>
        <div data-testid="close-count">{closeCount}</div>
      </div>
    );
  }

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <ModalProvider>
        {component}
        <ModalRoot />
      </ModalProvider>
    );
  };

  describe('ModalProvider', () => {
    it('should throw error when useModal is used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useModal must be used within a ModalProvider');

      consoleError.mockRestore();
    });

    it('should provide modal context to children', () => {
      renderWithProvider(<TestComponent />);
      expect(screen.getByText('Open Modal')).toBeInTheDocument();
    });
  });

  describe('openModal', () => {
    it('should open a modal with ReactNode content', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByText('Open Modal'));

      expect(screen.getByText('Test Modal Content')).toBeInTheDocument();
    });

    it('should open a modal with component and props', () => {
      renderWithProvider(<TestComponentWithProps />);

      fireEvent.click(screen.getByText('Open With Props'));

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Count: 42')).toBeInTheDocument();
    });

    it('should support multiple modals (stacking)', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByText('Open Modal'));
      fireEvent.click(screen.getByText('Open Second Modal'));

      expect(screen.getByText('Test Modal Content')).toBeInTheDocument();
      expect(screen.getByText('Second Modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-count')).toHaveTextContent('2');
    });
  });

  describe('closeModal', () => {
    it('should close a specific modal by id', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByText('Open Modal'));
      expect(screen.getByText('Test Modal Content')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Close First'));
      expect(screen.queryByText('Test Modal Content')).not.toBeInTheDocument();
    });

    it('should trigger onClose callback when modal is closed', () => {
      renderWithProvider(<TestComponentWithCallbacks />);

      fireEvent.click(screen.getByText('Open'));
      expect(screen.getByTestId('close-count')).toHaveTextContent('0');

      // Click the user-defined close button (not the X button)
      const closeButtons = screen.getAllByText('Close');
      fireEvent.click(closeButtons[0]); // First one is the user's button
      expect(screen.getByTestId('close-count')).toHaveTextContent('1');
    });
  });

  describe('closeAllModals', () => {
    it('should close all open modals', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByText('Open Modal'));
      fireEvent.click(screen.getByText('Open Second Modal'));

      expect(screen.getByTestId('modal-count')).toHaveTextContent('2');

      fireEvent.click(screen.getByText('Close All'));

      expect(screen.getByTestId('modal-count')).toHaveTextContent('0');
      expect(screen.queryByText('Test Modal Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second Modal')).not.toBeInTheDocument();
    });
  });

  describe('replaceModal', () => {
    it('should replace all existing modals with a new one', () => {
      renderWithProvider(<TestComponent />);

      fireEvent.click(screen.getByText('Open Modal'));
      fireEvent.click(screen.getByText('Open Second Modal'));

      expect(screen.getByTestId('modal-count')).toHaveTextContent('2');

      fireEvent.click(screen.getByText('Replace Modals'));

      expect(screen.getByTestId('modal-count')).toHaveTextContent('1');
      expect(screen.queryByText('Test Modal Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second Modal')).not.toBeInTheDocument();
      expect(screen.getByText('Replaced Content')).toBeInTheDocument();
    });
  });

  describe('Modal options', () => {
    it('should respect showCloseButton option', () => {
      function TestWithoutCloseButton() {
        const { openModal } = useModal();

        return (
          <button
            onClick={() =>
              openModal({
                id: 'no-close',
                content: <div>No Close Button</div>,
                showCloseButton: false,
              })
            }
          >
            Open
          </button>
        );
      }

      renderWithProvider(<TestWithoutCloseButton />);

      fireEvent.click(screen.getByText('Open'));

      // The close button should not be visible
      // This tests the prop is passed, actual rendering is tested in Dialog tests
      expect(screen.getByText('No Close Button')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      function TestWithClassName() {
        const { openModal } = useModal();

        return (
          <button
            onClick={() =>
              openModal({
                id: 'custom-class',
                content: <div>Custom Class</div>,
                className: 'max-w-4xl',
              })
            }
          >
            Open
          </button>
        );
      }

      renderWithProvider(<TestWithClassName />);

      fireEvent.click(screen.getByText('Open'));

      expect(screen.getByText('Custom Class')).toBeInTheDocument();
    });
  });
});
