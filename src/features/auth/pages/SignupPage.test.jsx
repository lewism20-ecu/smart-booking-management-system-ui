import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import SignupPage from "./SignupPage";

describe("SignupPage", () => {
  it("renders create account fields and action", () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/john\.doe@example\.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/create a strong password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/re-enter your password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });
});
