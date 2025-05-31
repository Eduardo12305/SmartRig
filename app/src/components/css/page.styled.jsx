import { createGlobalStyle } from "styled-components";

export const StyleBody = createGlobalStyle`
  /* Garante que o HTML e BODY ocupem 100% da altura e largura da janela */
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  /* Aplica o box-sizing para todo o conteúdo, para que padding e bordas sejam contados dentro das larguras e alturas */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    background-color: ${(props) =>
      props.color ? props.color : "#f8f9fa"}; /* Cor de fundo personalizada */
    min-height: 100vh; /* Garante que o body ocupe pelo menos toda a altura da tela */
    display: flex;
    flex-direction: column;
  }

  /* Garante que o conteúdo não ultrapasse os limites da tela */
  #root {
    flex-grow: 1; /* Faz o root ocupar o restante do espaço disponível */
    width: 100%;
  }
  
  /* Reseta o scroll horizontal */
  body, html {
    overflow-x: hidden; /* Impede o scroll horizontal */
  }
`;
