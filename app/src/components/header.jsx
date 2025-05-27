import { useState, useEffect } from "react";
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

export function Header() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | 'menu' | 'userMenu' | null
    const [eventSearch, setEventSearch] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Verificar se o usuário está logado ao carregar o componente
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        // Verificar se existe token de autenticação
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('userData');
        
        if (token && user) {
            try {
                const parsedUser = JSON.parse(user);
                setIsLoggedIn(true);
                setUserData(parsedUser);
                console.log("✅ Usuário logado encontrado:", parsedUser);
            } catch (error) {
                console.error("❌ Erro ao parsear dados do usuário:", error);
                // Limpar dados corrompidos
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
    };

    const CategoryClick = (category) => {
        navigate(`/produtos/${category}/`);
        closeModal(); // Fechar modal de menu ao navegar
    }

    const handleSearch = (search) => {
        if (search.trim() !== "") {
            navigate(`/produtos/search/${search}`);
            setEventSearch(""); // Limpar campo de busca após pesquisar
        }
    }

    const openLoginModal = () => setActiveModal('login');
    const openRegisterModal = () => setActiveModal('register');
    const openMenuModal = () => setActiveModal('menu');
    const openUserMenuModal = () => setActiveModal('userMenu');
    const closeModal = () => setActiveModal(null);

    // Função para ser chamada após login bem-sucedido
    const handleLoginSuccess = (response) => {
        console.log("🎉 Login bem-sucedido, processando dados:", response);
        
        // Flexibilidade para diferentes estruturas de resposta da API
        let user, token;
        
        if (response.user && response.token) {
            // Formato: { user: {...}, token: "..." }
            user = response.user;
            token = response.token;
        } else if (response.access_token) {
            // Formato JWT: { access_token: "...", user: {...} }
            token = response.access_token;
            user = response.user || response;
        } else if (response.token) {
            // Formato: { token: "...", name: "...", email: "..." }
            token = response.token;
            user = { ...response };
            delete user.token;
        } else {
            // Assumir que toda resposta contém dados do usuário
            user = response;
            token = response.id?.toString() || Date.now().toString();
        }

        // Salvar dados no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        // Atualizar estado
        setIsLoggedIn(true);
        setUserData(user);
        closeModal();
        
        console.log("✅ Dados salvos com sucesso");
    };

    // Função de logout
    const handleLogout = () => {
        console.log("🚪 Fazendo logout...");
        
        // Remover dados do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Resetar estados
        setIsLoggedIn(false);
        setUserData(null);
        closeModal();
        
        // Redirecionar para home
        navigate('/');
        
        console.log("✅ Logout realizado com sucesso");
    };

    // Função para obter nome de exibição do usuário
    const getDisplayName = () => {
        if (!userData) return 'Usuário';
        
        return userData.name || 
               userData.username || 
               userData.first_name || 
               userData.email?.split('@')[0] || 
               'Usuário';
    };

    return (
        <StyledHeader>
            <FlexContainer>
                <a href="/">
                    <IconSoft src={logo} alt="Logo" />
                </a>
                <SearchGroup>
                    <SearchBar 
                        type="search" 
                        placeholder="Pesquisar Produto ..." 
                        value={eventSearch}  
                        onChange={(e) => setEventSearch(e.target.value)} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(eventSearch);
                            }
                        }}
                    />
                </SearchGroup>
                <TopRightGroup>
                    {!isLoggedIn ? (
                        // Botões de Login e Registro (quando não logado)
                        <>
                            <NavItemButton buttoncolor="#FF8C00">
                                <button onClick={openLoginModal}>Login</button>
                            </NavItemButton>
                            <NavItemButton>
                                <button onClick={openRegisterModal}>Registrar</button>
                            </NavItemButton>
                        </>
                    ) : (
                        // Botão de usuário logado
                        <NavItemButton buttoncolor="#28a745">
                            <button onClick={openUserMenuModal}>
                                Olá, {getDisplayName()}
                            </button>
                        </NavItemButton>
                    )}
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
                    onLoginSuccess={handleLoginSuccess}
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
                            <LinkWithText onClick={() => CategoryClick("cpu")}>
                                <IconImage src={logoprocess} alt="Processador" />
                                <Name>Processador</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => CategoryClick("gpu")}>
                                <IconImage src={logoPalca} alt="Placa de Vídeo" />
                                <Name>Placa de Vídeo</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => CategoryClick("mobo")}>
                                <IconImage src={logoMotherBorad} alt="Placa Mãe" />
                                <Name>Placa Mãe</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => CategoryClick("ram")}>
                                <IconImage src={logoMemory} alt="Memórias" />
                                <Name>Memórias</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => CategoryClick("psu")}>
                                <IconImage src={logoPowerSupply} alt="Fonte" />
                                <Name>Fontes</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => CategoryClick("fonte")}>
                                <IconImage src={logoComputer} alt="Monte seu PC" />
                                <Name>Monte seu PC</Name>
                            </LinkWithText>
                        </NavItemMenu>
                    </NavList>
                </ModalContent>
            )}
            {activeModal === 'userMenu' && (
                <ModalContent>
                    <CloseButton onClick={closeModal}>&times;</CloseButton>
                    <NavList>
                        <NavItemMenu>
                            <LinkWithText onClick={() => { navigate('/perfil'); closeModal(); }}>
                                <Name>👤 Meu Perfil</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => { navigate('/pedidos'); closeModal(); }}>
                                <Name>📦 Meus Pedidos</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => { navigate('/favoritos'); closeModal(); }}>
                                <Name>❤️ Favoritos</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={() => { navigate('/configuracoes'); closeModal(); }}>
                                <Name>⚙️ Configurações</Name>
                            </LinkWithText>
                        </NavItemMenu>
                        <NavItemMenu>
                            <LinkWithText onClick={handleLogout}>
                                <Name>🚪 Sair</Name>
                            </LinkWithText>
                        </NavItemMenu>
                    </NavList>
                </ModalContent>
            )}
        </StyledHeader>
    );
}