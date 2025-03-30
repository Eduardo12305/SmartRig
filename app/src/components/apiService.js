import {axiosInstance} from "../utils/axionsInstance"

export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/users/register", userData);
        console.log("Voltou da api :)");
    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro no servidor");
    }
}

export const loginUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/users/login", userData);
        console.log("Login realizado com sucesso");
    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro na requisição login");
    }
}