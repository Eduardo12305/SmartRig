import { useState } from "react";
import { loginUser } from "./apiService";
import InputField from "./inputField";
import {
  Wrapper,
  Modal,
  CloseButton,
  ErrorMenss,
  Form,
  Cursor,
} from "./css/modal.styled";

export const LoginModal = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const resetFields = () => {
      setEmail("");
      setPassword("");
      setErrorMessage("");
    };

    const handleClose = () => {
      resetFields();
      onClose();
    };

    // Validação básica
    if (!email || !password) {
      setErrorMessage("E-mail e senha são obrigatórios");
      setIsLoading(false);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, insira um e-mail válido");
      setIsLoading(false);
      return;
    }

    // Validação de senha mínima
    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({ email, password });
      if (!response) {
        throw new Error("Resposta inválida do servidor");
      }
      onLoginSuccess(response);
    } catch (error) {
      let errorMsg = "Erro ao tentar fazer login";
      if (error.message) errorMsg = error.message;
      else if (typeof error === "string") errorMsg = error;
      else if (error.error) errorMsg = error.error;
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar mensagem de erro ao digitar
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  return (
    <Wrapper>
      <Modal width="640px" $padd="5rem">
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Fazer Login</h2>
        <Form onSubmit={handleLogin}>
          <InputField
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="seu.email@exemplo.com"
            required
            disabled={isLoading}
            autoComplete="email"
          />
          <InputField
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Digite sua senha"
            required
            disabled={isLoading}
          />

          {errorMessage && (
            <ErrorMenss color="red">⚠️ {errorMessage}</ErrorMenss>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? " Entrando..." : " Entrar"}
          </button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <label>Não tem conta? </label>
            <Cursor
              onClick={onSwitchToRegister}
              style={{
                color: "#FF8C00",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Criar conta
            </Cursor>
          </div>

          <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
            <Cursor
              onClick={() => alert("Funcionalidade de recuperação de senha em desenvolvimento")}
              style={{
                color: "#666",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Esqueceu sua senha?
            </Cursor>
          </div>
        </Form>
      </Modal>
    </Wrapper>
  );
};
