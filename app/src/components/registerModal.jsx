import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./apiService";
import InputField from "./inputField";
import {
  Wrapper,
  Modal,
  CloseButton,
  ErrorMenss,
  Form,
  Cursor,
} from "./css/modal.styled";
import { LoginModal } from "./loginModal";

export const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !password || !confPassword) {
      setErrorMessage("Todos os campos devem ser preenchidos!");
      return;
    }

    if (password !== confPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    try {
      await registerUser({ name, email, password, confPassword });
      <LoginModal />;
    } catch (error) {
      setErrorMessage(error.message || "Erro ao cadastrar");
    }
  };

  return (
    <Wrapper>
      <Modal width="500px" $padd="5rem">
        <CloseButton onClick={onClose}>x</CloseButton>
        <h2>Register</h2>
        <Form onSubmit={handleRegister}>
          <InputField
            id="name"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            required
          />
          <InputField
            id="email"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
            type="email"
          />
          <InputField
            id="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            type="password"
          />
          <InputField
            id="confirmPassword"
            label="Confirmar Senha"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            placeholder="Confirmar Senha"
            required
            type="password"
          />
          {errorMessage && <ErrorMenss>{errorMessage}</ErrorMenss>}
          <button type="submit">Registrar</button>
          <div>
            <label style={{ color: "black", fontWeight: "normal" }}>
              Já tem conta?{" "}
            </label>
            <Cursor onClick={onSwitchToLogin}>Faça login</Cursor>
          </div>
        </Form>
      </Modal>
    </Wrapper>
  );
};
