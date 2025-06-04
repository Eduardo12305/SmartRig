import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildsUser } from "../apiService";
import { Button } from "../../pages/auht/new_pc.styled.jsx";

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

    const containerStyle = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #f97316 100%)",
        padding: "2rem",
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };

    const contentStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "2rem",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)"
    };

    const headerStyle = {
        textAlign: "center",
        marginBottom: "2rem",
        color: "#1e3a8a",
        fontSize: "2.5rem",
        fontWeight: "700",
        background: "linear-gradient(135deg, #1e3a8a, #f97316)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    };

    const loadingStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        fontSize: "1.2rem",
        color: "#3b82f6",
        fontWeight: "500"
    };

    const errorStyle = {
        backgroundColor: "#fef2f2",
        border: "2px solid #f87171",
        borderRadius: "12px",
        padding: "1.5rem",
        color: "#dc2626",
        textAlign: "center",
        fontSize: "1.1rem",
        fontWeight: "500"
    };

    const emptyStateStyle = {
        textAlign: "center",
        padding: "4rem 2rem",
        color: "#64748b",
        fontSize: "1.2rem"
    };

    const emptyIconStyle = {
        fontSize: "4rem",
        marginBottom: "1rem",
        color: "#f97316"
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "1.5rem",
        padding: "0"
    };

    const cardStyle = {
        background: "linear-gradient(135deg, #ffffff, #f8fafc)",
        border: "2px solid transparent",
        borderRadius: "16px",
        padding: "1.5rem",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
    };

    const cardHoverStyle = {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
        borderImage: "linear-gradient(135deg, #3b82f6, #f97316) 1"
    };

    const cardHeaderStyle = {
        display: "flex",
        alignItems: "center",
        marginBottom: "1rem",
        paddingBottom: "1rem",
        borderBottom: "2px solid #e2e8f0"
    };

    const buildIconStyle = {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #3b82f6, #f97316)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "1rem",
        fontSize: "1.5rem",
        color: "white",
        fontWeight: "bold"
    };

    const buildNameStyle = {
        fontSize: "1.3rem",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0"
    };

    const buildIdStyle = {
        fontSize: "0.9rem",
        color: "#64748b",
        fontFamily: "monospace",
        backgroundColor: "#f1f5f9",
        padding: "0.25rem 0.5rem",
        borderRadius: "6px",
        marginTop: "0.5rem"
    };

    const buttonContainerStyle = {
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "flex-end"
    };

    const styledButtonStyle = {
        background: "linear-gradient(135deg, #3b82f6, #1e40af)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "0.75rem 1.5rem",
        fontSize: "0.95rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <div style={loadingStyle}>
                        <div style={{marginRight: "0.5rem"}}>🔄</div>
                        Carregando builds favoritas...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <div style={errorStyle}>
                        <div style={{fontSize: "2rem", marginBottom: "0.5rem"}}>⚠️</div>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!builds.length) {
        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <div style={emptyStateStyle}>
                        <div style={emptyIconStyle}>🔧</div>
                        <h3 style={{color: "#374151", marginBottom: "0.5rem"}}>
                            Nenhuma build favorita encontrada
                        </h3>
                        <p>Você ainda não tem builds favoritas. Explore e adicione suas builds preferidas!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={headerStyle}>🚀 Builds Favoritas</h1>
                
                <div style={gridStyle}>
                    {builds.map((build) => (
                        <div 
                            key={build.uid} 
                            style={cardStyle}
                            onMouseEnter={(e) => {
                                Object.assign(e.currentTarget.style, cardHoverStyle);
                            }}
                            onMouseLeave={(e) => {
                                Object.assign(e.currentTarget.style, cardStyle);
                            }}
                        >
                            <div style={cardHeaderStyle}>
                                <div style={buildIconStyle}>
                                    {(build.name || build.uid).charAt(0).toUpperCase()}
                                </div>
                                <div style={{flex: 1}}>
                                    <h3 style={buildNameStyle}>
                                        {build.name || `Build ${build.uid.slice(0, 8)}`}
                                    </h3>
                                    <div style={buildIdStyle}>
                                        ID: {build.uid.slice(0, 12)}...
                                    </div>
                                </div>
                            </div>
                            
                            <div style={buttonContainerStyle}>
                                <button
                                    style={styledButtonStyle}
                                    onClick={() => handleClick(build.uid)}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "linear-gradient(135deg, #f97316, #ea580c)";
                                        e.target.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "linear-gradient(135deg, #3b82f6, #1e40af)";
                                        e.target.style.transform = "scale(1)";
                                    }}
                                >
                                    Ver Detalhes →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}