import { StyleBody } from "../components/css/page.styled";
import { CardPage } from "../components/card";
import { CardPageWrapper } from "../components/css/card.styled";

export const Home = () => {
  return (
    <>
      <StyleBody />
      <CardPageWrapper>
        <CardPage
          cardsPerView={window.innerWidth < 640 ? 2 : 3}
          transitionSpeed="0.1s"
        />
      </CardPageWrapper>
    </>
  );
};
