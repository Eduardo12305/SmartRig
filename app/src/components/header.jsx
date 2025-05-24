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
import { StyledHeader, FlexContainer, IconSoft, Nav, NavItem, LinkWithText, IconImage, Name, NavItemButton, ModalContent, CloseButton, NavList, NavItemMenu, SearchGroup, SearchBar, TopRightGroup, MenuLine, MenuButton } from "../components/css/header.styled";
//import { SearchHeader } from "./search";

export function Header() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | 'menu' | null
    const [eventSearch, setEventSearch] = useState("");

    const CategoryClick = (category) => {
        navigate(`/produtos/${category}`);
    }

    const handleSearch = (search) => {
        navigate(`/produtos/search/${search}`);
    }

    const openLoginModal = () => setActiveModal('login');
    const openRegisterModal = () => setActiveModal('register');
    const openMenuModal = () => setActiveModal('menu');
    const closeModal = () => setActiveModal(null);

    return (
        <StyledHeader>
            <FlexContainer>
                <a href="/">
                    <IconSoft src={logo} alt="Logo" />
                </a>
                <SearchGroup>
                    <SearchBar type="search" placeholder="Pesquisar Produto ..." value={eventSearch}  
                    onChange={(e) => setEventSearch(e.target.value)} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && eventSearch.trim() !== "") {
                            handleSearch(eventSearch);
                        }
                    }}/>
                </SearchGroup>
                <TopRightGroup>
                    <NavItemButton buttoncolor="#FF8C00">
                        <button onClick={openLoginModal}>Login</button>
                    </NavItemButton>
                    <NavItemButton>
                        <button onClick={openRegisterModal}>Registrar</button>
                    </NavItemButton>
                </TopRightGroup>
            </FlexContainer>

            <MenuLine>
                <Nav>
                    <NavItem>
                        <MenuButton onClick={openMenuModal}>Menu</MenuButton>
                    </NavItem>
                </Nav>
            </MenuLine>

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
            {activeModal === 'menu' && (
                
                    <ModalContent>
                        <CloseButton onClick={closeModal}>&times;</CloseButton>
                        <NavList>
                            <NavItemMenu>
                                
                                <LinkWithText onClick={() => CategoryClick("processador")}>
                                    <IconImage src={logoprocess} alt="Processador" />
                                    <Name>Processador</Name>
                                </LinkWithText>
                            </NavItemMenu>
                            <NavItemMenu>
                                <LinkWithText onClick={() => CategoryClick("placa-de-video")}>
                                    <IconImage src={logoPalca} alt="Placa de Vídeo" />
                                    <Name>Placa de Vídeo</Name>
                                </LinkWithText>
                            </NavItemMenu>
                            <NavItemMenu>
                                <LinkWithText onClick={()=> CategoryClick("placa-mae")}>
                                    <IconImage src={logoMotherBorad} alt="Placa Mãe" />
                                    <Name>Placa Mãe</Name>
                                </LinkWithText>
                            </NavItemMenu>
                            <NavItemMenu>
                                <LinkWithText onClick={()=> CategoryClick("memoria-ram")}>
                                    <IconImage src={logoMemory} alt="Memórias" />
                                    <Name>Memórias</Name>
                                </LinkWithText>
                            </NavItemMenu>
                            <NavItemMenu>
                                <LinkWithText onClick={()=> CategoryClick("fonte")}>
                                    <IconImage src={logoPowerSupply} alt="Fonte" />
                                    <Name>Fontes</Name>
                                </LinkWithText>
                            </NavItemMenu>
                            <NavItemMenu >
                                <LinkWithText onClick={()=> CategoryClick("fonte")}>
                                    <IconImage src={logoComputer} alt="Monte seu PC" />
                                    <Name>Monte seu PC</Name>
                                </LinkWithText>
                            </NavItemMenu>
                        </NavList>
                    </ModalContent>
            )}
        </StyledHeader>
    );
}