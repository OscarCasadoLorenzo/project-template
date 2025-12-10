import { fireEvent, render, screen } from '@testing-library/react';
import { Pagination, PaginationProps } from './Pagination';

describe('Pagination Component', () => {
  const defaultProps: PaginationProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render previous and next buttons', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
    });

    it('should render page numbers when total pages is small', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={5} />);

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should render ellipsis when total pages is large', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={20} />);

      const ellipsis = screen.getAllByText('More pages');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should highlight the current page', () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={10} />);

      const currentPageLink = screen.getByText('3').closest('a');
      expect(currentPageLink).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Navigation', () => {
    it('should call onPageChange when clicking a page number', () => {
      const onPageChange = jest.fn();
      render(
        <Pagination {...defaultProps} currentPage={1} totalPages={5} onPageChange={onPageChange} />
      );

      const pageThree = screen.getByText('3');
      fireEvent.click(pageThree);

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange with previous page when clicking previous button', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const previousButton = screen.getByLabelText(/previous page/i);
      fireEvent.click(previousButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('should call onPageChange with next page when clicking next button', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const nextButton = screen.getByLabelText(/next page/i);
      fireEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('should not call onPageChange when clicking the current page', () => {
      const onPageChange = jest.fn();
      render(
        <Pagination {...defaultProps} currentPage={3} totalPages={5} onPageChange={onPageChange} />
      );

      const currentPage = screen.getByText('3');
      fireEvent.click(currentPage);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Boundary Conditions', () => {
    it('should disable previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={10} />);

      const previousButton = screen.getByLabelText(/previous page/i);
      expect(previousButton).toHaveAttribute('aria-disabled', 'true');
      expect(previousButton).toHaveClass('opacity-50');
    });

    it('should disable next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      const nextButton = screen.getByLabelText(/next page/i);
      expect(nextButton).toHaveAttribute('aria-disabled', 'true');
      expect(nextButton).toHaveClass('opacity-50');
    });

    it('should not call onPageChange when clicking previous on first page', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);

      const previousButton = screen.getByLabelText(/previous page/i);
      fireEvent.click(previousButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not call onPageChange when clicking next on last page', () => {
      const onPageChange = jest.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={10}
          totalPages={10}
          onPageChange={onPageChange}
        />
      );

      const nextButton = screen.getByLabelText(/next page/i);
      fireEvent.click(nextButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should handle single page correctly', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);

      const previousButton = screen.getByLabelText(/previous page/i);
      const nextButton = screen.getByLabelText(/next page/i);

      expect(previousButton).toHaveAttribute('aria-disabled', 'true');
      expect(nextButton).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Page Number Display Logic', () => {
    it('should show all pages when totalPages <= 7', () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={7} />);

      for (let i = 1; i <= 7; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should show ellipsis in the middle for pages 5-16', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={20} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getAllByText('More pages').length).toBeGreaterThan(0);
    });

    it('should show pages near the start correctly', () => {
      render(<Pagination {...defaultProps} currentPage={2} totalPages={20} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('should show pages near the end correctly', () => {
      render(<Pagination {...defaultProps} currentPage={19} totalPages={20} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('19')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'pagination');
      expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
    });

    it('should set aria-current on active page', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      const activePage = screen.getByText('5').closest('a');
      expect(activePage).toHaveAttribute('aria-current', 'page');
    });

    it('should set aria-disabled on disabled buttons', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={10} />);

      const previousButton = screen.getByLabelText(/previous page/i);
      expect(previousButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have screen reader text for ellipsis', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={20} />);

      const ellipsisElements = screen.getAllByText('More pages');
      expect(ellipsisElements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero total pages gracefully', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={0} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle current page out of bounds', () => {
      const onPageChange = jest.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={15}
          totalPages={10}
          onPageChange={onPageChange}
        />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should prevent default on all link clicks', () => {
      const onPageChange = jest.fn();
      render(
        <Pagination {...defaultProps} currentPage={5} totalPages={10} onPageChange={onPageChange} />
      );

      const pageLink = screen.getByText('6');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

      fireEvent(pageLink, clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('TypeScript Types', () => {
    it('should accept valid PaginationProps', () => {
      const props: PaginationProps = {
        currentPage: 1,
        totalPages: 10,
        onPageChange: jest.fn(),
      };

      render(<Pagination {...props} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
