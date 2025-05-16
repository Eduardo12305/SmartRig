import { useEffect, useState } from "react";
import {
  Card,
  CardContainer,
  PreventCardButton,
  NexteCardButton,
  CardPageWrapper,
  ErrorMessage,
  Carousel,
} from "./css/card.styled";
import { productscard } from "./apiService";
import { useNavigate } from "react-router-dom";

export function CardPage({ cardsPerView = 3 }) {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsData, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setErrorMessage(""); // Reseta mensagem de erro ao tentar carregar os dados
    try {
      const response = await productscard();
      const data = response.data?.data || [];
      const dataWithId = data.map((card) => ({
        ...card,
        id: `${card.name}-${crypto.randomUUID()}`,
      }));
      setCards(dataWithId);
    } catch (error) {
      setErrorMessage(error.message || "Erro ao carregar cards");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/produto/${id}`);
  };

  useEffect(() => {
    fetchProducts(); // Carrega os dados ao montar o componente
  }, []);

  const nextCard = () => {
    setStartIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex + cardsPerView > cardsData.length ? prevIndex : nextIndex;
    });
  };

  const prevCard = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 < 0 ? prevIndex : prevIndex - 1));
  };


  // Verifica se as setas de navegação devem ser exibidas
  const showPrevButton = startIndex > 0;
  const showNextButton = startIndex + cardsPerView < cardsData.length;

  return (
    <CardPageWrapper>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Carousel>
        {showPrevButton && (
          <PreventCardButton onClick={prevCard} aria-label="Previous cards">
            ←
          </PreventCardButton>
        )}

        <CardContainer>
          {cardsData.slice(startIndex, startIndex + cardsPerView).map((card) => (
            <Card
              key={card.id}
              padding={card.padding}
              border={card.border}
              margin={card.margin}
              colorh2={card.colorh2}
              onClick={() => handleCardClick(card.id)}
            >
              <h2>{card.name}</h2>
              <p>{card.text}</p>
              <p>{card.price}</p>
            </Card>
          ))}
        </CardContainer>

        {showNextButton && (
          <NexteCardButton onClick={nextCard} aria-label="Next cards">
            →
          </NexteCardButton>
        )}
      </Carousel>
    </CardPageWrapper>
  );
}