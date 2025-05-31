import styled from "styled-components";

// Card individual
export const Vermais = styled.button`
    background-color: #ff8c00;
    margin-bottom: 10px;
    display: block;
    color: white;
    border: none;
    aling-self: center;
    text-align: center;
    border-radius: 5px;
    margin-right: 20px;
    margin-left: 20px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background 0.3s ease;

    &:houver {background-color: white;
    color: #ff8c00;
    box-shadow: 0 0 0 1px #ff8c00 inset;
    transition: background 0.3s ease;}
    `
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  box-shadow: 5px 5px 5px hsla(0, 0%, 0%, 0.1);
  text-align: left;
  justify-content: space-between;
  width: 250px;
  height: 450px;
  box-sizing: border-box;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 10px 10px 10px hsla(0, 0%, 0%, 0.2);
    transform: scale(1.01);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }


  img {
    display: block;
    padding-top: 5px;
    margin-left: auto;
    margin-right: auto;
    width: 200px;
    height: 200px;
    object-fit: fill;
    border-radius: 5px;
  }

  h2 {
    font-family: Arial, sans-serif;
    display: flex;
    aling-items: center;
    gap: 6px;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0;
    font-weight: bold;
    color: ${(prop) => prop.colorh2 || "#FF8C00"};
    font-size: 28px;
    line-height: 1.2;

    .discount {
      font-size: 16px;
      align-self: center;
      display: inline-block; /* ensures padding and background wrap nicely */
      vertical-align: baseline;
      background: #ff8c00;
      color: white;
      padding: 2px 6px;
      border-radius: 24px;
    }
  }


  .vermais:hover {
    background-color: white;
    color: #ff8c00;
    box-shadow: 0 0 0 1px #ff8c00 inset;
    transition: background 0.3s ease;
  }

  .old {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: Arial, sans-serif;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0;
    color: hsl(0, 0%, 50%);
    font-size: 18px;
    text-decoration: line-through;
  }

  .name{
    min-height: 30px; /* or however tall your name content is */
    display: flex;  
  }

  .sale-info {
    min-height: 50px; /* or however tall your sale content is */
    display: flex;
    flex-direction: column;
    margin: 0;
    align-items: left;
    gap: 8px;
  }

  p {
    font-family: Arial, sans-serif;
    padding-left: 10px;
    line-height: 1.2;
    margin: 5px;
    color: hsl(0, 0%, 30%);
    font-size: 18px;
  }

  @media (max-width: 1024px) {
    max-width: 200px;
    max-height: 350px;
    img {
      aspect-ratio: 1 / 1;
      width: auto;
      height: auto;
      width: 150px;
      height: 150px;
      object-fit: fill;
      border-radius: 5px;
      margin-bottom: 10px;
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
  align-items: center;
  justify-content: space-evenly;  
  width: 100%;
  box-sizing: border-box;


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
  padding: 0 100px;
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
