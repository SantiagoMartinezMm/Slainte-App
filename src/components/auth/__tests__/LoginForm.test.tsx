import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";
import { supabase } from "../../../lib/supabase";

vi.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });

  it("maneja el inicio de sesión con email y contraseña correctamente", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
      error: null,
    });
    vi.spyOn(supabase.auth, "signInWithPassword").mockImplementation(
      mockSignIn,
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("muestra error cuando falla el inicio de sesión", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid credentials" },
    });
    vi.spyOn(supabase.auth, "signInWithPassword").mockImplementation(
      mockSignIn,
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Error al iniciar sesión")).toBeInTheDocument();
    });
  });

  it("maneja el inicio de sesión con Google correctamente", async () => {
    const mockGoogleSignIn = vi.fn().mockResolvedValue({
      data: { provider: "google" },
      error: null,
    });
    vi.spyOn(supabase.auth, "signInWithOAuth").mockImplementation(
      mockGoogleSignIn,
    );

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: /google/i }));

    await waitFor(() => {
      expect(mockGoogleSignIn).toHaveBeenCalledWith({
        provider: "google",
        options: expect.objectContaining({
          redirectTo: expect.stringContaining("/auth/callback"),
        }),
      });
    });
  });

  it("muestra error cuando falla el inicio de sesión con Google", async () => {
    const mockGoogleSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Google auth failed" },
    });
    vi.spyOn(supabase.auth, "signInWithOAuth").mockImplementation(
      mockGoogleSignIn,
    );

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: /google/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Error al iniciar sesión con Google"),
      ).toBeInTheDocument();
    });
  });
});
