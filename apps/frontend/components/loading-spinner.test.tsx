import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { LoadingSpinner } from "./loading-spinner";

describe("LoadingSpinner", () => {
  it("renders without crashing", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("has correct structure", () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.querySelector(
      ".flex.items-center.justify-center",
    );
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.firstChild).toHaveClass("animate-spin");
  });

  it("applies correct styling classes", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass(
      "h-8",
      "w-8",
      "rounded-full",
      "border-4",
      "border-primary",
      "border-t-transparent",
    );
  });
});
