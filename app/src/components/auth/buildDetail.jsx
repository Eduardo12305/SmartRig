import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg,rgb(255, 123, 0) 0%,rgb(255, 187, 0) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.5rem 0;
`;

const BuildId = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
`;

const TotalPrice = styled.div`
  text-align: right;
`;

const TotalPriceLabel = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
`;

const TotalPriceValue = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const ComponentsGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
`;

const ComponentCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,rgb(255, 123, 0) 0%,rgb(255, 187, 0) 100%);
  }
`;

const ComponentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ComponentIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg,rgb(255, 123, 0) 0%,rgb(255, 187, 0) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
`;

const ComponentInfo = styled.div`
  flex: 1;
`;

const ComponentTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const ComponentTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const BrandBadge = styled.span`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ComponentName = styled.p`
  color: #4b5563;
  font-weight: 500;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
`;

const SpecLabel = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
`;

const SpecValue = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const PriceSection = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const PriceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BestPrice = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PriceBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  
  &.stores {
    background: #e5e7eb;
    color: #374151;
  }
  
  &.sale {
    background: #fee2e2;
    color: #dc2626;
  }
`;

const StoreInfo = styled.div`
  margin-top: 0.5rem;
`;

const StoreName = styled.p`
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const SaleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const SaleBadge = styled.span`
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const PriceDetails = styled.details`
  margin-top: 1rem;
  
  summary {
    cursor: pointer;
    color: #3b82f6;
    font-weight: 600;
    padding: 0.5rem 0;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      color: #1d4ed8;
      background: #f3f4f6;
      padding-left: 0.5rem;
    }
  }
`;

const PriceList = styled.div`
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    transform: translateX(5px);
  }
`;

const PriceItemStore = styled.div``;

const PriceItemStoreName = styled.p`
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`;

const PriceItemDate = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
`;

const PriceItemValue = styled.div`
  text-align: right;
`;

const PriceItemPrice = styled.p`
  font-weight: 700;
  font-size: 1.2rem;
  color: #1f2937;
  margin: 0;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoadingContent = styled.div`
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1rem;
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ErrorContent = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  margin: 0 0 2rem 0;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg,rgb(255, 123, 0) 0%,rgb(255, 187, 0) 100%));
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }
`;

export function BuildDetail() {
    const [build, setBuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setTimeout(() => {
            const mockData = {
                'cpu': {'name': 'AMD Ryzen 5 6100X', 'brand': 'AMD', 'socket': 'AM4', 'tdp': 91, 'cores': 16, 'speed': 2175, 'turbo': 5035, 'prices': [{'price': 3225.35, 'sale': false, 'store': {'name': 'Rodriguez PLC'}}, {'price': 3088.1, 'sale': true, 'old_price': 3874.17, 'sale_percent': 20, 'store': {'name': 'Ruiz Ltd'}}]},
                'gpu': {'name': 'NVIDIA RTX 3060', 'brand': 'NVIDIA', 'chipset': 'RTX 3060', 'tdp': 170, 'memory': 12, 'speed': 1320, 'turbo': 1777, 'prices': [{'price': 1925.9, 'sale': true, 'old_price': 2185.44, 'sale_percent': 11, 'store': {'name': 'Rios, Gallegos and Roberts'}}]},
                'psu': {'name': 'Seasonic Possible 550W 80+ Bronze', 'brand': 'Seasonic', 'type': 'ATX', 'wattage': 550, 'efficiency': '80+ Bronze', 'modular': 'None', 'prices': [{'price': 996.66, 'sale': true, 'old_price': 1183.54, 'sale_percent': 15, 'store': {'name': 'Rios, Gallegos and Roberts'}}]},
                'ram': {'name': 'G.Skill Political 2x32GB DDR4', 'brand': 'G.Skill', 'memory_type': 'DDR4', 'memory_size': 32, 'memory_modules': 2, 'memory_speed': 3391, 'prices': [{'price': 1216.96, 'sale': false, 'store': {'name': 'Arnold Group'}}]},
                'mobo': {'name': 'Gigabyte X570 Area AM4', 'brand': 'Gigabyte', 'socket': 'AM4', 'form_factor': 'Mini ITX', 'memory_max': 64, 'memory_type': 'DDR4', 'memory_slots': 2, 'chipset': 'X570', 'm2_nvme': 1, 'm2_sata': 1, 'prices': [{'price': 777.62, 'sale': false, 'store': {'name': 'Lawrence Inc'}}]},
                'storage': {'name': 'Odonnell Ltd 256GB SSD SATA 2.5', 'brand': 'Pearson-Hartman', 'type': 'SSD', 'capacity': 256, 'form_factor': '2.5', 'interface': 'SATA', 'prices': [{'price': 178.49, 'sale': false, 'store': {'name': 'Ruiz Ltd'}}]},
                'uid': 'b98617e2-e3cf-494b-88f7-728ce03b6e6f'
            };
            setBuild(mockData);
            setLoading(false);
        }, 1500);
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getBestPrice = (prices) => {
        if (!prices || prices.length === 0) return null;
        return prices.reduce((min, current) => 
            current.price < min.price ? current : min
        );
    };

    const ComponentCardComponent = ({ title, component, icon }) => {
        const bestPrice = getBestPrice(component.prices);
        const totalPrices = component.prices?.length || 0;
        const onSaleCount = component.prices?.filter(p => p.sale).length || 0;

        return (
            <ComponentCard>
                <ComponentHeader>
                    <ComponentIcon>{icon}</ComponentIcon>
                    <ComponentInfo>
                        <ComponentTitleRow>
                            <ComponentTitle>{title}</ComponentTitle>
                            <BrandBadge>{component.brand}</BrandBadge>
                        </ComponentTitleRow>
                        <ComponentName>{component.name}</ComponentName>
                    </ComponentInfo>
                </ComponentHeader>

                <SpecsGrid>
                    {component.socket && (
                        <SpecItem>
                            <SpecLabel>Socket</SpecLabel>
                            <SpecValue>{component.socket}</SpecValue>
                        </SpecItem>
                    )}
                    {component.cores && (
                        <SpecItem>
                            <SpecLabel>Cores</SpecLabel>
                            <SpecValue>{component.cores}</SpecValue>
                        </SpecItem>
                    )}
                    {component.tdp && (
                        <SpecItem>
                            <SpecLabel>TDP</SpecLabel>
                            <SpecValue>{component.tdp}W</SpecValue>
                        </SpecItem>
                    )}
                    {component.memory && (
                        <SpecItem>
                            <SpecLabel>VRAM</SpecLabel>
                            <SpecValue>{component.memory}GB</SpecValue>
                        </SpecItem>
                    )}
                    {component.wattage && (
                        <SpecItem>
                            <SpecLabel>Potência</SpecLabel>
                            <SpecValue>{component.wattage}W</SpecValue>
                        </SpecItem>
                    )}
                    {component.efficiency && (
                        <SpecItem>
                            <SpecLabel>Eficiência</SpecLabel>
                            <SpecValue>{component.efficiency}</SpecValue>
                        </SpecItem>
                    )}
                    {component.memory_size && (
                        <SpecItem>
                            <SpecLabel>Capacidade</SpecLabel>
                            <SpecValue>{component.memory_size}GB x{component.memory_modules}</SpecValue>
                        </SpecItem>
                    )}
                    {component.memory_type && (
                        <SpecItem>
                            <SpecLabel>Tipo</SpecLabel>
                            <SpecValue>{component.memory_type}</SpecValue>
                        </SpecItem>
                    )}
                    {component.form_factor && (
                        <SpecItem>
                            <SpecLabel>Form Factor</SpecLabel>
                            <SpecValue>{component.form_factor}</SpecValue>
                        </SpecItem>
                    )}
                    {component.capacity && (
                        <SpecItem>
                            <SpecLabel>Capacidade</SpecLabel>
                            <SpecValue>{component.capacity}GB</SpecValue>
                        </SpecItem>
                    )}
                    {component.interface && (
                        <SpecItem>
                            <SpecLabel>Interface</SpecLabel>
                            <SpecValue>{component.interface}</SpecValue>
                        </SpecItem>
                    )}
                </SpecsGrid>

                {bestPrice && (
                    <PriceSection>
                        <PriceHeader>
                            <BestPrice>{formatCurrency(bestPrice.price)}</BestPrice>
                            <PriceBadges>
                                <Badge className="stores">{totalPrices} lojas</Badge>
                                {onSaleCount > 0 && (
                                    <Badge className="sale">{onSaleCount} em promoção</Badge>
                                )}
                            </PriceBadges>
                        </PriceHeader>
                        <StoreInfo>
                            <StoreName>{bestPrice.store.name}</StoreName>
                            {bestPrice.sale && (
                                <SaleInfo>
                                    <OldPrice>{formatCurrency(bestPrice.old_price)}</OldPrice>
                                    <SaleBadge>-{bestPrice.sale_percent}%</SaleBadge>
                                </SaleInfo>
                            )}
                        </StoreInfo>
                    </PriceSection>
                )}

                {component.prices && component.prices.length > 1 && (
                    <PriceDetails>
                        <summary>Ver todos os preços ({component.prices.length})</summary>
                        <PriceList>
                            {component.prices.map((price, index) => (
                                <PriceItem key={index}>
                                    <PriceItemStore>
                                        <PriceItemStoreName>{price.store.name}</PriceItemStoreName>
                                        <PriceItemDate>Atualizado recentemente</PriceItemDate>
                                    </PriceItemStore>
                                    <PriceItemValue>
                                        <PriceItemPrice>{formatCurrency(price.price)}</PriceItemPrice>
                                        {price.sale && (
                                            <SaleInfo>
                                                <OldPrice>{formatCurrency(price.old_price)}</OldPrice>
                                                <SaleBadge>-{price.sale_percent}%</SaleBadge>
                                            </SaleInfo>
                                        )}
                                    </PriceItemValue>
                                </PriceItem>
                            ))}
                        </PriceList>
                    </PriceDetails>
                )}
            </ComponentCard>
        );
    };

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingContent>
                    <Spinner />
                    <LoadingText>Carregando detalhes da build...</LoadingText>
                </LoadingContent>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <ErrorContent>
                    <ErrorIcon>⚠️</ErrorIcon>
                    <ErrorTitle>Erro ao carregar</ErrorTitle>
                    <ErrorMessage>{error}</ErrorMessage>
                    <RetryButton onClick={() => window.location.reload()}>
                        Tentar novamente
                    </RetryButton>
                </ErrorContent>
            </ErrorContainer>
        );
    }

    if (!build) {
        return (
            <ErrorContainer>
                <ErrorContent>
                    <ErrorIcon>🔍</ErrorIcon>
                    <ErrorTitle>Build não encontrada</ErrorTitle>
                    <ErrorMessage>A build solicitada não foi encontrada.</ErrorMessage>
                </ErrorContent>
            </ErrorContainer>
        );
    }

    const totalBestPrice = [
        getBestPrice(build.cpu?.prices),
        getBestPrice(build.gpu?.prices),
        getBestPrice(build.psu?.prices),
        getBestPrice(build.ram?.prices),
        getBestPrice(build.mobo?.prices),
        getBestPrice(build.storage?.prices)
    ]
        .filter(Boolean)
        .reduce((sum, price) => sum + price.price, 0);

    return (
        <Container>
            <ContentWrapper>
                <Header>
                    <div>
                        <Title>Detalhes da Build</Title>
                        <BuildId>ID: {build.uid}</BuildId>
                    </div>
                    <TotalPrice>
                        <TotalPriceLabel>Preço total (melhores ofertas)</TotalPriceLabel>
                        <TotalPriceValue>{formatCurrency(totalBestPrice)}</TotalPriceValue>
                    </TotalPrice>
                </Header>

                <ComponentsGrid>
                    {build.cpu && (
                        <ComponentCardComponent 
                            title="Processador" 
                            component={build.cpu} 
                            icon="🔧"
                        />
                    )}
                    {build.gpu && (
                        <ComponentCardComponent 
                            title="Placa de Vídeo" 
                            component={build.gpu} 
                            icon="🎮"
                        />
                    )}
                    {build.ram && (
                        <ComponentCardComponent 
                            title="Memória RAM" 
                            component={build.ram} 
                            icon="💾"
                        />
                    )}
                    {build.mobo && (
                        <ComponentCardComponent 
                            title="Placa-Mãe" 
                            component={build.mobo} 
                            icon="🔲"
                        />
                    )}
                    {build.psu && (
                        <ComponentCardComponent 
                            title="Fonte de Alimentação" 
                            component={build.psu} 
                            icon="⚡"
                        />
                    )}
                    {build.storage && (
                        <ComponentCardComponent 
                            title="Armazenamento" 
                            component={build.storage} 
                            icon="💿"
                        />
                    )}
                </ComponentsGrid>
            </ContentWrapper>
        </Container>
    );
}