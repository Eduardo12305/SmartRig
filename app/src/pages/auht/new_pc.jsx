import { useState, useEffect } from "react";
import { buildPC, productsCategory, favoriteBuild } from "../../components/apiService";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: white;
`;

const MainWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

const CardContent = styled.div`
  padding: 32px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 32px;
  text-align: center;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const WeightSection = styled.div`
  background: linear-gradient(to right, #dbeafe, #fed7aa);
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

const WeightHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const WeightTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const AdvancedToggle = styled.button`
  font-size: 0.875rem;
  color: #2563eb;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #1d4ed8;
  }
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const PresetButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid;
  
  ${props => props.active ? `
    background-color: #f97316;
    color: white;
    border-color: #f97316;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  ` : `
    background-color: white;
    color: #374151;
    border-color: #d1d5db;
    
    &:hover {
      background-color: #fed7aa;
      border-color: #fdba74;
    }
  `}
`;

const AdvancedControls = styled.div`
  margin-top: 16px;
`;

const WeightControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const WeightControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WeightLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-transform: capitalize;
`;

const WeightSlider = styled.input`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #f97316;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #f97316;
    cursor: pointer;
    border: none;
  }
`;

const WeightTotal = styled.div`
  font-size: 0.875rem;
  color: ${props => Math.abs(props.total - 1) < 0.01 ? '#059669' : '#dc2626'};
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ComponentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }
`;

const RequiredMark = styled.span`
  color: #dc2626;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const Button = styled.button`
  flex: 1;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #f97316;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #ea580c;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ResultsCard = styled(Card)`
  margin-top: 32px;
`;

const ResultsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #991b1b;
`;

const WarningMessage = styled.div`
  background-color: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 16px;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: linear-gradient(to right, #3b82f6, #f97316);
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  
  &:last-child {
    text-align: right;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  background-color: ${props => props.even ? '#f9fafb' : 'white'};
`;

const TableCell = styled.td`
  padding: 16px;
  
  &:last-child {
    text-align: right;
  }
`;

const ProductLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  
  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

const TotalRow = styled(TableRow)`
  background: linear-gradient(to right, #f0fdf4, #dbeafe);
  border-top: 2px solid #d1d5db;
`;

const TotalCell = styled(TableCell)`
  font-weight: bold;
  
  &:last-child {
    color: #059669;
    font-size: 1.125rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
`;

const WEIGHT_PRESETS = {
  balanced: { cpu: 0.45, gpu: 0.45, ram: 0.1, name: "Balanceado" },
  gaming: { cpu: 0.25, gpu: 0.65, ram: 0.1, name: "Para Jogos" },
  ai: { cpu: 0.3, gpu: 0.6, ram: 0.1, name: "Para IA" },
  editing: { cpu: 0.4, gpu: 0.5, ram: 0.1, name: "Para Edição" },
  office: { cpu: 0.7, gpu: 0.1, ram: 0.2, name: "Escritório" },
  workstation: { cpu: 0.5, gpu: 0.3, ram: 0.2, name: "Workstation" }
};

export default function NewPC() {
  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [mobo, setMobo] = useState("");
  const [psu, setPsu] = useState("");
  const [cpuList, setCpuList] = useState([]);
  const [gpuList, setGpuList] = useState([]);
  const [moboList, setMoboList] = useState([]);
  const [psuList, setPsuList] = useState([]);
  const [storageType, setStorageType] = useState("SSD");
  const [storageSize, setStorageSize] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buildName, setBuildName] = useState("");
  
  // Estados para os pesos
  const [weights, setWeights] = useState({ cpu: 0.45, gpu: 0.45, ram: 0.1 });
  const [selectedPreset, setSelectedPreset] = useState("balanced");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const getItens = async () => {
      try {
        const cpus = await productsCategory("cpu");
        setCpuList(Array.isArray(cpus.data?.data) ? cpus.data.data : []);
        const gpus = await productsCategory("gpu");
        setGpuList(Array.isArray(gpus.data?.data) ? gpus.data.data : []);
        const mobos = await productsCategory("mobo");
        setMoboList(Array.isArray(mobos.data?.data) ? mobos.data.data : []);
        const psus = await productsCategory("psu");
        setPsuList(Array.isArray(psus.data?.data) ? psus.data.data : []);
      } catch (error) {
        setCpuList([]); setGpuList([]); setMoboList([]); setPsuList([]);
        console.error("Erro ao buscar itens:", error);
      }
    };
    getItens();
  }, []);

  const handleWeightChange = (component, value) => {
    const newValue = parseFloat(value) || 0;
    const otherWeights = Object.keys(weights).filter(key => key !== component);
    const remainingWeight = 1 - newValue;
    
    if (remainingWeight >= 0 && newValue <= 1) {
      const newWeights = { ...weights, [component]: newValue };
      
      // Redistribuir o peso restante proporcionalmente
      const currentOtherTotal = otherWeights.reduce((sum, key) => sum + weights[key], 0);
      if (currentOtherTotal > 0) {
        otherWeights.forEach(key => {
          newWeights[key] = (weights[key] / currentOtherTotal) * remainingWeight;
        });
      } else {
        const equalShare = remainingWeight / otherWeights.length;
        otherWeights.forEach(key => {
          newWeights[key] = equalShare;
        });
      }
      
      setWeights(newWeights);
      setSelectedPreset("custom");
    }
  };

  const applyPreset = (presetKey) => {
    if (WEIGHT_PRESETS[presetKey]) {
      const preset = WEIGHT_PRESETS[presetKey];
      setWeights({ cpu: preset.cpu, gpu: preset.gpu, ram: preset.ram });
      setSelectedPreset(presetKey);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!storageSize || !budget) {
      alert("Preencha os campos obrigatórios!");
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const data = {
        cpu: cpu || undefined,
        gpu: gpu || undefined,
        mobo: mobo || undefined,
        psu: psu || undefined,
        budget: Number(budget),
        storage: Number(storageSize),
        storageType: storageType,
        name: buildName,
        weights: weights
      };
      
      const res = await buildPC(data);
      setResult(res);
    } catch (err) {
      // Verifica se o erro contém a mensagem de orçamento muito baixo
      let errorMessage = "Erro ao gerar build";
      
      if (err.detail) {
        if (typeof err.detail === 'string') {
          try {
            const parsedDetail = JSON.parse(err.detail);
            if (parsedDetail.message) {
              errorMessage = parsedDetail.message;
            }
          } catch {
            errorMessage = err.detail;
          }
        } else if (err.detail.message) {
          errorMessage = err.detail.message;
        } else {
          errorMessage = JSON.stringify(err.detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        try {
          const parsedErr = JSON.parse(err);
          if (parsedErr.message) {
            errorMessage = parsedErr.message;
          }
        } catch {
          errorMessage = err;
        }
      }
      
      setResult({ 
        error: errorMessage,
        isLowBudget: errorMessage.toLowerCase().includes('orçamento muito baixo') || 
                    errorMessage.toLowerCase().includes('budget too low')
      });
    }
    setLoading(false);
  };

  const saveBuild = async () => {
    if (!result) {
      alert("Gere uma build antes de salvar!");
      return;
    }
    let name = buildName;
    if (!name) {
      name = window.prompt("Digite um nome para sua build:");
      if (!name) {
        alert("Nome da build é obrigatório!");
        return;
      }
      setBuildName(name);
    }
    try {
      const buildToSave = { ...result, name };
      await favoriteBuild(buildToSave);
      alert("Build salva com sucesso!");
    } catch (error) {
      alert("Erro ao salvar build: " + (error.message || "Tente novamente"));
    }
  };

  const totalWeight = weights.cpu + weights.gpu + weights.ram;

  return (
    <Container>
      <MainWrapper>
        <Card>
          <CardContent>
            <Title>🖥️ Monte seu PC Ideal</Title>

            <FormSection>
              {/* Seção de Presets e Pesos */}
              <WeightSection>
                <WeightHeader>
                  <WeightTitle>⚖️ Prioridades da Build</WeightTitle>
                  <AdvancedToggle onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? "Ocultar Avançado" : "Configuração Avançada"}
                  </AdvancedToggle>
                </WeightHeader>

                {/* Presets */}
                <PresetGrid>
                  {Object.entries(WEIGHT_PRESETS).map(([key, preset]) => (
                    <PresetButton
                      key={key}
                      active={selectedPreset === key}
                      onClick={() => applyPreset(key)}
                    >
                      {preset.name}
                    </PresetButton>
                  ))}
                </PresetGrid>

                {/* Controles de peso avançados */}
                {showAdvanced && (
                  <AdvancedControls>
                    <WeightControlsGrid>
                      {Object.entries(weights).map(([component, weight]) => (
                        <WeightControl key={component}>
                          <WeightLabel>
                            {component}: {(weight * 100).toFixed(0)}%
                          </WeightLabel>
                          <WeightSlider
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={weight}
                            onChange={(e) => handleWeightChange(component, e.target.value)}
                          />
                        </WeightControl>
                      ))}
                    </WeightControlsGrid>
                    <WeightTotal total={totalWeight}>
                      Total: {(totalWeight * 100).toFixed(0)}% {Math.abs(totalWeight - 1) >= 0.01 && "(deve somar 100%)"}
                    </WeightTotal>
                  </AdvancedControls>
                )}
              </WeightSection>

              {/* Componentes */}
              <ComponentsGrid>
                <ComponentColumn>
                  <InputGroup>
                    <Label>🖥️ CPU (opcional)</Label>
                    <Select value={cpu} onChange={e => setCpu(e.target.value)}>
                      <option value="">Selecione uma CPU</option>
                      {cpuList.map(item => (
                        <option key={item.uid} value={item.uid}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>

                  <InputGroup>
                    <Label>🎮 GPU (opcional)</Label>
                    <Select value={gpu} onChange={e => setGpu(e.target.value)}>
                      <option value="">Selecione uma GPU</option>
                      {gpuList.map(item => (
                        <option key={item.uid} value={item.uid}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>

                  <InputGroup>
                    <Label>🔌 Placa-mãe (opcional)</Label>
                    <Select value={mobo} onChange={e => setMobo(e.target.value)}>
                      <option value="">Selecione uma Placa-mãe</option>
                      {moboList.map(item => (
                        <option key={item.uid} value={item.uid}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </ComponentColumn>

                <ComponentColumn>
                  <InputGroup>
                    <Label>⚡ Fonte (PSU) (opcional)</Label>
                    <Select value={psu} onChange={e => setPsu(e.target.value)}>
                      <option value="">Selecione uma Fonte</option>
                      {psuList.map(item => (
                        <option key={item.uid} value={item.uid}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>

                  <InputGroup>
                    <Label>💾 Tipo de Armazenamento</Label>
                    <Select value={storageType} onChange={e => setStorageType(e.target.value)}>
                      <option value="SSD">SSD</option>
                      <option value="HDD">HDD</option>
                      <option value="M.2">M.2</option>
                    </Select>
                  </InputGroup>

                  <InputGroup>
                    <Label>
                      📏 Tamanho do {storageType} (GB) <RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      type="number"
                      min={64}
                      step={64}
                      value={storageSize}
                      onChange={e => setStorageSize(e.target.value)}
                      required
                      placeholder="Ex: 1024"
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>
                      💰 Orçamento (R$) <RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      type="number"
                      min={100}
                      step={50}
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      required
                      placeholder="Ex: 5000"
                    />
                  </InputGroup>
                </ComponentColumn>
              </ComponentsGrid>

              <ButtonGroup>
                <PrimaryButton onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Gerando Build...
                    </>
                  ) : (
                    "🚀 Gerar Build"
                  )}
                </PrimaryButton>
                
                <SecondaryButton onClick={saveBuild} disabled={!result || !!result?.error}>
                  💾 Salvar Build
                </SecondaryButton>
              </ButtonGroup>
            </FormSection>
          </CardContent>
        </Card>

        {/* Resultado */}
        <ResultsCard>
          <CardContent>
            <ResultsTitle>📋 Resultado da Build</ResultsTitle>
            
            {result ? (
              result.error ? (
                result.isLowBudget ? (
                  <WarningMessage>
                    <span>⚠️</span>
                    <div>
                      <strong>{result.error}</strong>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem' }}>
                        Tente aumentar o orçamento ou ajustar os componentes selecionados para gerar uma build viável.
                      </p>
                    </div>
                  </WarningMessage>
                ) : (
                  <ErrorMessage>
                    ❌ {result.error}
                  </ErrorMessage>
                )
              ) : (
                <TableWrapper>
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableHeaderCell>Componente</TableHeaderCell>
                        <TableHeaderCell>Modelo</TableHeaderCell>
                        <TableHeaderCell>Preço</TableHeaderCell>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {["cpu", "gpu", "mobo", "psu", "ram", "storage"].map((key, index) =>
                        result[key] && result[key].name ? (
                          <TableRow key={key} even={index % 2 === 0}>
                            <TableCell>
                              {key === "cpu" && "🖥️ CPU"}
                              {key === "gpu" && "🎮 GPU"}
                              {key === "mobo" && "🔌 Placa-mãe"}
                              {key === "psu" && "⚡ Fonte"}
                              {key === "ram" && "🧠 RAM"}
                              {key === "storage" && "💾 Armazenamento"}
                            </TableCell>
                            <TableCell>
                              {(result[key].id || result[key].object_id) ? (
                                <ProductLink
                                  href={`/produto/${result[key].id || result[key].object_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {result[key].name}
                                </ProductLink>
                              ) : (
                                result[key].price && result[key].price.object_id ? (
                                  <ProductLink
                                    href={`/produto/${result[key].price.object_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {result[key].name}
                                  </ProductLink>
                                ) : (
                                  result[key].name
                                )
                              )}
                            </TableCell>
                            <TableCell>
                              {result[key].price && typeof result[key].price.price === "number"
                                ? `R$ ${result[key].price.price.toFixed(2)}`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ) : null
                      )}
                      {Number.isFinite(result.total_price) && (
                        <TotalRow>
                          <TotalCell colSpan={2}>💰 Total</TotalCell>
                          <TotalCell>R$ {result.total_price.toFixed(2)}</TotalCell>
                        </TotalRow>
                      )}
                    </TableBody>
                  </Table>
                </TableWrapper>
              )
            ) : (
              <EmptyState>
                <EmptyIcon>🛠️</EmptyIcon>
                <EmptyText>Preencha os dados e gere sua build ideal!</EmptyText>
              </EmptyState>
            )}
          </CardContent>
        </ResultsCard>
      </MainWrapper>
    </Container>
  );
}