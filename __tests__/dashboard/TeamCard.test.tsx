import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamCard from "@/app/dashboard/_components/TeamCard";

// Mock the useThemeMode hook
jest.mock("@/app/dashboard/_components/useThemeMode", () => ({
  useThemeMode: () => ({ isDark: false, theme: "light", toggleTheme: jest.fn() }),
}));

describe("TeamCard", () => {
  const defaultProps = {
    league: "IPL",
    date: "Nov 4, 26",
    time: "3:15 PM",
    team1: "IND",
    team2: "AUS",
    teamName: "My Dream Team",
    points: 150,
  };

  it("renders team name", () => {
    render(<TeamCard {...defaultProps} />);
    expect(screen.getByText("My Dream Team")).toBeInTheDocument();
  });

  it("renders league info", () => {
    render(<TeamCard {...defaultProps} />);
    expect(screen.getByText("IPL")).toBeInTheDocument();
  });

  it("renders date and time", () => {
    render(<TeamCard {...defaultProps} />);
    expect(screen.getByText("Nov 4, 26, 3:15 PM")).toBeInTheDocument();
  });

  it("renders both team names", () => {
    render(<TeamCard {...defaultProps} />);
    expect(screen.getByText("IND")).toBeInTheDocument();
    expect(screen.getByText("AUS")).toBeInTheDocument();
  });

  it("renders points", () => {
    render(<TeamCard {...defaultProps} />);
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("Total Points")).toBeInTheDocument();
  });

  it("renders a clickable View Team link when viewHref is provided", () => {
    render(<TeamCard {...defaultProps} viewHref="/dashboard/team/123" />);
    const link = screen.getByText("View Team");
    expect(link).toHaveAttribute("href", "/dashboard/team/123");
  });

  it("renders a disabled View Team button when no viewHref", () => {
    render(<TeamCard {...defaultProps} />);
    const button = screen.getByText("View Team");
    expect(button).toBeDisabled();
  });
});
