import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Button } from '../primitives/button';

describe('Button Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    const { getByText } = render(<Button>Test Button</Button>);
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<Button>Default</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('applies custom variant when provided', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('border');
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('renders as child component when asChild is true', () => {
    const { container } = render(
      <Button asChild>
        <a href="/">Link Button</a>
      </Button>
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
