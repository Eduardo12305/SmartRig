import { useState } from "react";
import { productsCategory } from "./apiService";

export const CategoryCard = () => {
    const [category, setCategory] = useState("");
    const [startIndex, setStartIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const teste = async () => {
        try {
            const response = await productsCategory();
            const data = response.data?.data || [];
            const dataWithCategory = data.map((category) => {
                return {}
            })
        } catch (error) {
            setErrorMessage(error.message || "Erro ao carregar pagina de categoria");
        }
    }
}