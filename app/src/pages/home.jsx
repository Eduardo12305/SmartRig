import { CardPage } from "../components/card";
import { CardPageWrapper } from "../components/css/card.styled";
import {
  StyledHomeWrapper,
  StyledHomeTitle,
  StyledHomeTitleWrapper,
} from "../components/css/home.styled";

export const Home = () => {
  // Função de busca com validação e encoding seguro

  // Handler para mudança no input com debounce implícit

  return (
    <>
        <StyledHomeWrapper>
          <StyledHomeTitleWrapper>
            <StyledHomeTitle>Produtos em Destaque</StyledHomeTitle>
          </StyledHomeTitleWrapper>
          
          <CardPageWrapper>
            <CardPage />
          </CardPageWrapper>
        </StyledHomeWrapper>
    </>
   
  );
};