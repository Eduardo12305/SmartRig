import styled from "styled-components";

// Estilos para o Header principal
export const StyledHeader = styled.header` 
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.4em 0.5rem;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999; /* garantir que fique acima do menu modal */
  background-color: rgb(33, 33, 33);
  font-family: 'Poppins', sans-serif;
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

export const NavItemButton = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  button {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 5px;
    background-color: ${props => props.buttoncolor || "#007bff"};
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
    flex-direction: row;
    gap: 1rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: ${props => props.buttoncolor ? "#0056b3" : "#0056b3"};
    }
  }
`;

export const LinkWithText = styled.button`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    color: #ccc;
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

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
`;

export const ModalContent = styled.div`
  position: relative;
  background-color: orange;
  border-radius: 10px;
  padding: 1.5rem;
  width: 95%;
  max-width: 800px; /* Ajuste para acomodar mais itens lado a lado */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column; /* Inicialmente empilhados */
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-wrap: wrap; /* Permite que quebrem linha em telas pequenas */
  
  @media (min-width: 640px) {
    flex-direction: row; /* Alinha os itens em linha a partir de 640px */
    justify-content: space-around; /* Distribui os itens igualmente */
    align-items: center;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: red;
  color: #0b9b0b;
  font-size: 18px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: darkred;
  }
`;

export const SearchBar = styled.input`
  padding: 0.8rem 1.5rem; // Altura não esqueça de novo
  font-size: 1rem;
  width: 350px;   // Largura não esqueça de novo
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
`;