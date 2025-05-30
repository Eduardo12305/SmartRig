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
//import { SearchHeader } from "./search";

export function Header() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState("menu"); // 'login' | 'register' | 'menu' | null

  const CategoryClick = (category) => {
    navigate(`/produtos/${category}/`);
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
          <MenuLine>
            <Nav>
              <NavItem>
                <MenuButton onClick={openMenuModal}>Menu</MenuButton>
              </NavItem>
            </Nav>
          </MenuLine>
          <a href="/">
            <IconSoft src={logo} alt="Logo" />
          </a>

          <TopRightGroup>
            <NavItemButton buttoncolor="#FF8C00" onClick={openLoginModal}>
              Login
            </NavItemButton>
            <NavItemButton onClick={openRegisterModal}>Registrar</NavItemButton>
          </TopRightGroup>
        </FlexContainer>

        {/* Renderização condicional dos modais */}
        {activeModal === "login" && (
          <LoginModal
            onClose={closeModal}
            onSwitchToRegister={() => setActiveModal("register")}
          />
        )}

        {activeModal === "register" && (
          <RegisterModal
            onClose={closeModal}
            onSwitchToLogin={() => setActiveModal("login")}
          />
        )}
      </StyledHeader>
      <ModalContent active={activeModal === "menu"}>
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
    </>
  );
}
