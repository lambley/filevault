import { render, fireEvent, screen } from "@testing-library/react";
import ThemeToggle from "../../components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("should render with the correct initial theme", () => {
    render(<ThemeToggle />);
    const checkbox = screen.getByLabelText(/toggle theme/i) as HTMLInputElement;

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("should toggle the theme and update localStorage", () => {
    render(<ThemeToggle />);
    const checkbox = screen.getByLabelText(/toggle theme/i) as HTMLInputElement;

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should set the theme based on localStorage on initial render", () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);
    const checkbox = screen.getByLabelText(/toggle theme/i) as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
