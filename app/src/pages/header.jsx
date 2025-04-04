import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoSmartRig.png";
import logoprocess from "../assets/logoProcess.svg";
import logoPalca from "../assets/logoVideoCard.svg";
import logoMotherBorad from "../assets/logoMotherboard.svg";
import logoMemory from "../assets/logoMemory.svg";
import logoPowerSupply from "../assets/logoPowerSupply.png";
import logoComputer from "../assets/logoComputer.svg";
import { LoginModal } from "../components/loginModal";
import { RegisterModal } from "../components/registerModal"; 
import { StyledHeader, FlexContainer, IconSoft, Nav, NavList, NavItem, LinkWithText, IconImage, Name } from "../components/css/header.styled";

export function Header() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | null

    const handleClick = () => {
        navigate('/register');
    };

    const openLoginModal = () => setActiveModal('login');
    const openRegisterModal = () => setActiveModal('register');
    const closeModal = () => setActiveModal(null);

    return (
        <StyledHeader>
            <FlexContainer>
                <IconSoft src={logo} alt="Logo" />
                <div>
                    <input type="search" placeholder="Pesquisar Produto ..." />
                </div>
                <Nav>
                    <NavList>
                        <NavItem>
                            <LinkWithText onClick={handleClick}>
                                <IconImage src={logoprocess} alt="Processador" />
                                <Name>Processador</Name>
                            </LinkWithText>
                        </NavItem>
                        <NavItem>
                            <LinkWithText onClick={handleClick}>
                                <IconImage src={logoPalca} alt="Placa de Vídeo" />
                                <Name>Placa de Vídeo</Name>
                            </LinkWithText>
                        </NavItem>
                        <NavItem>
                            <LinkWithText onClick={handleClick}>
                                <IconImage src={logoMotherBorad} alt="Placa Mãe" />
                                <Name>Placa Mãe</Name>
                            </LinkWithText>
                        </NavItem>
                        <NavItem>
                            <LinkWithText onClick={handleClick}>
                                <IconImage src={logoMemory} alt="Memórias" />
                                <Name>Memórias</Name>
                            </LinkWithText>
                        </NavItem>
                        <NavItem>
                            <LinkWithText onClick={handleClick}>
                                <IconImage src={logoPowerSupply} alt="Fonte" />
                                <Name>Fontes</Name>
                            </LinkWithText>
                        </NavItem>
                        <NavItem>
                            <LinkWithText onClick={handleClick}>
                                <IconImage src={logoComputer} alt="Monte seu PC" />
                                <Name>Monte seu PC</Name>
                            </LinkWithText>
                        </NavItem>
                        <NavItem>
                            <button onClick={openLoginModal}>Login</button>
                        </NavItem>
                        <NavItem>
                            <button onClick={openRegisterModal}>Registrar</button>
                        </NavItem>
                    </NavList>
                </Nav>
            </FlexContainer>

            {/* Renderização condicional dos modais */}
            {activeModal === 'login' && (
                <LoginModal 
                    onClose={closeModal}
                    onSwitchToRegister={() => setActiveModal('register')}
                />
            )}
            {activeModal === 'register' && (
                <RegisterModal 
                    onClose={closeModal}
                    onSwitchToLogin={() => setActiveModal('login')}
                />
            )}
        </StyledHeader>
    );
}