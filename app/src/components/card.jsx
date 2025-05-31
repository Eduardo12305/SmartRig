import { useEffect, useState } from "react";
import {
  Card,
  CardContainer,
  PreventCardButton,
  NexteCardButton,
  CardPageWrapper,
  ErrorMessage,
  Carousel,
  Vermais,
} from "./css/card.styled";
import { productsCategory } from "./apiService";
import { useNavigate, useParams } from "react-router-dom";

export function CardPage({ cardsPerView = 3 }) {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsData, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { search } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
    setErrorMessage(""); // Limpa erro antes de nova tentativa
    try {
      let response;

      // Busca com ou sem filtro
      if (search && search.trim() !== "") {
        response = await productsCategory("search",{ name: search });
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
      setErrorMessage(error.message || "Erro ao carregar cards");
    }
  };
    fetchProducts(); // Executa sempre que o parâmetro de busca mudar
  }, [search]);

  const handleCardClick = (id) => {
    navigate(`/produto/${id}`);
  };

  const nextCard = () => {
    setStartIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex + cardsPerView > cardsData.length
        ? prevIndex
        : nextIndex;
    });
  };

  const prevCard = () => {
    setStartIndex((prevIndex) =>
      prevIndex - 1 < 0 ? prevIndex : prevIndex - 1
    );
  };

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
          {cardsData
            .slice(startIndex, startIndex + cardsPerView)
            .map((card) => (
              <Card
                key={card.id}
                padding={card.padding}
                border={card.border}
                margin={card.margin}
                colorh2={card.colorh2}
                onClick={() => handleCardClick(card.id)}
              >
                <img
                  src={card.image}
                  alt={card.name}
                />
                <div className="name">
                   <p>{card.name}</p>
                </div>
                <div className="sale-info">
                {card.prices[0].sale ? (<div className="old">R$ {card.prices[0].old_price}</div>) : null}
                <h2>R$ {card.prices[0].price}   {card.prices[0].sale ? (<span className="discount">-{card.prices[0].sale_percent}%</span>) : null}</h2> 
                </div>
                
                <Vermais>Ver Mais</Vermais>
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
