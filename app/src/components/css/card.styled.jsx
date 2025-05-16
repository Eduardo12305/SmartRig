import styled from "styled-components";

// Card individual
export const Card = styled.div`
  background-color: ${(prop) => prop.cardcolor || "aqua"};
  border: 1px solid hsl(0, 1.6%, 24.3%);
  border-radius: ${(prop) => prop.border || "10px"};
  box-shadow: 5px 5px 5px hsla(0, 0%, 0%, 0.1);
  padding: ${(prop) => prop.padding || "20px"};
  margin: ${(prop) => prop.margin || "10px"};
  text-align: center;
  max-width: 200px;
  width: 100%;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;

  img {
    max-width: 60%;
    height: auto;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  h2 {
    font-family: Arial, sans-serif;
    margin: 0;
    color: ${(prop) => prop.colorh2 || "hsl(0, 0%, 20%)"};
    font-size: 1.2rem;
  }

  p {
    font-family: Arial, sans-serif;
    color: hsl(0, 0%, 30%);
    font-size: 0.9rem;
  }

  @media (max-width: 640px) {
    max-width: 180px;
    padding: 15px;
    margin: 5px;
    h2 {
      font-size: 1.1rem;
    }
    p {
      font-size: 0.85rem;
    }
  }
`;

// Container para os cards
export const CardContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  flex: 0 0 180px;

  & > * {
    flex: 0 0 200px;
  }

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  }
`;

// Botão de navegação para os cards (anterior)
export const PreventCardButton = styled.button`
  position: absolute;
  left: -20px;  /* Afastar mais à esquerda */
  top: 50%;
  transform: translateY(-50%);
  z-index: 300; /* Garantir que a seta fique acima de outros elementos */
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: black;
  transition: transform 0.5s ease-in-out;

  &:hover {
    color: gray;
  }

  &:focus {
    outline: none;
  }
`;

// Botão de navegação para os cards (próximo)
export const NexteCardButton = styled.button`
  position: absolute;
  right: -40px;  /* Afastar mais à direita */
  top: 50%;
  transform: translateY(-50%);
  z-index: 300; /* Garantir que a seta fique acima de outros elementos */
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: black;
  transition: transform 0.5s ease-in-out;
  font-size: 1.5;

  &:hover {
    color: gray;
  }

  &:focus {
    outline: none;
  }
`;

// Wrapper da página de cards
export const CardPageWrapper = styled.div`
  padding: 1rem 0.5rem;
  margin-top: 6rem;
  min-height: calc(100vh - 6rem - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  position: relative; /* Manter o contexto de posicionamento para as setas */
`;

// Carousel container (para centralizar o conteúdo)
export const Carousel = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 0 30px;
  box-sizing: border-box;
`;

// Mensagem de erro
export const ErrorMessage = styled.p`
  color: red;
  font-size: 1rem;
  text-align: center;
  margin: 1rem 0;
  font-family: 'Poppins', sans-serif;
`;