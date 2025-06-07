import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes, css } from 'styled-components';
import { productsCategory } from "./apiService";

// Animações
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styled Components
const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CategoryHeader = styled.header`
  text-align: center;
  margin-bottom: 48px;
  padding: 48px 32px;
  background: linear-gradient(135deg, 
    rgba(255, 107, 53, 0.08) 0%, 
    rgba(46, 134, 171, 0.08) 50%,
    rgba(255, 107, 53, 0.05) 100%
  );
  border-radius: 24px;
  border: 1px solid rgba(255, 107, 53, 0.15);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.4), 
      transparent
    );
    animation: ${shimmer} 3s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    padding: 32px 20px;
    margin-bottom: 32px;
    border-radius: 20px;
  }
`;

const CategoryTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #FF6B35 0%, #2E86AB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const ProductCount = styled.div`
  font-size: 1.125rem;
  color: #555;
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    flex-direction: column;
    gap: 8px;
  }
`;

const CountBadge = styled.span`
  background: linear-gradient(135deg, #FF6B35 0%, #2E86AB 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 8px;
  
  ${props => props.cardsPerRow && css`
    grid-template-columns: repeat(${props.cardsPerRow}, 1fr);
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }
    
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  `}
  
  @media (max-width: 768px) {
    gap: 24px;
    padding: 0;
  }
`;

const ProductCard = styled.article`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  cursor: pointer;
  animation: ${slideUp} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 
      0 32px 64px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 107, 53, 0.1);
  }
  
  &:active {
    transform: translateY(-8px) scale(1.01);
  }
  
  &:focus {
    outline: none;
    box-shadow: 
      0 32px 64px rgba(0, 0, 0, 0.15),
      0 0 0 3px rgba(46, 134, 171, 0.3);
  }
  
  @media (max-width: 768px) {
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-6px) scale(1.01);
    }
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.03));
    pointer-events: none;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  
  ${ProductCard}:hover & {
    transform: scale(1.08);
  }
`;

const ProductInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  position: relative;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
  
  ${ProductCard}:hover & {
    color: #FF6B35;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2E86AB;
  margin: 0;
  line-height: 1;
`;

const OldPrice = styled.div`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 500;
  opacity: 0.8;
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductBadge = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const NewBadge = styled(ProductBadge)`
  background: linear-gradient(135deg, #FF6B35, #FF8A65);
  color: white;
`;

const BestSellerBadge = styled(ProductBadge)`
  background: linear-gradient(135deg, #2E86AB, #42A5F5);
  color: white;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #E74C3C, #EC7063);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  
  span {
    font-size: 1rem;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const RatingText = styled.span`
  color: #666;
  font-size: 0.75rem;
  font-weight: 500;
`;

const StockIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => 
    props.stock > 10 ? '#27ae60' : 
    props.stock > 0 ? '#f39c12' : 
    '#e74c3c'
  };
`;

const StockDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => 
    props.stock > 10 ? '#27ae60' : 
    props.stock > 0 ? '#f39c12' : 
    '#e74c3c'
  };
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SeeMoreButton = styled.button`
  background: ${props => props.categoryColor || 'linear-gradient(135deg, #FF6B35 0%, #2E86AB 100%)'};
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  margin: 8px 0 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
  
  ${ProductCard}:hover & {
    opacity: 1;
  }
`;

const HoverText = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(10px);
  transition: transform 0.3s ease;
  
  ${ProductCard}:hover & {
    transform: translateY(0);
  }
`;

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  
  > div {
    background: linear-gradient(135deg, #FF6B35 0%, #2E86AB 100%);
    color: white;
    padding: 48px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    max-width: 500px;
    
    h2 {
      margin: 0 0 16px 0;
      font-size: 1.75rem;
      font-weight: 700;
    }
    
    p {
      margin: 0 0 32px 0;
      opacity: 0.9;
      font-size: 1.125rem;
      line-height: 1.5;
    }
  }
`;

const RetryButton = styled.button`
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 107, 53, 0.2);
  border-top: 4px solid #FF6B35;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

const NoProductsContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, 
    rgba(255, 107, 53, 0.05) 0%, 
    rgba(46, 134, 171, 0.05) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(255, 107, 53, 0.1);
  
  .icon {
    font-size: 4rem;
    margin-bottom: 24px;
    opacity: 0.6;
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  h3 {
    color: #2c3e50;
    margin: 0 0 12px 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 1.125rem;
    line-height: 1.6;
  }
`;

export const CategoryCard = ({ cardsPerRow = 4 }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mapeamento de categorias com fallback seguro
  const categoryNames = {
    cpu: "Processadores",
    gpu: "Placas de Vídeo",
    mobo: "Placas Mãe",
    ram: "Memórias RAM",
    psu: "Fontes de Alimentação",
    storage: "Armazenamento",
  };

  // Cores dos badges por categoria
  const categoryColors = {
    cpu: "linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)",
    gpu: "linear-gradient(135deg, #2E86AB 0%, #42A5F5 100%)",
    mobo: "linear-gradient(135deg, #A23B72 0%, #C2185B 100%)",
    ram: "linear-gradient(135deg, #F18F01 0%, #FFA726 100%)",
    psu: "linear-gradient(135deg, #C73E1D 0%, #F44336 100%)",
    storage: "linear-gradient(135deg, #1B263B 0%, #37474F 100%)",
  };

  // Função para recarregar a página de forma segura em qualquer ambiente
  const handleReload = useCallback(() => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    } else {
      setLoading(true);
      setErrorMessage("");
    }
  }, []);

  // Função para buscar dados com tratamento de erro robusto
  const fetchData = useCallback(async () => {
    if (!category) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await productsCategory(category);
      
      const data = response?.data?.data;
      
      if (!Array.isArray(data)) {
        throw new Error("Formato de dados inválido recebido do servidor");
      }

      // Mapear produtos com validação de propriedades e dados simulados
      const mappedProducts = data.map((product, index) => ({
        ...product,
        id: product.uid || product.id || `product-${index}`,
        name: product.name || "Produto sem nome",
        image: product.image || null,
        prices: Array.isArray(product.prices) ? product.prices : [],
        // Dados simulados para demonstração
        stock: product.stock || Math.floor(Math.random() * 50) + 1,
        isNew: product.isNew || Math.random() > 0.7,
        isBestSeller: product.isBestSeller || Math.random() > 0.8,
        rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      
      let errorMsg = "Erro ao carregar produtos da categoria";
      
      if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
        errorMsg = "Erro de conexão. Verifique sua internet.";
      } else if (error.status === 404) {
        errorMsg = "Categoria não encontrada.";
      } else if (error.status >= 500) {
        errorMsg = "Erro no servidor. Tente novamente mais tarde.";
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  // Formatação de preço compatível com diferentes locales
  const formatPrice = useCallback((price) => {
    if (!price || isNaN(price)) return "R$ 0,00";
    
    try {
      if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(price));
      } else {
        return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
      }
    } catch (error) {
      console.warn("Erro na formatação de preço:", error);
      return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
    }
  }, []);

  // Navegação com validação
  const handleCardClick = useCallback((id) => {
    if (id && navigate) {
      try {
        navigate(`/produto/${encodeURIComponent(id)}`);
      } catch (error) {
        console.error("Erro na navegação:", error);
      }
    }
  }, [navigate]);

  // Obter nome da categoria de forma segura
  const getCategoryDisplayName = useCallback(() => {
    if (!category) return "Categoria";
    return categoryNames[category.toLowerCase()] || category.toUpperCase();
  }, [category, categoryNames]);

  // Obter cor da categoria
  const getCategoryColor = useCallback(() => {
    return categoryColors[category?.toLowerCase()] || categoryColors.cpu;
  }, [category]);

  // Gerar estrelas para rating
  const renderStars = useCallback((rating) => {
    const stars = [];
    const numRating = parseFloat(rating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<span key={i} style={{ color: "#FFD700" }}>★</span>);
      } else if (i - 0.5 <= numRating) {
        stars.push(<span key={i} style={{ color: "#FFD700" }}>☆</span>);
      } else {
        stars.push(<span key={i} style={{ color: "#DDD" }}>☆</span>);
      }
    }
    
    return stars;
  }, []);

  // Renderização de erro
  if (errorMessage) {
    return (
      <ErrorWrapper>
        <div>
          <h2>🚨 Ops! Algo deu errado</h2>
          <p>{errorMessage}</p>
          <RetryButton onClick={handleReload}>
            🔄 Tentar Novamente
          </RetryButton>
        </div>
      </ErrorWrapper>
    );
  }

  // Renderização de loading
  if (loading) {
    return (
      <PageWrapper>
        <CategoryHeader>
          <CategoryTitle>{getCategoryDisplayName()}</CategoryTitle>
          <ProductCount>
            Carregando produtos incríveis...
            <LoadingSpinner />
          </ProductCount>
        </CategoryHeader>
      </PageWrapper>
    );
  }

  // Renderização principal
  return (
    <PageWrapper>
      <CategoryHeader>
        <CategoryTitle>{getCategoryDisplayName()}</CategoryTitle>
        <ProductCount>
          <CountBadge>{products.length}</CountBadge>
          produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
        </ProductCount>
      </CategoryHeader>

      <GridContainer cardsPerRow={cardsPerRow}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id}
              onClick={() => handleCardClick(product.id)}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(product.id);
                }
              }}
            >
              {/* Badges */}
              <BadgeContainer>
                {product.isNew && <NewBadge>Novo</NewBadge>}
                {product.isBestSeller && <BestSellerBadge>⭐ Mais Vendido</BestSellerBadge>}
              </BadgeContainer>

              {/* Desconto Badge */}
              {product.prices?.[0]?.sale && product.prices[0].sale_percent && (
                <DiscountBadge>
                  -{product.prices[0].sale_percent}%
                </DiscountBadge>
              )}

              <ProductImageContainer>
                {product.image ? (
                  <ProductImage 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    color: '#adb5bd',
                    fontSize: '3rem',
                    opacity: 0.5
                  }}>
                    📦
                  </div>
                )}
                
                {/* Hover Overlay */}
                <HoverOverlay>
                  <HoverText>👁️ Ver Detalhes</HoverText>
                </HoverOverlay>
              </ProductImageContainer>

              <ProductInfo>
                <ProductName>{product.name}</ProductName>

                {/* Rating */}
                <RatingContainer>
                  <Stars>
                    {renderStars(product.rating)}
                  </Stars>
                  <RatingText>({product.rating})</RatingText>
                </RatingContainer>

                {/* Preços */}
                {product.prices && product.prices[0] && (
                  <PriceContainer>
                    {product.prices[0].sale && product.prices[0].old_price && (
                      <OldPrice>{formatPrice(product.prices[0].old_price)}</OldPrice>
                    )}
                    <ProductPrice>{formatPrice(product.prices[0].price)}</ProductPrice>
                  </PriceContainer>
                )}

                {/* Stock Indicator */}
                <StockIndicator stock={product.stock}>
                  <StockDot stock={product.stock} />
                  {product.stock > 10 ? 'Em estoque' : 
                   product.stock > 0 ? `Apenas ${product.stock} restantes` : 
                   'Fora de estoque'}
                </StockIndicator>

                <SeeMoreButton categoryColor={getCategoryColor()}>
                  Ver Mais Detalhes →
                </SeeMoreButton>
              </ProductInfo>
            </ProductCard>
          ))
        ) : (
          <NoProductsContainer>
            <div className="icon">🔍</div>
            <h3>Nenhum produto encontrado</h3>
            <p>
              Não há produtos disponíveis nesta categoria no momento.<br/>
              Que tal explorar outras categorias?
            </p>
          </NoProductsContainer>
        )}
      </GridContainer>
    </PageWrapper>
  );
};