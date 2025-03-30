import axios from "axios";

// Configura uma instância personalizada do axios
export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/", // URL da API
    headers: {
        "Content-Type": "application/json",
    },
});


