import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("redireciona para o login quando não autenticado", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /^órbita$/i })
    ).toBeInTheDocument();
  });
});
