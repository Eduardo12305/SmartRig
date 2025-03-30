import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "../components/inputField";
import { registerUser } from "../components/apiService";
export const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!name |!email |!password |!confPassword) {
            setErrorMessage("Todos os campos devem ser preenchidos !");
            return;
        }

        if (password !== confPassword) {
            setErrorMessage("As senhas não coincidem");
            return;
        }

        try {
            await registerUser({name, email, password, confPassword})
            navigate('/')
        } catch (error) {
            setErrorMessage(error.message || "Erro ao cadastrar");
        }
    }

    return (
        <>
            <form onSubmit={handleRegister}>
                    <h2>Cadastro</h2>
                    <div>
                    <InputField id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" required />
                    <InputField id="email" label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required type="email" />
                    <InputField id="password" label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required type="password" />
                    <InputField id="confirmPassword" label="Confirmar Senha" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} placeholder="Confirmar Senha" required type="password" />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit">Cadastrar</button>
            </form>
        </>
    )
}