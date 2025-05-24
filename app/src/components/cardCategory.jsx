import { useEffect, useState } from "react";
import { productsCategory } from "./apiService";
import { useParams } from "react-router-dom";

export const CategoryCard = () => {
    const {category} = useParams();
    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=> {
        const fetchData = async () => {
            try {
                const response = await productsCategory(category);
                const data = response?.data || [];
                setProducts(data);
            } catch (error) {
                setErrorMessage(error.message || "Erro ao carregar produtos");
            }
        };
        fetchData();
    }, [category]);

      if (errorMessage) return <p>{errorMessage}</p>;

      return (
    <div>
      <h2>Categoria: {category}</h2>
      <div>
        {products.length > 0 ? (
          products.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <p>Carregando produtos...</p>
        )}
      </div>
    </div>
  );
    
};