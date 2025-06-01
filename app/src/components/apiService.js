import {axiosInstance, axiosInstanceAuth} from "../utils/axionsInstance"

export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/users/register", userData);
        console.log("Voltou da api :)");
        console.log("✅ Sucesso:", response.status, response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erro no registro:", error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Erro no servidor");
    }
}

export const loginUser = async (userData) => {
    
    try {
        const response = await axiosInstance.post("/users/login", userData);

        return response.data;
        
    } catch (error) {

        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    throw new Error(data.message || data.error || "Dados inválidos. Verifique email e senha.");
                case 401:
                    throw new Error("Email ou senha incorretos.");
                case 403:
                    throw new Error("Acesso negado. Conta pode estar bloqueada.");
                case 404:
                    throw new Error("Usuário não encontrado.");
                case 422:
                    throw new Error("Dados inválidos. Verifique os campos preenchidos.");
                case 500:
                    throw new Error("Erro interno do servidor. Tente novamente mais tarde.");
                default:
                    throw new Error(data.message || "Erro na requisição de login");
            }
        }
        
        // Erro de rede ou conexão
        throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
    }
}

// Função para logout (se necessário)
export const logoutUser = async () => {
    try {
        const response = await axiosInstance.post("/users/logout");
        console.log("Logout realizado com sucesso");
        return response.data;
    } catch (error) {
        console.error("Erro no logout:", error.response?.data || error.message);
        // Não precisa throw aqui, pois logout local ainda deve funcionar
        return null;
    }
}

// Função para verificar se o token ainda é válido
export const verifyToken = async () => {
    try {
        const response = await axiosInstance.get("/users/verify");
        console.log("Token válido");
        return response.data;
    } catch (error) {
        console.error("Token inválido:", error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Token inválido");
    }
}

// PRODUTOS

export const product = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data.data

    } catch (error) {
        console.error(`Erro ao carregar produto ${id}:`, error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Erro ao carregar produto");
    }
}

export const produc_price = async (id) => {
    try {
        const response = await axiosInstance.get(`/prices/${id}`);
        return response

    } catch (error) {
        console.error(`Erro ao carregar preço do produto ${id}:`, error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Erro ao carregar preço do produto");
    }
}

export const productsCategory = async (category, params = {}) => {
    try {
        const response = await axiosInstance.get(`/products/${category}/`, {params} )
        return response;
    } catch (error) {
        console.error(`Erro ao carregar produtos da categoria ${category}:`, error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Erro ao carregar produtos");
    }
}

// Função para buscar produtos gerais
export const productscard = async (params = {}) => {
    try {
        const response = await axiosInstance.get("/products/", {params})
        return response;
        
    } catch (error) {
        console.error("Erro ao carregar produtos:", error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Erro ao carregar produtos");
    }
}

// Função para buscar produtos por pesquisa
export const searchProducts = async (searchTerm) => {
    try {
        const response = await axiosInstance.get(`/products/search/`, {
            params: { q: searchTerm }
        });
        console.log(`🔍 Busca por "${searchTerm}" realizada com sucesso`);
        return response.data;
    } catch (error) {
        console.error(`Erro na busca por "${searchTerm}":`, error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Erro ao buscar produtos");
    }
}

 export const buildPC = async (data) => {
    try {
        const response = await axiosInstanceAuth.post("/builds/gen", data)
        console.log(response.data);
        return response.data;
        
    } catch (error) {
        console.error("Erro ao construir PC:", error.response?.data || error.message);
        throw error.response ? error.response.data: new Error("Erro ao construir PC");
    }
 }

// Função para testar a conexão com a API
export const testConnection = async () => {
    try {
        const response = await axiosInstance.get("/health");
        console.log("Conexão com API funcionando");
        return true;
    } catch (error) {
        console.error("Erro de conexão com API:", error.message);
        return false;
    }
}