import styled, { keyframes } from "styled-components";

export const PageWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const CategoryHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const CategoryTitle = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

export const ProductCount = styled.p`
  color: #2980b9;
  font-size: 1.2rem;
  font-weight: bold;
`;

export const GridContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(${props => props.$cardsPerRow || 4}, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;


export const ProductCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const ProductName = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const ProductPrice = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #e74c3c;
`;

export const OldPrice = styled.div`
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #999;
`;

export const DiscountLabel = styled.span`
  margin-left: 8px;
  font-size: 0.9rem;
  color: #27ae60;
`;

export const SeeMore = styled.div`
  text-align: right;
  margin-top: 1rem;
  color: #3498db;
  font-weight: 500;
`;

export const ErrorWrapper = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;

  h2 {
    color: red;
  }

  p {
    margin-top: 0.5rem;
  }

  button {
    margin-top: 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 1rem auto;
`;
