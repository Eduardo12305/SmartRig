import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBuildDetail } from "../apiService";

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

    if (loading) return <div>Carregando detalhes...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!build) return <div>Build não encontrada.</div>;

    const buildData = build.data || build;

    return (
        <div style={{ padding: "2rem", maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#2d3748" }}>Detalhes da Build</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
                <thead>
                    <tr>
                        <th style={{ background: "#f7fafc", color: "#333", padding: 10, borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>Componente</th>
                        <th style={{ background: "#f7fafc", color: "#333", padding: 10, borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>Nome</th>
                        <th style={{ background: "#f7fafc", color: "#333", padding: 10, borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(buildData).map(([key, value]) =>
                        key !== "uid" && value && typeof value === "object" && value.name ? (
                            <tr key={key}>
                                <td style={{ padding: 10, borderBottom: "1px solid #e2e8f0", fontWeight: 500 }}>{key.toUpperCase()}</td>
                                <td style={{ padding: 10, borderBottom: "1px solid #e2e8f0" }}>
                                    {value.object_id || value.id ? (
                                        <a
                                            href={`/produto/${value.object_id || value.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#3182ce", textDecoration: "underline" }}
                                        >
                                            {value.name}
                                        </a>
                                    ) : (
                                        value.name
                                    )}
                                </td>
                                <td style={{ padding: 10, borderBottom: "1px solid #e2e8f0" }}>
                                    {value.price && typeof value.price.price === "number"
                                        ? `R$ ${value.price.price.toFixed(2)}`
                                        : "-"}
                                </td>
                            </tr>
                        ) : null
                    )}
                </tbody>
            </table>
            <div style={{ textAlign: "center", color: "#718096" }}>
                UID da Build: <b>{buildData.uid || uid}</b>
            </div>
        </div>
    );
}