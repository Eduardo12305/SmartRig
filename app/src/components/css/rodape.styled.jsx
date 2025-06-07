import styled from "styled-components";

export const RodapeContainer = styled.footer`
  background-color: #333;
  color: #fff;
  width: 100%;
  font-size: 16px;
  font-family: 'Helvetica', sans-serif;
  padding: 20px 5% 40px 5%;
  left: 0;
  bottom: 0;
  z-index: 100;

  a {
    text-decoration: none;
    color: white;
    margin-bottom: 8px; /* Melhorar a legibilidade dos links */
    transition: color 0.3s;

    &:hover {
      color: #ccc; /* Mudar cor ao passar o mouse */
    }
  }

  p {
    margin-bottom: 5px;
  }
`;

export const RodapeDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Espaça os items de maneira equilibrada */
  gap: 20px; /* Espaçamento entre os RodapeDiv2 */
  width: 100%;
  padding: 10px 0;

  @media (max-width: 640px) {
    justify-content: space-around; /* Alinha os itens com mais espaçamento */
  }
`;

export const RodapeDiv2 = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% / 4 - 20px); /* Tamanho normal para desktop */
  padding: 10px;
  span {
    font-weight: bold;
    margin-bottom: 10px; /* Distância maior entre o título e os links */
  }
  b {
  color: orange;
  }

  @media (max-width: 640px) {
    width: calc(50% - 10px); /* Em telas menores, cada RodapeDiv2 ocupa 50% da largura */
    margin-bottom: 20px; /* Distância entre as seções */
    text-align: center; /* Centraliza o texto */
  }
`;
