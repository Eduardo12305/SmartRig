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

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Detalhes da Build</h2>
            <pre>{JSON.stringify(build, null, 2)}</pre>
            {/* Aqui você pode formatar os detalhes como quiser */}
        </div>
    );
}