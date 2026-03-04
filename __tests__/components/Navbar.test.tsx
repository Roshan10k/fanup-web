import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Navbar from "@/app/_components/navbar";

// Mock SiteThemeToggle
jest.mock("@/app/_components/SiteThemeToggle", () => {
  const MockToggle = () => <button data-testid="theme-toggle">Toggle Theme</button>;
  MockToggle.displayName = "MockSiteThemeToggle";
  return { __esModule: true, default: MockToggle };
});

describe("Navbar", () => {
  it("renders the FanUp logo and brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("Fan")).toBeInTheDocument();
    expect(screen.getByText("Up")).toBeInTheDocument();
    expect(screen.getByAltText("FanUp logo")).toBeInTheDocument();
  });

  it("renders navigation links in landing variant", () => {
    render(<Navbar variant="landing" />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Why Choose Us")).toBeInTheDocument();
    expect(screen.getByText("How it Works")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("does not render nav links in auth variant", () => {
    render(<Navbar variant="auth" />);
    expect(screen.queryByText("About")).not.toBeInTheDocument();
    expect(screen.queryByText("How it Works")).not.toBeInTheDocument();
  });

  it("renders Login and Sign Up buttons", () => {
    render(<Navbar />);
    const loginLinks = screen.getAllByText("Login");
    const signupLinks = screen.getAllByText("Sign Up");
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(signupLinks.length).toBeGreaterThan(0);
  });

  it("highlights active auth button in auth variant", () => {
    render(<Navbar variant="auth" authMode="login" />);
    // The login button should have the active styling class
    const loginLinks = screen.getAllByText("Login");
    const loginButton = loginLinks[0].closest("a");
    expect(loginButton?.className).toContain("bg-red-100");
  });

  it("toggles mobile menu when hamburger is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar variant="landing" />);

    const menuButton = screen.getByLabelText("Toggle menu");
    expect(menuButton).toBeInTheDocument();

    // Initially, mobile menu items should not show the mobile-specific container
    expect(screen.queryByText("About")?.closest(".border-t")).toBeNull();

    await user.click(menuButton);

    // After click, the mobile nav should appear — "About" now shows in both desktop and mobile
    const aboutLinks = screen.getAllByText("About");
    expect(aboutLinks.length).toBeGreaterThan(1);
  });

  it("renders theme toggle", () => {
    render(<Navbar />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
