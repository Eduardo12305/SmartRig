import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsCategory } from "./apiService";
import {
  PageWrapper,
  CategoryHeader,
  CategoryTitle,
  ProductCount,
  GridContainer,
  ProductCard,
  ProductImage,
  ProductName,
  ProductPrice,
  OldPrice,
  DiscountLabel,
  SeeMore,
  ErrorWrapper,
  LoadingSpinner,
} from "./css/categorycard.styled";

export const CategoryCard = ({ cardsPerRow = 4 }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Mapeamento de categorias com fallback seguro
  const categoryNames = {
    cpu: "Processadores",
    gpu: "Placas de Vídeo",
    mobo: "Placas Mãe",
    ram: "Memórias RAM",
    psu: "Fontes de Alimentação",
    storage: "Armazenamento",
  };

  // Função para recarregar a página de forma segura em qualquer ambiente
  const handleReload = useCallback(() => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    } else {
      // Fallback para ambientes sem window (SSR, testes, etc.)
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
      
      // Validação robusta da resposta
      const data = response?.data?.data;
      
      if (!Array.isArray(data)) {
        throw new Error("Formato de dados inválido recebido do servidor");
      }

      // Mapear produtos com validação de propriedades
      const mappedProducts = data.map((product, index) => ({
        ...product,
        id: product.uid || product.id || `product-${index}`,
        name: product.name || "Produto sem nome",
        image: product.image || null,
        prices: Array.isArray(product.prices) ? product.prices : []
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      
      // Mensagem de erro mais específica baseada no tipo de erro
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
      // Verificar se Intl está disponível (compatibilidade com ambientes mais antigos)
      if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(price));
      } else {
        // Fallback manual para formatação
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

  // Renderização de erro
  if (errorMessage) {
    return (
      <ErrorWrapper>
        <div>
          <h2>Erro ao carregar produtos</h2>
          <p>{errorMessage}</p>
          <button 
            onClick={handleReload}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </ErrorWrapper>
    );
  }

  // Renderização de loading
  if (loading) {
    return (
      <PageWrapper>
        <CategoryHeader>
          <CategoryTitle>Categoria: {getCategoryDisplayName()}</CategoryTitle>
          <ProductCount>Carregando produtos...</ProductCount>
          <LoadingSpinner />
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
          {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
        </ProductCount>
      </CategoryHeader>

      <GridContainer cardsPerRow={cardsPerRow}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id}
              onClick={() => handleCardClick(product.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(product.id);
                }
              }}
            >
              {product.image && (
                <ProductImage 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <ProductName>{product.name}</ProductName>

              {product.prices && product.prices[0] && (
                <div>
                  {product.prices[0].sale && product.prices[0].old_price && (
                    <OldPrice>{formatPrice(product.prices[0].old_price)}</OldPrice>
                  )}
                  <ProductPrice>{formatPrice(product.prices[0].price)}</ProductPrice>
                  {product.prices[0].sale && product.prices[0].sale_percent && (
                    <DiscountLabel>-{product.prices[0].sale_percent}%</DiscountLabel>
                  )}
                </div>
              )}

              <SeeMore>Ver Mais →</SeeMore>
            </ProductCard>
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px 20px' 
          }}>
            <h3>Nenhum produto encontrado</h3>
            <p>Não há produtos disponíveis nesta categoria no momento.</p>
          </div>
        )}
      </GridContainer>
    </PageWrapper>
  );
};