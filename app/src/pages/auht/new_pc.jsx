import { useState, useEffect } from "react";
import { buildPC, productsCategory, favoriteBuild } from "../../components/apiService";
import { FormContainer, Label, Select, Input, Button, ResultTable, TableContainer } from "./new_pc.styled.jsx";

export const NewPC = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                storageType: storageType
            };
            const res = await buildPC(data);
            setResult(res);
        } catch (err) {
            setResult({ error: err.detail ? JSON.stringify(err.detail) : err.message || "Erro ao gerar build" });
        }
        setLoading(false);
    }
    
    const saveBuild = async () => {
        if (!result) {
            alert("Gere uma build antes de salvar!");
            return;
        }
        try {
            await favoriteBuild(result); // Passe o objeto result diretamente
            alert("Build salva com sucesso!");
        } catch (error) {
            alert("Erro ao salvar build: " + (error.message || "Tente novamente"));
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <h1>Monte seu PC</h1>
                <Label>
                    CPU (opcional):
                    <Select value={cpu} onChange={e => setCpu(e.target.value)}>
                        <option value="">Selecione uma CPU</option>
                        {cpuList.map(item => (
                            <option key={item.uid} value={item.uid}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                </Label>
                <Label>
                    GPU (opcional):
                    <Select value={gpu} onChange={e => setGpu(e.target.value)}>
                        <option value="">Selecione uma GPU</option>
                        {gpuList.map(item => (
                            <option key={item.uid} value={item.uid}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                </Label>
                <Label>
                    Placa-mãe (opcional):
                    <Select value={mobo} onChange={e => setMobo(e.target.value)}>
                        <option value="">Selecione uma Placa-mãe</option>
                        {moboList.map(item => (
                            <option key={item.uid} value={item.uid}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                </Label>
                <Label>
                    Fonte (PSU) (opcional):
                    <Select value={psu} onChange={e => setPsu(e.target.value)}>
                        <option value="">Selecione uma Fonte</option>
                        {psuList.map(item => (
                            <option key={item.uid} value={item.uid}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                </Label>
                <Label>
                    Tipo de Armazenamento:
                    <Select value={storageType} onChange={e => setStorageType(e.target.value)}>
                        <option value="SSD">SSD</option>
                        <option value="HDD">HDD</option>
                        <option value="M.2">M.2</option>
                    </Select>
                </Label>
                <Label>
                    Tamanho do {storageType} (GB): <span style={{color: "#f00"}}>*</span>
                    <Input
                        type="number"
                        min={64}
                        step={64}
                        value={storageSize}
                        onChange={e => setStorageSize(e.target.value)}
                        required
                    />
                </Label>
                <Label>
                    Orçamento (R$): <span style={{color: "#f00"}}>*</span>
                    <Input
                        type="number"
                        min={100}
                        step={50}
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        required
                    />
                </Label>
                <Button type="submit" disabled={loading}>
                    {loading ? "Buscando..." : "Gerar Build"}
                </Button>
            </form>
            <Button type="button" onClick={saveBuild} disabled={!result || !!result?.error}>
                Salvar Build
            </Button>
            <TableContainer>
                <h2>Resultado da Build</h2>
                {result ? (
                    result.error ? (
                        <div style={{ color: "red" }}>{result.error}</div>
                    ) : (
                        <ResultTable>
                            <thead>
                                <tr>
                                    <th>Componente</th>
                                    <th>Modelo</th>
                                    <th>Preço</th>
                                </tr>
                            </thead>
                            <tbody>
                                {["cpu", "gpu", "mobo", "psu", "ram", "storage"].map((key) =>
                                    result[key] && result[key].name ? (
                                        <tr key={key}>
                                            <td>{key.toUpperCase()}</td>
                                            <td>
                                                {(result[key].id || result[key].object_id) ? (
                                                    <a
                                                        href={`/produto/${result[key].id || result[key].object_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {result[key].name}
                                                    </a>
                                                ) : (
                                                    result[key].price && result[key].price.object_id ? (
                                                        <a
                                                            href={`/produto/${result[key].price.object_id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {result[key].name}
                                                        </a>
                                                    ) : (
                                                        result[key].name
                                                    )
                                                )}
                                            </td>
                                            <td>
                                                {result[key].price && typeof result[key].price.price === "number"
                                                    ? `R$ ${result[key].price.price.toFixed(2)}`
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ) : null
                                )}
                                {Number.isFinite(result.total_price) && (
                                    <tr>
                                        <td colSpan={2} style={{ fontWeight: "bold" }}>Total</td>
                                        <td style={{ fontWeight: "bold" }}>
                                            R$ {result.total_price.toFixed(2)}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </ResultTable>
                    )
                ) : (
                    <div>Preencha os dados e gere sua build!</div>
                )}
            </TableContainer>
        </FormContainer>
    );
}