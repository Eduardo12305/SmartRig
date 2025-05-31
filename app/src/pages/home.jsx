import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { StyleBody } from "../components/css/page.styled";
import { CardPage } from "../components/card";
import { CardPageWrapper } from "../components/css/card.styled";
import { SearchGroup, SearchBar } from "../components/css/header.styled";
import {
  StyledHomeWrapper,
  StyledHomeTitle,
  StyledHomeTitleWrapper,
} from "../components/css/home.styled";

export const Home = () => {
  const navigate = useNavigate();

  const [eventSearch, setEventSearch] = useState("");

  const handleSearch = (search) => {
    navigate(`/produtos/search/${search}`);
  };
  return (
    <StyledHomeWrapper>
      <StyleBody />
      <SearchGroup>
        <SearchBar
          type="search"
          placeholder="Pesquisar Produto ..."
          value={eventSearch}
          onChange={(e) => setEventSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && eventSearch.trim() !== "") {
              handleSearch(eventSearch);
            }
          }}
        />
      </SearchGroup>
      <StyledHomeTitleWrapper>
        <StyledHomeTitle>Produtos em Destaque</StyledHomeTitle>
      </StyledHomeTitleWrapper>
      <CardPageWrapper>
        <CardPage
          cardsPerView={window.innerWidth < 640 ? 2 : 4}
          transitionSpeed="0.1s"
        />
      </CardPageWrapper>
    </StyledHomeWrapper>
  );
};
