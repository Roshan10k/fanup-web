import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LoginForm from "@/app/(auth)/_components/LoginForm";

// Mock server actions
jest.mock("@/app/lib/action/auth_action", () => ({
  handleLogin: jest.fn(),
  handleGoogleLogin: jest.fn(),
}));

// Mock AuthContext
const mockCheckAuth = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    checkAuth: mockCheckAuth,
    isAuthenticated: false,
    user: null,
    loading: false,
  }),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

import { handleLogin } from "@/app/lib/action/auth_action";
const mockedHandleLogin = handleLogin as jest.MockedFunction<typeof handleLogin>;

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form with all fields", () => {
    render(<LoginForm />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("renders forgot password link", () => {
    render(<LoginForm />);

    const forgotLink = screen.getByText("Forgot Password?");
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute("href", "/request-reset-password");
  });

  it("renders Google login button", () => {
    render(<LoginForm />);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("shows validation errors for empty email submission", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Enter your email"), "not-an-email");
    await user.type(screen.getByPlaceholderText("Enter your password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      // Zod email validation error
      const errorEl = screen.getByText((content) => content.toLowerCase().includes("email") || content.toLowerCase().includes("invalid"));
      expect(errorEl).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Enter your email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "12345");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText("Enter your password");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click the toggle button (the button inside the password field container)
    const toggleButton = passwordInput.parentElement!.querySelector("button")!;
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("calls handleLogin and redirects on successful login", async () => {
    mockedHandleLogin.mockResolvedValueOnce({
      success: true,
      message: "Login successful",
      data: { role: "user" },
    });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Enter your email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockedHandleLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
      expect(mockCheckAuth).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message on failed login", async () => {
    mockedHandleLogin.mockResolvedValueOnce({
      success: false,
      message: "Invalid credentials",
      
    });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Enter your email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "wrongpass1");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
