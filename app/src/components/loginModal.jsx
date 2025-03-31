import { loginUser } from "./apiService";
import InputField from "./inputField";
import { useState } from "react";
import {Wrapper, Modal, CloseButton, Form} from '../components/css/modal.styley';

export const LoginModal = () => {
    const [loginModal, setLoginModal] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLoginClick = () => {
        setLoginModal(true);  // Abre o modal
    };

    const handleCloseModal = () => {
        setLoginModal(false);  // Fecha o modal
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("E-mail e senha são obrigatórios");
            return;
        }

        try {
            await loginUser({ email, password });
            // Lógica adicional após login, como redirecionamento
        } catch (error) {
            setErrorMessage(error.message || "Erro ao tentar logar");
        }
    };

    return (
        <div>
            <button onClick={handleLoginClick}>Login</button>

            {loginModal && (
                <Wrapper>
                    <Modal width="850px" padd="5rem">
                        <CloseButton onClick={handleCloseModal}>
                            x
                        </CloseButton>
                        <h2 >Login</h2>
                        <Form onSubmit={handleLogin}>
                            <InputField
                                id="email"
                                label="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seuEmail@exemplo.com"
                                required
                            />
                            <InputField
                                id="password"
                                label="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                required
                            />
                            {errorMessage && (
                                <div className="error-message">{errorMessage}</div>
                            )}
                            <button type="submit">Login</button>
                        </Form>
                    </Modal>
                </Wrapper>
            )}
        </div>
    );
};
