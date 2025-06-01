import { useState } from "react";
import { buildPC } from "../../components/apiService";
import { FormContainer, Label, Select, Input, Button, ResultTable, TableContainer } from "./new_pc.styled";

export const NewPC = () => {
    const [cpu, setCpu] = useState("");
    const [gpu, setGpu] = useState("");
    const [mobo, setMobo] = useState("");
    const [psu, setPsu] = useState("");
    const [storageType, setStorageType] = useState("SSD");
    const [storageSize, setStorageSize] = useState("");
    const [budget, setBudget] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

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
                storage: Number(storageSize)
            };
            const res = await buildPC(data);
            setResult(res);
        } catch (err) {
            setResult({ error: err.detail ? JSON.stringify(err.detail) : err.message || "Erro ao gerar build" });
        }
        setLoading(false);
    };

    return (
        <FormContainer>
            
            <form onSubmit={handleSubmit}>
                <h1>Monte seu PC</h1>
                <Label>
                    CPU (opcional):
                    <Input
                        type="text"
                        value={cpu}
                        onChange={e => setCpu(e.target.value)}
                        placeholder="Ex: Intel i5-10400"
                    />
                </Label>
                <Label>
                    GPU (opcional):
                    <Input
                        type="text"
                        value={gpu}
                        onChange={e => setGpu(e.target.value)}
                        placeholder="Ex: GTX 1660"
                    />
                </Label>
                <Label>
                    Placa-mãe (opcional):
                    <Input
                        type="text"
                        value={mobo}
                        onChange={e => setMobo(e.target.value)}
                        placeholder="Ex: B450M"
                    />
                </Label>
                <Label>
                    Fonte (PSU) (opcional):
                    <Input
                        type="text"
                        value={psu}
                        onChange={e => setPsu(e.target.value)}
                        placeholder="Ex: Corsair 500W"
                    />
                </Label>
                <Label>
                    Tipo de Armazenamento:
                    <Select value={storageType} onChange={e => setStorageType(e.target.value)}>
                        <option value="SSD">SSD</option>
                        <option value="HD">HD</option>
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