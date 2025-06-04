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
import {
  StyledHeader,
  FlexContainer,
  IconSoft,
  Nav,
  NavItem,
  LinkWithText,
  IconImage,
  Name,
  NavItemButton,
  ModalContent,
  NavList,
  NavItemMenu,
  SearchGroup,
  SearchBar,
  TopRightGroup,
  MenuLine,
  MenuButton,
} from "../components/css/header.styled";
import { useAuth } from "./auth/authContext";
import { decodeToken } from "./auth/authToken";
//import { SearchHeader } from "./search";

export function Header() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | 'menu' | null
  const [eventSearch, setEventSearch] = useState("");
  const { isLoggedIn, user, login, logout } = useAuth();
  // Verificar se o usuário está logado ao carregar o componente
  const openUserMenuModal = () => {
    setActiveModal((prev) => (prev === "userMenu" ? null : "userMenu"));
  };
  const NewpcClick = () => {
    navigate("/produtos/monte-seu-pc");
    closeModal();
  };

  const CategoryClick = (category) => {
    navigate(`/produtos/${category}/`);
  };

  const handleSearch = (search) => {
    navigate(`/produtos/search/${search}`);
  };

  // Após login com sucesso
  const handleLoginSuccess = (response) => {
    let userData, token;

    if (response.access) {
      token = response.access;
      userData = decodeToken(token) || {};
    } else if (response.user && response.token) {
      userData = response.user;
      token = response.token;
    } else if (response.token) {
      token = response.token;
      userData = { ...response };
      delete userData.token;
    } else {
      userData = response;
      token = null;
    }
    console.log("Login: userData", userData, "token", token);
    login(userData, token);
    closeModal();
  };

  const buildSave = () => {
    navigate("/produtos/monte-seu-pc");
    closeModal();
  };

  const handleLogout = () => {
    logout();
    closeModal();
    navigate("/");
  };

  const getDisplayName = () => {
    if (!user) return "Usuário";
    return (
      user.name ||
      user.username ||
      user.first_name ||
      user.email?.split("@")[0] ||
      "Usuário"
    );
  };

  const openLoginModal = () => setActiveModal("login");
  const openRegisterModal = () => setActiveModal("register");
  const openMenuModal = () => {
    setActiveModal((prev) => (prev === "menu" ? null : "menu"));
  };
  const closeModal = () => setActiveModal(null);

  return (
    <>
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
              if (e.key === "Enter" && eventSearch.trim() !== "") {
                handleSearch(eventSearch);
              }
            }}
          />
        </SearchGroup>
        <TopRightGroup>
          {!isLoggedIn ? (
            <>
              <NavItemButton buttoncolor="#FF8C00" onClick={openLoginModal}>
                Login
              </NavItemButton>
              <NavItemButton onClick={openRegisterModal}>
                Registrar
              </NavItemButton>
            </>
          ) : (
            <NavItemButton $buttoncolor="#28a745" onClick={openUserMenuModal}>
              Olá, {getDisplayName()}
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
      {activeModal === "login" && (
        <LoginModal
          onClose={closeModal}
          onSwitchToRegister={() => setActiveModal("register")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {activeModal === "register" && (
        <RegisterModal
          onClose={closeModal}
          onSwitchToLogin={() => setActiveModal("login")}
        />
      )}
      </StyledHeader>
      <ModalContent $active={activeModal === "userMenu"}>
        <NavList>
          <NavItemMenu>
            <LinkWithText
              onClick={() => {
                navigate("/perfil");
                closeModal();
              }}
            >
              <Name>👤 Meu Perfil</Name>
            </LinkWithText>
          </NavItemMenu>
          <NavItemMenu>
            <LinkWithText
              onClick={() => {
                navigate("/favoritos");
                closeModal();
              }}
            >
              <Name>⭐ Builds Favoritas</Name>
            </LinkWithText>
          </NavItemMenu>
          <NavItemMenu>
            <LinkWithText onClick={handleLogout}>
              <Name>🚪 Sair</Name>
            </LinkWithText>
          </NavItemMenu>
        </NavList>
      </ModalContent>

      <ModalContent $active={activeModal === "menu"}>
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
            <LinkWithText onClick={() => NewpcClick()}>
              <IconImage src={logoComputer} alt="Monte seu PC" />
              <Name>Monte seu PC</Name>
            </LinkWithText>
          </NavItemMenu>
        </NavList>
      </ModalContent>
      </>
  );
}
