import styled from "styled-components";

// Container principal da página do produto (coluna e centralizado)
export const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100vw;
  box-sizing: border-box;
  background-color: #ffffff;
`;

// Imagem do produto (preenche a largura total e mantém proporção)
export const ProductImage = styled.img`
  width: 9%;
  height: auto;
  max-height: 75px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
`;

// Container para informações do produto
export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Nome do produto
export const ProductName = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  word-break: break-word;
`;

// Texto geral (marca, socket etc.)
export const ProductText = styled.p`
  font-size: 1rem;
  color: #444;
  margin: 0;
`;

// Preço destacado
export const ProductPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d8f3c;
  margin-top: 12px;
`;
