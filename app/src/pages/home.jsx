import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");

  // Função de busca com validação e encoding seguro
  const handleSearch = useCallback((search) => {
    if (!search || !search.trim()) return;
    
    try {
      const encodedSearch = encodeURIComponent(search.trim());
      navigate(`/produtos/search/${encodedSearch}`);
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  }, [navigate]);

  // Handler para mudança no input com debounce implícito
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // Handler para teclas com validação
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchTerm);
    }
  }, [searchTerm, handleSearch]);

  // Handler para submit do formulário (se houver)
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  return (
    <>
      <StyleBody />
        <StyledHomeWrapper>
          <SearchGroup as="form" onSubmit={handleSubmit}>
            <SearchBar
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              maxLength={100}
              aria-label="Campo de busca de produtos"
            />
            <button 
              type="submit" 
              style={{ display: 'none' }}
              aria-hidden="true"
            >
              Buscar
            </button>
          </SearchGroup>
          
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