import styled from "styled-components";

// Card individual
export const Card = styled.div`
  flex: 0 0 25vw;
  max-width: 25vw;
  background-color: white;
  height: 180px;
  border: 2px solid hsl(0, 1.6%, 24.3%);
  border-radius: 5px;
  box-shadow: 5px 5px 5px hsla(0, 0%, 0%, 0.1);
  padding: ${(prop) => prop.padding || "20px"};
  margin: ${(prop) => prop.margin || "10px"};
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;

  img {
    max-width: 60%;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  h2 {
    font-family: Arial, sans-serif;
    margin: 0;
    color: ${(prop) => prop.colorh2 || "hsl(0, 0%, 20%)"};
    font-size: 12px;
  }

  p {
    font-family: Arial, sans-serif;
    color: hsl(0, 0%, 30%);
    font-size: 10px;
  }

  @media (min-width: 320px) {
    flex: 0 0 25vw;
    max-width: 25vw;

    h2 {
      font-family: Arial, sans-serif;
      margin: 0;
      color: ${(prop) => prop.colorh2 || "hsl(0, 0%, 20%)"};
      font-size: 14px;
    }

    p {
      font-family: Arial, sans-serif;
      color: hsl(0, 0%, 30%);
      font-size: 12px;
    }
  }
  @media (min-width: 425px) {
    flex: 0 0 30vw;
    max-width: 30vw;

    h2 {
      font-family: Arial, sans-serif;
      margin: 0;
      color: ${(prop) => prop.colorh2 || "hsl(0, 0%, 20%)"};
      font-size: 14px;
    }

    p {
      font-family: Arial, sans-serif;
      color: hsl(0, 0%, 30%);
      font-size: 12px;
    }
  }
  @media (min-width: 640px) {
    flex: 0 0 25vw;
    max-width: 25vw;
  }
  @media (min-width: 768px) {
    flex: 0 0 27vw;
    max-width: 27vw;
  }
  @media (min-width: 1024px) {
    flex: 0 0 28vw;
    max-width: 28vw;
  }
  @media (min-width: 1440px) {
    flex: 0 0 29vw;
    max-width: 29vw;
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
  overflow-x: hidden;


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
  left: -20px; /* Afastar mais à esquerda */
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
  right: -40px; /* Afastar mais à direita */
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
  // max-width: 640px;
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
  font-family: "Poppins", sans-serif;
`;
