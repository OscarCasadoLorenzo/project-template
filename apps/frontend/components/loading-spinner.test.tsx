import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { LoadingSpinner } from "./loading-spinner";

describe("LoadingSpinner", () => {
  it("renders without crashing", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
