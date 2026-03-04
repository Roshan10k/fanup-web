import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import DeleteModal from "@/app/_components/DeleteModal";

describe("DeleteModal", () => {
  const defaultProps = {
    isOpen: true as boolean | null,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: "Delete User",
    description: "Are you sure you want to delete this user?",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <DeleteModal {...defaultProps} isOpen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when isOpen is null", () => {
    const { container } = render(
      <DeleteModal {...defaultProps} isOpen={null} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders modal with title and description when open", () => {
    render(<DeleteModal {...defaultProps} />);

    expect(screen.getByText("Delete User")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this user?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone", { exact: false })).toBeInTheDocument();
  });

  it("renders Cancel and Delete buttons", () => {
    render(<DeleteModal {...defaultProps} />);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteModal {...defaultProps} />);

    await user.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteModal {...defaultProps} />);

    await user.click(screen.getByText("Delete"));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteModal {...defaultProps} />);

    // Click the backdrop (the outermost div)
    const backdrop = screen.getByText("Delete User").closest(".fixed")!;
    await user.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when isDeleting is true", () => {
    render(<DeleteModal {...defaultProps} isDeleting={true} />);

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("disables buttons when isDeleting", () => {
    render(<DeleteModal {...defaultProps} isDeleting={true} />);

    expect(screen.getByText("Cancel")).toBeDisabled();
    expect(screen.getByText("Deleting...").closest("button")).toBeDisabled();
  });
});
