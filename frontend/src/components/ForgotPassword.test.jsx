import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../contexts/AppContext";
import ForgotPassword from "./ForgotPassword";
import axios from "axios";

jest.mock("axios");

const MockForgotPassword = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <ForgotPassword />
      </AppProvider>
    </BrowserRouter>
  );
};

describe("ForgotPassword Component", () => {
  test("renders forgot password form", () => {
    render(<MockForgotPassword />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeInTheDocument();
  });

  test("displays error message for empty email field", async () => {
    render(<MockForgotPassword />);
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test("displays error for invalid email format", async () => {
    render(<MockForgotPassword />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
  });

  test("submits form with valid email", async () => {
    axios.post.mockResolvedValue({ data: { message: "Reset link sent" } });

    render(<MockForgotPassword />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/password-reset", {
        email: "test@example.com",
      });
      expect(
        screen.getByText(/password reset link sent to your email/i)
      ).toBeInTheDocument();
    });
  });

  test("displays error when reset link fails to send", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    render(<MockForgotPassword />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/failed to send reset link. please try again/i)
      ).toBeInTheDocument();
    });
  });
});
