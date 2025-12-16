import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ConfigurableModal } from './ConfigurableModal';
import { ModalProvider } from './ModalProvider';
import { ModalRoot } from './ModalRoot';
import { useModal } from './useModal';

describe('ConfigurableModal', () => {
  function TestComponent() {
    const { openModal, closeModal } = useModal();

    return (
      <div>
        <button
          onClick={() =>
            openModal({
              id: 'confirm-modal',
              content: ConfigurableModal,
              props: {
                title: 'Test Title',
                description: 'Test Description',
                children: <div>Test Content</div>,
                buttons: [
                  {
                    label: 'Cancel',
                    onClick: () => closeModal('confirm-modal'),
                    variant: 'outline' as const,
                  },
                  {
                    label: 'Confirm',
                    onClick: () => {
                      closeModal('confirm-modal');
                    },
                    variant: 'destructive' as const,
                  },
                ],
              },
            })
          }
        >
          Open
        </button>
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

  it('should render with title and description', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render body content', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render configured buttons', () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should call button onClick handlers', () => {
    const onClickMock = jest.fn();

    function TestWithMock() {
      const { openModal } = useModal();

      return (
        <button
          onClick={() =>
            openModal({
              id: 'mock-modal',
              content: ConfigurableModal,
              props: {
                title: 'Test',
                buttons: [
                  {
                    label: 'Action',
                    onClick: onClickMock,
                  },
                ],
              },
            })
          }
        >
          Open
        </button>
      );
    }

    renderWithProvider(<TestWithMock />);

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Action'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should hide header when showHeader is false', () => {
    function TestNoHeader() {
      const { openModal } = useModal();

      return (
        <button
          onClick={() =>
            openModal({
              id: 'no-header',
              content: ConfigurableModal,
              props: {
                title: 'Should Not Appear',
                showHeader: false,
                children: <div>Only Content</div>,
              },
            })
          }
        >
          Open
        </button>
      );
    }

    renderWithProvider(<TestNoHeader />);

    fireEvent.click(screen.getByText('Open'));

    expect(screen.queryByText('Should Not Appear')).not.toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();
  });

  it('should render loading state on buttons', () => {
    function TestLoading() {
      const { openModal } = useModal();

      return (
        <button
          onClick={() =>
            openModal({
              id: 'loading',
              content: ConfigurableModal,
              props: {
                title: 'Loading Test',
                buttons: [
                  {
                    label: 'Submit',
                    onClick: () => {},
                    loading: true,
                  },
                ],
              },
            })
          }
        >
          Open
        </button>
      );
    }

    renderWithProvider(<TestLoading />);

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render custom header', () => {
    function TestCustomHeader() {
      const { openModal } = useModal();

      return (
        <button
          onClick={() =>
            openModal({
              id: 'custom-header',
              content: ConfigurableModal,
              props: {
                title: 'Default Title',
                customHeader: <div>Custom Header Content</div>,
              },
            })
          }
        >
          Open
        </button>
      );
    }

    renderWithProvider(<TestCustomHeader />);

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByText('Custom Header Content')).toBeInTheDocument();
    expect(screen.queryByText('Default Title')).not.toBeInTheDocument();
  });

  it('should render custom footer', () => {
    function TestCustomFooter() {
      const { openModal } = useModal();

      return (
        <button
          onClick={() =>
            openModal({
              id: 'custom-footer',
              content: ConfigurableModal,
              props: {
                title: 'Test',
                buttons: [{ label: 'Should Not Appear', onClick: () => {} }],
                customFooter: <div>Custom Footer Content</div>,
              },
            })
          }
        >
          Open
        </button>
      );
    }

    renderWithProvider(<TestCustomFooter />);

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByText('Custom Footer Content')).toBeInTheDocument();
    expect(screen.queryByText('Should Not Appear')).not.toBeInTheDocument();
  });
});
