import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/App";

describe("Login", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("autentica com credenciais válidas e navega para a página protegida", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "roberto.almeida@ademicon.com.br" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "qualquer-senha" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /acessar o órbita/i })
      ).not.toBeInTheDocument();
    });
    expect(localStorage.getItem("orbita:auth")).not.toBeNull();
  });

  it("exibe erro para a credencial de teste inválida", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "roberto.almeida@ademicon.com.br" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "senha-invalida" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText(/e-mail ou senha inválidos/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /acessar o órbita/i })
    ).toBeInTheDocument();
  });
});
