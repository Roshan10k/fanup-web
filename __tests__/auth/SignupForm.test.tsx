import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignupForm from "@/app/(auth)/_components/SignupForm";

// Mock server actions
const mockHandleRegister = jest.fn();
jest.mock("@/app/lib/action/auth_action", () => ({
  handleRegister: (...args: unknown[]) => mockHandleRegister(...args),
  handleGoogleLogin: jest.fn(),
}));

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    checkAuth: jest.fn(),
    isAuthenticated: false,
    user: null,
    loading: false,
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all signup form fields", () => {
    render(<SignupForm />);

    expect(screen.getByPlaceholderText("Enter Your Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Your Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create a Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm your password")).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("renders Google signup button", () => {
    render(<SignupForm />);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("shows validation error for short full name", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Enter Your Full Name"), "A");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Full name must be at least 2 characters")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Enter Your Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Enter Your Email"), "bademail");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("shows password strength requirements when typing", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Create a Password"), "ab");

    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
    expect(screen.getByText("Uppercase & lowercase letters")).toBeInTheDocument();
    expect(screen.getByText("At least one number")).toBeInTheDocument();
    expect(screen.getByText("Special character (recommended)")).toBeInTheDocument();
  });

  it("shows validation error for weak password", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Enter Your Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Enter Your Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Create a Password"), "weak");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "weak");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    });
  });

  it("shows validation error when passwords don't match", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Enter Your Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Enter Your Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Create a Password"), "StrongPass1!");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "DifferentPass1!");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("shows passwords match indicator", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Create a Password"), "StrongPass1!");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "StrongPass1!");

    expect(screen.getByText("Passwords match!")).toBeInTheDocument();
  });

  it("toggles password visibility for both password fields", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const passwordInput = screen.getByPlaceholderText("Create a Password");
    const confirmInput = screen.getByPlaceholderText("Confirm your password");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");

    // Toggle password field
    const passwordToggle = passwordInput.parentElement!.querySelector("button")!;
    await user.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Toggle confirm password field
    const confirmToggle = confirmInput.parentElement!.querySelector("button")!;
    await user.click(confirmToggle);
    expect(confirmInput).toHaveAttribute("type", "text");
  });

  it("shows error when terms not agreed", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Enter Your Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Enter Your Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Create a Password"), "StrongPass1!");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "StrongPass1!");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(
        screen.getByText("Please accept the Terms of Service and Privacy Policy")
      ).toBeInTheDocument();
    });
  });

  it("calls handleRegister on valid submission with terms agreed", async () => {
    mockHandleRegister.mockResolvedValueOnce({
      success: true,
      message: "Account created successfully!",
    });

    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Enter Your Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Enter Your Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Create a Password"), "StrongPass1!");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "StrongPass1!");
    await user.click(screen.getByLabelText(/I agree to the/));
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(mockHandleRegister).toHaveBeenCalledWith({
        fullName: "Test User",
        email: "test@test.com",
        password: "StrongPass1!",
        confirmPassword: "StrongPass1!",
      });
    });
  });

  it("shows success message after successful registration", async () => {
    mockHandleRegister.mockResolvedValueOnce({
      success: true,
      message: "Account created successfully!",
    });

    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByPlaceholderText("Enter Your Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Enter Your Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Create a Password"), "StrongPass1!");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "StrongPass1!");
    await user.click(screen.getByLabelText(/I agree to the/));
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Account created successfully!")).toBeInTheDocument();
    });
  });
});
