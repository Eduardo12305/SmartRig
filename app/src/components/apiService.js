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

export const products = async (data) => {
    try {
        const response = await axiosInstance.get("/products", data)
        return data;
    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro ao carregar produtos");
    }
}

export const productscard = async (data) => {
    try {
        const response = await axiosInstance.get("/products/getAll", data)
        return response;
    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro ao carregar produtos");
    }
}