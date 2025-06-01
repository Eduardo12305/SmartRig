import axios from "axios";

// Configura uma instância personalizada do axios
export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/", // URL da API
    headers: {
        "Content-Type": "application/json",
    },
});

//Instancia do axios para autenticação
export const axiosInstanceAuth = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para adicionar o token mais recente
axiosInstanceAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken"); // ou "token", conforme seu login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


