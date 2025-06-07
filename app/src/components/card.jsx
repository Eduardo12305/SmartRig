import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";

// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const CardPageWrapper = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #ff8c42, #ff6b1a);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 8px 25px rgba(255, 140, 66, 0.3);
  font-weight: 500;
  text-align: center;
  animation: ${slideIn} 0.5s ease-out;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  flex-direction: column;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1e88e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

const Carousel = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`;

const NavigationButton = styled.button`
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
  z-index: 2;
  
  &:hover {
    transform: translateY(-2px) scale(1.1);
    box-shadow: 0 6px 20px rgba(30, 136, 229, 0.4);
    background: linear-gradient(135deg, #1565c0, #0d47a1);
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CardContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow: hidden;
  flex: 1;
  padding: 10px 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-width: 220px;
  max-width: 280px;
  flex: 1;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: #ff8c42;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-4px) scale(0.98);
  }
  
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 16px;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ProductName = styled.div`
  margin-bottom: 16px;
  
  p {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const SaleInfo = styled.div`
  margin-bottom: 20px;
  
  .old-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
    margin-bottom: 4px;
  }
  
  .current-price {
    font-size: 24px;
    font-weight: bold;
    color: #1e88e5;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .discount {
      background: linear-gradient(135deg, #ff8c42, #ff6b1a);
      color: white;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      animation: ${pulse} 2s infinite;
    }
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #ff8c42, #ff6b1a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: linear-gradient(135deg, #ff6b1a, #e65100);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 140, 66, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    font-size: 24px;
    margin-bottom: 12px;
    color: #333;
  }
  
  p {
    font-size: 16px;
    margin: 0;
  }
`;

const SkeletonCard = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  min-width: 220px;
  max-width: 280px;
  flex: 1;
  
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: ${shimmer} 1.5s infinite;
  }
  
  .skeleton-image {
    width: 100%;
    height: 180px;
    border-radius: 12px;
    margin-bottom: 16px;
  }
  
  .skeleton-text {
    height: 16px;
    border-radius: 4px;
    margin-bottom: 8px;
    
    &.title {
      width: 80%;
      height: 20px;
    }
    
    &.price {
      width: 60%;
      height: 24px;
      margin-top: 16px;
    }
    
    &.button {
      width: 100%;
      height: 44px;
      border-radius: 25px;
      margin-top: 20px;
    }
  }
`;

// Importar sua API service
import { productsCategory } from "./apiService";
import { useNavigate, useParams } from "react-router-dom";

export function CardPage({ cardsPerView = 4 }) {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsData, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { search } = useParams();
  const navigate = useNavigate();
  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      let response;
      
      if (search && search.trim() !== "") {
        response = await productsCategory("search", { name: search });
      } else {
        response = await productsCategory("search");
      }
      
      const data = response.data?.data || [];
      const dataWithId = data.map((card) => ({
        ...card,
        id: card.uid,
      }));
      
      setCards(dataWithId);
    } catch (error) {
      setErrorMessage(error.message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, [search]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const handleCardClick = useCallback((id) => {
    navigate(`/produto/${id}`);
  }, [navigate]);
  
  const nextCard = useCallback(() => {
    setStartIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex + cardsPerView > cardsData.length ? prevIndex : nextIndex;
    });
  }, [cardsPerView, cardsData.length]);
  
  const prevCard = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex - 1 < 0 ? prevIndex : prevIndex - 1));
  }, []);
  
  const visibleCards = useMemo(() => {
    return cardsData.slice(startIndex, startIndex + cardsPerView);
  }, [cardsData, startIndex, cardsPerView]);
  
  const showPrevButton = startIndex > 0;
  const showNextButton = startIndex + cardsPerView < cardsData.length;
  
  const renderSkeletonCards = () => {
    return Array.from({ length: cardsPerView }, (_, index) => (
      <SkeletonCard key={index}>
        <div className="skeleton skeleton-image"></div>
        <div className="skeleton skeleton-text title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text price"></div>
        <div className="skeleton skeleton-text button"></div>
      </SkeletonCard>
    ));
  };
  
  if (loading) {
    return (
      <CardPageWrapper>
        <Carousel>
          <CardContainer>
            {renderSkeletonCards()}
          </CardContainer>
        </Carousel>
      </CardPageWrapper>
    );
  }
  
  if (errorMessage) {
    return (
      <CardPageWrapper>
        <ErrorMessage>
          {errorMessage}
          <button 
            onClick={fetchProducts}
            style={{ 
              marginLeft: '12px', 
              background: 'rgba(255,255,255,0.2)', 
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            Tentar novamente
          </button>
        </ErrorMessage>
      </CardPageWrapper>
    );
  }
  
  if (cardsData.length === 0) {
    return (
      <CardPageWrapper>
        <EmptyState>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar os filtros de busca ou explore outras categorias.</p>
        </EmptyState>
      </CardPageWrapper>
    );
  }
  
  return (
    <CardPageWrapper>
      <Carousel>
        {showPrevButton && (
          <NavigationButton onClick={prevCard} aria-label="Produtos anteriores">
            ←
          </NavigationButton>
        )}
        
        <CardContainer>
          {visibleCards.map((card) => (
            <Card key={card.id} onClick={() => handleCardClick(card.id)}>
              <img src={card.image} alt={card.name} />
              
              <ProductName>
                <p>{card.name}</p>
              </ProductName>
              
              <SaleInfo>
                {card.prices[0].sale && (
                  <div className="old-price">
                    De R$ {card.prices[0].old_price}
                  </div>
                )}
                <h2 className="current-price">
                  R$ {card.prices[0].price}
                  {card.prices[0].sale && (
                    <span className="discount">
                      -{card.prices[0].sale_percent}%
                    </span>
                  )}
                </h2>
              </SaleInfo>
              
              <ActionButton>Ver Detalhes</ActionButton>
            </Card>
          ))}
        </CardContainer>
        
        {showNextButton && (
          <NavigationButton onClick={nextCard} aria-label="Próximos produtos">
            →
          </NavigationButton>
        )}
      </Carousel>
    </CardPageWrapper>
  );
}