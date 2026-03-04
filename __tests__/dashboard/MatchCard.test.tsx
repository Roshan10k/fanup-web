import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MatchCard from "@/app/dashboard/_components/MatchCard";

// Mock the useThemeMode hook
jest.mock("@/app/dashboard/_components/useThemeMode", () => ({
  useThemeMode: () => ({ isDark: false, theme: "light", toggleTheme: jest.fn() }),
}));

describe("MatchCard", () => {
  const defaultProps = {
    league: "IPL",
    date: "Nov 4, 26",
    time: "3:15 PM",
    team1: "IND",
    team2: "AUS",
  };

  it("renders league name", () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText("IPL")).toBeInTheDocument();
  });

  it("renders date and time", () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText("Nov 4, 26, 3:15 PM")).toBeInTheDocument();
  });

  it("renders both team names", () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText("IND")).toBeInTheDocument();
    expect(screen.getByText("AUS")).toBeInTheDocument();
  });

  it("renders VS text when not live", () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("renders LIVE badge when isLive is true", () => {
    render(<MatchCard {...defaultProps} isLive={true} />);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
    expect(screen.queryByText("VS")).not.toBeInTheDocument();
  });

  it("renders default Create Team button with default href", () => {
    render(<MatchCard {...defaultProps} />);
    const link = screen.getByText("Create Team");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard/create-team");
  });

  it("renders custom label and href", () => {
    render(
      <MatchCard
        {...defaultProps}
        createLabel="Edit Team"
        createHref="/dashboard/create-team?matchId=123"
      />
    );
    const link = screen.getByText("Edit Team");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard/create-team?matchId=123");
  });
});
