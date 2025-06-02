import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBuildDetail } from "../apiService";
import {
  Container,
  Title,
  LoadingMessage,
  ErrorMessage,
  NotFoundMessage,
  ComponentGrid,
  ComponentCard,
  ComponentHeader,
  ComponentType,
  ComponentBody,
  ComponentImage,
  ComponentName,
  SpecsGrid,
  SpecItem,
  SpecLabel,
  SpecValue,
  PricesSection,
  PricesTitle,
  PriceCard,
  StoreName,
  PriceInfo,
  Price,
  OldPrice,
  SaleBadge,
  CollectedDate,
  BuildUid,
  UidLabel,
  UidValue
} from "../css/buldTyledDetail";

export function BuildDetail() {
    const { uid } = useParams();
    const [build, setBuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchBuild() {
            setLoading(true);
            setError("");
            try {
                const data = await getBuildDetail(uid);
                setBuild(data);
            } catch (err) {
                setError("Erro ao carregar detalhes da build.");
            }
            setLoading(false);
        }
        fetchBuild();
    }, [uid]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getComponentSpecs = (component, type) => {
        const specs = [];
        
        switch(type) {
            case 'cpu':
                specs.push(
                    { label: 'Marca', value: component.brand },
                    { label: 'Socket', value: component.socket },
                    { label: 'Cores', value: component.cores },
                    { label: 'Velocidade Base', value: `${component.speed} MHz` },
                    { label: 'Turbo', value: `${component.turbo} MHz` },
                    { label: 'TDP', value: `${component.tdp}W` }
                );
                break;
            case 'gpu':
                specs.push(
                    { label: 'Marca', value: component.brand },
                    { label: 'Chipset', value: component.chipset },
                    { label: 'Memória', value: `${component.memory}GB` },
                    { label: 'Velocidade Base', value: `${component.speed} MHz` },
                    { label: 'Turbo', value: `${component.turbo} MHz` },
                    { label: 'TDP', value: `${component.tdp}W` }
                );
                break;
            case 'mobo':
                specs.push(
                    { label: 'Marca', value: component.brand },
                    { label: 'Socket', value: component.socket },
                    { label: 'Fator de Forma', value: component.form_factor },
                    { label: 'Chipset', value: component.chipset },
                    { label: 'RAM Máx', value: `${component.memory_max}GB` },
                    { label: 'Tipo RAM', value: component.memory_type }
                );
                break;
            case 'psu':
                specs.push(
                    { label: 'Marca', value: component.brand },
                    { label: 'Tipo', value: component.type },
                    { label: 'Potência', value: `${component.wattage}W` },
                    { label: 'Eficiência', value: component.efficiency },
                    { label: 'Modular', value: component.modular },
                    { label: '', value: '' }
                );
                break;
            case 'ram':
                specs.push(
                    { label: 'Marca', value: component.brand },
                    { label: 'Tipo', value: component.memory_type },
                    { label: 'Capacidade', value: `${component.memory_size}GB` },
                    { label: 'Módulos', value: component.memory_modules },
                    { label: 'Velocidade', value: `${component.memory_speed} MHz` },
                    { label: '', value: '' }
                );
                break;
            case 'storage':
                specs.push(
                    { label: 'Marca', value: component.brand },
                    { label: 'Tipo', value: component.type },
                    { label: 'Capacidade', value: `${component.capacity}GB` },
                    { label: 'Fator Forma', value: component.form_factor },
                    { label: 'Interface', value: component.interface },
                    { label: '', value: '' }
                );
                break;
        }
        
        return specs;
    };

    const componentNames = {
        cpu: 'Processador',
        gpu: 'Placa de Vídeo',
        mobo: 'Placa Mãe',
        psu: 'Fonte',
        ram: 'Memória RAM',
        storage: 'Armazenamento'
    };

    if (loading) return <LoadingMessage>Carregando detalhes...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;
    if (!build) return <NotFoundMessage>Build não encontrada.</NotFoundMessage>;

    const { data } = build;

    return (
        <Container>
            <Title>Detalhes da Build</Title>
            
            <ComponentGrid>
                {Object.entries(data).filter(([key]) => key !== 'uid').map(([componentType, component]) => (
                    <ComponentCard key={componentType}>
                        <ComponentHeader>
                            <ComponentType>{componentNames[componentType]}</ComponentType>
                        </ComponentHeader>
                        
                        <ComponentBody>
                            <ComponentImage 
                                src={component.data.image} 
                                alt={component.data.name}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/200x150?text=Sem+Imagem';
                                }}
                            />
                            
                            <ComponentName>{component.data.name}</ComponentName>
                            
                            <SpecsGrid>
                                {getComponentSpecs(component.data, componentType).map((spec, index) => (
                                    spec.label && spec.value ? (
                                        <SpecItem key={index}>
                                            <SpecLabel>{spec.label}</SpecLabel>
                                            <SpecValue>{spec.value}</SpecValue>
                                        </SpecItem>
                                    ) : null
                                ))}
                            </SpecsGrid>
                            
                            <PricesSection>
                                <PricesTitle>Preços Encontrados</PricesTitle>
                                {component.data.prices.map((price) => (
                                    <PriceCard key={price.id} sale={price.sale}>
                                        <StoreName>{price.store.name}</StoreName>
                                        <PriceInfo>
                                            <Price sale={price.sale}>
                                                {formatPrice(price.price)}
                                            </Price>
                                            {price.sale && price.old_price && (
                                                <>
                                                    <OldPrice>{formatPrice(price.old_price)}</OldPrice>
                                                    <SaleBadge>-{price.sale_percent}%</SaleBadge>
                                                </>
                                            )}
                                        </PriceInfo>
                                        <CollectedDate>
                                            Coletado em: {formatDate(price.colected_date)}
                                        </CollectedDate>
                                    </PriceCard>
                                ))}
                            </PricesSection>
                        </ComponentBody>
                    </ComponentCard>
                ))}
            </ComponentGrid>
            
            <BuildUid>
                <UidLabel>ID da Build:</UidLabel>
                <UidValue>{data.uid}</UidValue>
            </BuildUid>
        </Container>
    );
}