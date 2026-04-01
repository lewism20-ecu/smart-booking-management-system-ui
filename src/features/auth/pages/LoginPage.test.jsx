import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  it("renders login fields and submit button", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/john\.doe@example\.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
