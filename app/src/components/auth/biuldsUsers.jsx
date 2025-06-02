import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildsUser } from "../apiService";
import { Button } from "../../pages/auht/new_pc.styled";

export function BuildsUsers() {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBuilds() {
            setLoading(true);
            setError("");
            try {
                const data = await getBuildsUser();
                setBuilds(data);
            } catch (err) {
                setError("Erro ao carregar builds favoritas.");
            }
            setLoading(false);
        }
        fetchBuilds();
    }, []);

    const handleClick = (uid) => {
        navigate(`/build/${uid}`);
    };

    if (loading) return <div>Carregando builds favoritas...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!builds.length) return <div>Você ainda não tem builds favoritas.</div>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Builds Favoritas</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {builds.map((build) => (
                    <li key={build.uid} style={{ marginBottom: "1rem", border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
                        <div>
                            <strong>Build:</strong> {build.name || build.uid}
                        </div>
                        <div>
                            <Button onClick={() => handleClick(build.uid)}>
                                Ver detalhes
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}