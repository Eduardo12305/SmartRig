import React from "react";
import styled, { keyframes, css } from "styled-components";
import { CardPage } from "../components/card";
import { CardPageWrapper } from "../components/css/card.styled";
import {
  StyledHomeWrapper,
  StyledHomeTitle,
  StyledHomeTitleWrapper,
} from "../components/css/home.styled";

// Animações
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Componentes estilizados
const EnhancedHomeWrapper = styled(StyledHomeWrapper)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(59, 130, 246, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(249, 115, 22, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem 2rem;
  position: relative;
  z-index: 1;
`;

const EnhancedTitleWrapper = styled(StyledHomeTitleWrapper)`
  animation: ${css`
    ${fadeInUp} 0.8s ease-out
  `};
  margin:0;
  text-align: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const EnhancedTitle = styled(StyledHomeTitle)`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${css`
    ${gradientShift} 3s ease-in-out infinite
  `};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  animation: ${css`
    ${fadeInUp} 0.8s ease-out 0.2s both
  `};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
  animation: ${css`
    ${fadeInUp} 0.8s ease-out 0.4s both
  `};
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${(props) =>
      props.accent === "orange"
        ? "linear-gradient(90deg, #f97316, #fb923c)"
        : "linear-gradient(90deg, #3b82f6, #60a5fa)"};
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${(props) =>
    props.accent === "orange"
      ? "linear-gradient(135deg, #f97316, #fb923c)"
      : "linear-gradient(135deg, #3b82f6, #60a5fa)"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 1rem;
`;

const CTASection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  animation: ${css`
    ${fadeInUp} 0.8s ease-out 0.6s both
  `};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTAButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.primary
      ? css`
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: white;
          box-shadow: 0 4px 14px 0 rgba(249, 115, 22, 0.39);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px 0 rgba(249, 115, 22, 0.5);
            animation: ${pulse} 0.6s ease-in-out;
          }
        `
      : css`
          background: white;
          color: #3b82f6;
          border: 2px solid #3b82f6;

          &:hover {
            background: #3b82f6;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.3);
          }
        `}
`;

const ProductsSection = styled.div`
  padding: 2rem;
  animation: ${css`
    ${fadeInUp} 0.8s ease-out 0.8s both
  `};
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #1e293b;
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #f97316);
    border-radius: 2px;
  }
`;

// Ícones SVG
const CompareIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3L19 14l-4.01 4v-3H8v-2h6.99z" />
  </svg>
);

const CPUIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 7h1V6h12v1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v1H6v-1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM6 9v6h12V9H6zm2 2h8v2H8v-2z" />
  </svg>
);

const BuildIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
  </svg>
);

export const Home = () => {
  return (
    <EnhancedHomeWrapper>
      <HeroSection>
        <EnhancedTitleWrapper>
          <EnhancedTitle>SmartRig</EnhancedTitle>
        </EnhancedTitleWrapper>

        <Subtitle>
          A plataforma mais completa para comparar preços de peças de computador
          e montar sua build perfeita com inteligência artificial
        </Subtitle>

        <CTASection>
          <CTAButton primary>Começar Comparação</CTAButton>
          <CTAButton>Montar Build IA</CTAButton>
        </CTASection>

        <FeaturesGrid>
          <FeatureCard accent="blue">
            <FeatureIcon accent="blue">
              <CompareIcon />
            </FeatureIcon>
            <FeatureTitle>Comparação Inteligente</FeatureTitle>
            <FeatureDescription>
              Compare preços de milhares de produtos em tempo real. Nossa
              plataforma monitora constantemente os melhores preços do mercado
              para você economizar.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard accent="orange">
            <FeatureIcon accent="orange">
              <BuildIcon />
            </FeatureIcon>
            <FeatureTitle>Montagem com IA</FeatureTitle>
            <FeatureDescription>
              Nosso algoritmo genético cria a build perfeita baseada no seu
              orçamento e necessidades, otimizando performance e custo-benefício
              automaticamente.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard accent="blue">
            <FeatureIcon accent="blue">
              <CPUIcon />
            </FeatureIcon>
            <FeatureTitle>Catálogo Completo</FeatureTitle>
            <FeatureDescription>
              Acesse o maior banco de dados de peças de computador do Brasil.
              Processadores, placas de vídeo, memórias e muito mais em um só
              lugar.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </HeroSection>

      <ProductsSection>
        <SectionTitle>Produtos em Destaque</SectionTitle>

        <CardPageWrapper>
          <CardPage />
        </CardPageWrapper>
      </ProductsSection>
    </EnhancedHomeWrapper>
  );
};
