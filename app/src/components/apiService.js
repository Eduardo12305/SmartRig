import {axiosInstance} from "../utils/axionsInstance"

export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/users/register", userData);
        console.log("Voltou da api :)");
        console.log("✅ Sucesso:", response.status, response.data);
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

// PRODUTOS

export const product = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data.data

    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro ao carregar produto");
    }
}

export const produc_price = async (id) => {
    try {
        const response = await axiosInstance.get(`/prices/${id}`);
        return response

    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro ao carregar produto");
    }
}

export const productsCategory = async (category, params = {}) => {
    try {
        const response = await axiosInstance.get(`/products/${category}/`, {params} )
        return response;
    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro ao carregar produtos");
    }
}

// Função para buscar produtos gerais
export const productscard = async (params = {}) => {
    try {
        const response = await axiosInstance.get("/products/", {params})
        return response;
        
    } catch (error) {
        throw error.response ? error.response.data: new Error("Erro ao carregar produtos");
    }
}


