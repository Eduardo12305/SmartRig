import { StyleBody } from "../components/css/page.styled";
import { Header } from "../components/header";
import { CardPage } from "../components/card";
import { CardPageWrapper } from "../components/css/card.styled";
import { Rodape } from "../components/Rodape";

export const Home = () => {
  return (
    <>
      <StyleBody />
      <Header />
      <CardPageWrapper>
        <CardPage
          cardsPerView={window.innerWidth < 640 ? 2 : 3}
          transitionSpeed="0.1s"
        />
      </CardPageWrapper>
      <Rodape />
    </>
  );
};
