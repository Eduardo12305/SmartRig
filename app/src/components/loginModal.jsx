import { useState } from "react";
import { loginUser } from "./apiService";
import InputField from "./inputField";
import { Wrapper, Modal, CloseButton, ErrorMenss, Form, Cursor } from './css/modal.styled';

export const LoginModal = ({ onClose, onSwitchToRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("E-mail e senha são obrigatórios");
            return;
        }

        try {
            await loginUser({ email, password });
            // Lógica adicional após login (redirecionamento, etc.)
        } catch (error) {
            setErrorMessage(error.message || "Erro ao tentar logar");
        }
    };

    return (
        <Wrapper>
            <Modal width="640px" padd="5rem">
                <CloseButton onClick={onClose}>x</CloseButton>
                <h2>Login</h2>
                <Form onSubmit={handleLogin}>
                    <InputField
                        id="email"
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seuEmail@exemplo.com"
                        required
                    />
                    <InputField
                        id="password"
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                    {errorMessage && <ErrorMenss color="blue">{errorMessage}</ErrorMenss>}
                    <button type="submit">Login</button>

                    <div>
                        <label>Não tem conta? </label>
                        <Cursor onClick={onSwitchToRegister}>
                            Registre-se
                        </Cursor>
                    </div>
                </Form>
            </Modal>
        </Wrapper>
    );
};