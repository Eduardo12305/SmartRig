import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { produc_price, product } from "../components/apiService";
import styled from "styled-components";

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.2;
`;

const ProductBrand = styled.p`
  font-size: 1.1rem;
  color: #ff6b35;
  font-weight: 600;
  margin: 0;
`;

const BestPriceContainer = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
`;

const BestPriceLabel = styled.p`
  font-size: 0.9rem;
  margin: 0 0 8px 0;
  opacity: 0.9;
`;

const BestPrice = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
`;

const SpecsContainer = styled.div`
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #ff6b35;
`;

const SpecsTitle = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SpecLabel = styled.span`
  font-weight: 600;
  color: #495057;
`;

const SpecValue = styled.span`
  color: #6c757d;
`;

const PricesSection = styled.div`
  margin-top: 40px;
`;

const PricesSectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 600;
`;

const PricesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const PriceCard = styled.div`
  background: white;
  border: 2px solid ${props => props.isLowest ? '#ff6b35' : '#e9ecef'};
  border-radius: 12px;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
`;

const BestDealBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 15px;
  background: #ff6b35;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const StoreName = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-weight: 600;
`;

const PriceInfo = styled.div`
  margin-bottom: 16px;
`;

const CurrentPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 4px;
`;

const OldPrice = styled.div`
  font-size: 1rem;
  color: #6c757d;
  text-decoration: line-through;
  margin-bottom: 4px;
`;

const SaleBadge = styled.span`
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const StoreButton = styled.a`
  display: inline-block;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
    transform: translateY(-1px);
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  padding: 40px;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #dc3545;
  padding: 40px;
  background: #f8d7da;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
`;

export const Products = () => {
    const { id } = useParams();
    const [products, setProducts] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [price, setPrice] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await product(id);
                setProducts(response);

                const priceResponse = await produc_price(id);
                setPrice(priceResponse);
            } catch (error) {
                setErrorMessage(error.message || "Erro ao carregar produto");
            }
        };
        fetchProducts();
    }, [id]);

    // Função para formatar valores
    const formatValue = (value, unit = '') => {
        if (value === null || value === undefined) return 'N/A';
        return `${value}${unit}`;
    };

    // Função para detectar tipo de produto baseado nas propriedades disponíveis
    const getProductType = (product) => {
        if (product.socket && product.cores) return 'CPU';
        if (product.chipset && product.memory && !product.socket) return 'GPU';
        if (product.wattage) return 'PSU';
        if (product.form_factor && product.memory_max) return 'MOBO';
        if (product.memory_type && product.memory_size) return 'RAM';
        if (product.capacity && product.interface) return 'STORAGE';
        return 'UNKNOWN';
    };

    // Função para renderizar especificações baseadas no tipo de produto
    const renderSpecs = (product) => {
        const productType = getProductType(product);
        const commonSpecs = [
            { label: 'Marca', value: product.brand }
        ];

        let specificSpecs = [];

        switch (productType) {
            case 'CPU':
                specificSpecs = [
                    { label: 'Socket', value: product.socket },
                    { label: 'IGPU', value: product.igpu?.name || 'N/A' },
                    { label: 'TDP', value: formatValue(product.tdp, 'W') },
                    { label: 'Cores', value: formatValue(product.cores) },
                    { label: 'Velocidade Base', value: formatValue(product.speed, ' MHz') },
                    { label: 'Velocidade Turbo', value: formatValue(product.turbo, ' MHz') }
                ];
                break;
            
            case 'GPU':
                specificSpecs = [
                    { label: 'Chipset', value: product.chipset },
                    { label: 'TDP', value: formatValue(product.tdp, 'W') },
                    { label: 'Memória', value: formatValue(product.memory, ' GB') },
                    { label: 'Clock Base', value: formatValue(product.speed, ' MHz') },
                    { label: 'Clock Boost', value: formatValue(product.turbo, ' MHz') }
                ];
                break;
            
            case 'PSU':
                specificSpecs = [
                    { label: 'Tipo', value: product.type },
                    { label: 'Potência', value: formatValue(product.wattage, 'W') },
                    { label: 'Eficiência', value: product.efficiency },
                    { label: 'Modular', value: product.modular || 'N/A' }
                ];
                break;
            
            case 'MOBO':
                specificSpecs = [
                    { label: 'Socket', value: product.socket },
                    { label: 'Form Factor', value: product.form_factor },
                    { label: 'Memória Máxima', value: formatValue(product.memory_max, ' GB') },
                    { label: 'Tipo de Memória', value: product.memory_type },
                    { label: 'Slots de Memória', value: formatValue(product.memory_slots) },
                    { label: 'Chipset', value: product.chipset },
                    { label: 'M.2 NVMe', value: formatValue(product.m2_nvme) },
                    { label: 'M.2 SATA', value: formatValue(product.m2_sata) }
                ];
                break;
            
            case 'RAM':
                specificSpecs = [
                    { label: 'Tipo de Memória', value: product.memory_type },
                    { label: 'Capacidade', value: formatValue(product.memory_size, ' GB') },
                    { label: 'Módulos', value: formatValue(product.memory_modules) },
                    { label: 'Velocidade', value: formatValue(product.memory_speed, ' MHz') }
                ];
                break;
            
            case 'STORAGE':
                specificSpecs = [
                    { label: 'Tipo', value: product.type },
                    { label: 'Capacidade', value: formatValue(product.capacity, ' GB') },
                    { label: 'Form Factor', value: product.form_factor },
                    { label: 'Interface', value: product.interface }
                ];
                break;
            
            default:
                specificSpecs = [
                    { label: 'Informações', value: 'Especificações não disponíveis' }
                ];
        }

        return [...commonSpecs, ...specificSpecs];
    };

    if (errorMessage) return <ErrorMessage>{errorMessage}</ErrorMessage>;
    if (!products || !price) return <LoadingMessage>Carregando produto...</LoadingMessage>;

    const pricesArray = Object.values(price.data);
    const lowestPrice = Math.min(...pricesArray.map(item => item.price));
    const specs = renderSpecs(products);
    
    return (
        <PageContainer>
            <ProductContainer>
                <ProductImageContainer>
                    <ProductImage src={products.image} alt={products.name} />
                </ProductImageContainer>
                
                <ProductInfo>
                    <ProductName>{products.name}</ProductName>
                    <ProductBrand>Marca: {products.brand}</ProductBrand>
                    
                    <BestPriceContainer>
                        <BestPriceLabel>Melhor preço encontrado:</BestPriceLabel>
                        <BestPrice>R$ {lowestPrice.toFixed(2)}</BestPrice>
                    </BestPriceContainer>

                    <SpecsContainer>
                        <SpecsTitle>Especificações Técnicas</SpecsTitle>
                        {specs.map((spec, index) => (
                            <SpecItem key={index}>
                                <SpecLabel>{spec.label}:</SpecLabel>
                                <SpecValue>{spec.value}</SpecValue>
                            </SpecItem>
                        ))}
                    </SpecsContainer>
                </ProductInfo>
            </ProductContainer>

            <PricesSection>
                <PricesSectionTitle>Comparação de Preços</PricesSectionTitle>
                <PricesGrid>
                    {pricesArray.map((priceData, index) => (
                        <PriceCard key={priceData.id} isLowest={priceData.price === lowestPrice}>
                            {priceData.price === lowestPrice && (
                                <BestDealBadge>Melhor Oferta</BestDealBadge>
                            )}
                            
                            <StoreName>{priceData.store.name}</StoreName>
                            
                            <PriceInfo>
                                <CurrentPrice>R$ {priceData.price.toFixed(2)}</CurrentPrice>
                                {priceData.old_price && (
                                    <OldPrice>De: R$ {priceData.old_price.toFixed(2)}</OldPrice>
                                )}
                                {priceData.sale && (
                                    <SaleBadge>{priceData.sale_percent}% OFF</SaleBadge>
                                )}
                            </PriceInfo>
                            
                            <StoreButton 
                                href={priceData.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Ver na Loja
                            </StoreButton>
                        </PriceCard>
                    ))}
                </PricesGrid>
            </PricesSection>
        </PageContainer>
    );
};