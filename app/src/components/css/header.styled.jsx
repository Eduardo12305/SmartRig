import styled from "styled-components";

// Estilos para o Header principal
export const StyledHeader = styled.header`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.4em 0.5rem;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999; /* garantir que fique acima do menu modal */
  background-color: rgb(33, 33, 33);
  font-family: "Poppins", sans-serif;
  box-sizing: border-box;
`;

// Estilo para o conteúdo principal
export const MainContent = styled.main`
  margin-top: 80px; /* Altura estimada do header */
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    margin-top: 100px; /* Ajuste para telas menores, caso o header seja mais alto */
  }
`;

// FlexContainer para agrupar logo e barra de pesquisa
export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// Estilos para a navegação (botões e itens)
export const Nav = styled.nav`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
`;

export const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column; /* Por padrão, os itens ficam em coluna */
  flex-wrap: wrap; /* Permite que quebrem linha em telas pequenas */
  gap: 1rem; /* Espaçamento entre os itens */
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;
  width: 100%; /* Garante que a lista ocupe toda a largura disponível */

  @media (min-width: 640px) {
    flex-direction: row; /* Quando a tela atingir 640px ou mais, itens ficam em linha */
  }
`;

export const NavItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  width: calc(50% - 1rem); /* Cada item ocupa 1/3 da largura */
  max-width: 80px; /* Define um tamanho máximo para os itens */
  text-align: center;
`;

export const NavItemMenu = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px; /* Definindo uma largura fixa para cada item */
  max-width: 150px; /* Garantindo que o item não ultrapasse 150px */
  text-align: center;

  @media (max-width: 639px) {
    width: 100%; /* Para telas menores que 640px, os itens ocupam toda a largura */
    max-width: none; /* Remove o limite de largura para telas menores */
  }
`;

export const NavItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.buttoncolor || "#007bff"};
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  flex-direction: row;
  transition: background-color 0.3s;

  &:hover {
    color: ${(props) => props.buttoncolor || "#007bff"};
    background-color: transparent;
    box-shadow: 0 0 0 1px ${(props) => props.buttoncolor || "#007bff"} inset;
  }
`;

export const LinkWithText = styled.button`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  gap: 0.25rem;
  padding: 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;

  &:hover {
    transform: scale(1.05);

  }
`;

export const IconSoft = styled.img`
  width: 78px;
  height: auto;
  border-radius: 20%;
  object-fit: cover;
  cursor: pointer;
`;

export const IconImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 20%;
  object-fit: cover;
`;

export const Name = styled.p`
  font-size: 1.1rem;
  margin: 0;
  color: #030303;
  text-align: center;
  white-space: nowrap;
`;

export const ModalContent = styled.div`
  position: fixed;
  top: 145px;
  background-color: orange;
  left: 0;
  padding: 1.5rem;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-evenly;
  z-index: 1;
  text-align: center;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  opacity: ${(props) => (props.$active ? 1 : 0)};
  transform: ${(props) =>
    props.$active ? "translateY(0)" : "translateY(-145px)"};
  pointer-events: ${(props) => (props.$active ? "auto" : "none")};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

export const SearchBar = styled.input`
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  padding: 0.8rem 1.5rem; // Altura não esqueça de novo
  font-size: 1rem;
  width: 350px; // Largura não esqueça de novo
  max-width: 100%;
  border: none;
  border-radius: 5px;
`;

export const SearchGroup = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
  margin: 1rem 0;
`;

export const TopRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const MenuLine = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const MenuButton = styled.button`
  color: orange;
  background-color: transparent;
  transition: color 0.3s, background-color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: rgb(33, 33, 33);
    background-color: #ff8c00;
    border-color: transparent;
  }
`;
;
