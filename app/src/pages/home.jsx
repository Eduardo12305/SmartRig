import { CardPage } from "../components/card";
import { CardPageWrapper } from "../components/css/card.styled";
import {
  StyledHomeWrapper,
  StyledHomeTitle,
  StyledHomeTitleWrapper,
} from "../components/css/home.styled";

export const Home = () => {
  return (
    <StyledHomeWrapper>
      <StyledHomeTitleWrapper>
        <StyledHomeTitle>
          Nossos Produtos
        </StyledHomeTitle>
      </StyledHomeTitleWrapper>
      
      <CardPageWrapper>
        <CardPage />
      </CardPageWrapper>
    </StyledHomeWrapper>
  );
};