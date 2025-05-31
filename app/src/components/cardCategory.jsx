import { useEffect, useState } from "react";
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

  const categoryNames = {
    cpu: "Processadores",
    gpu: "Placas de Vídeo",
    mobo: "Placas Mãe",
    ram: "Memórias RAM",
    psu: "Fontes de Alimentação",
    storage: "Armazenamento",
  };

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await productsCategory(category);
        const data = response?.data?.data || [];

        if (!ignore) {
          setProducts(data.map((p) => ({ ...p, id: p.uid })));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Erro ao carregar produtos da categoria");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (category) {
      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, [category]);

  const formatPrice = (price) => {
    if (!price) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleCardClick = (id) => {
    navigate(`/produto/${id}`);
  };

  if (errorMessage) {
    return (
      <ErrorWrapper>
        <h2>Erro ao carregar produtos</h2>
        <p>{errorMessage}</p>
        <button onClick={() => window.location.reload()}>Tentar Novamente</button>
      </ErrorWrapper>
    );
  }

  if (loading) {
    return (
      <ErrorWrapper>
        <h2>Categoria: {categoryNames[category] || category?.toUpperCase()}</h2>
        <p>Carregando produtos...</p>
        <LoadingSpinner />
      </ErrorWrapper>
    );
  }

return (
    <PageWrapper>
      <CategoryHeader>
        <CategoryTitle>{categoryNames[category] || category?.toUpperCase()}</CategoryTitle>
        <ProductCount>
          {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
        </ProductCount>
      </CategoryHeader>

      <GridContainer $cardsPerRow={cardsPerRow}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} onClick={() => handleCardClick(product.id)}>
              {product.image && <ProductImage src={product.image} alt={product.name} />}
              <ProductName>{product.name}</ProductName>

              {product.prices && product.prices[0] && (
                <ProductPrice>
                  {product.prices[0].sale && (
                    <OldPrice>{formatPrice(product.prices[0].old_price)}</OldPrice>
                  )}
                  {formatPrice(product.prices[0].price)}
                  {product.prices[0].sale && (
                    <DiscountLabel>-{product.prices[0].sale_percent}%</DiscountLabel>
                  )}
                </ProductPrice>
              )}

              <SeeMore>Ver Mais →</SeeMore>
            </ProductCard>
          ))
        ) : (
          <ErrorWrapper>
            <h3>Nenhum produto encontrado</h3>
            <p>Não há produtos disponíveis nesta categoria no momento.</p>
          </ErrorWrapper>
        )}
      </GridContainer>
    </PageWrapper>
  );
};
