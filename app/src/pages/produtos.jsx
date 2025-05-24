import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { produc_price, product } from "../components/apiService";
import { ProductContainer, ProductImage, ProductInfo, ProductName, ProductPrice, ProductText } from "../components/css/product.styled";

export const Products = () => {
    const { id } = useParams();
    const [products, setProducts] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [price, setPrice] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await product(id);
                setProducts(response);

                const priceResponse = await produc_price(id);
                setPrice(priceResponse);
            } catch (error) {
                setErrorMessage(error.message || "Erro ao carregar produto");
            }
        };
        fetchProducts();
    }, [id]);

    if (errorMessage) return <p>{errorMessage}</p>;
    if (!products || !price) return <p>Carregando produto...</p>;

    const firstPrice = price.data[0];

    return (
        <>
            <ProductContainer>
                <ProductImage src={products.image} alt={products.name} />
                <ProductInfo>
                    <ProductName>{products.name}</ProductName>
                    <ProductText>Marca: {products.brand}</ProductText>
                    <ProductPrice>R$ {firstPrice ? firstPrice.price.toFixed(2) : "N/A"}</ProductPrice>

                    <h2>Descrição técnica</h2>
                    <ProductText>Marca: {products.brand}</ProductText>
                    <ProductText>Socket: {products.socket}</ProductText>
                    <ProductText>IGPU: {products.igpu}</ProductText>
                    <ProductText>TDP: {products.tdp}</ProductText>
                    <ProductText>Cores: {products.cores}</ProductText>
                    <ProductText>Velocidade sem overclock: {products.speed}</ProductText>
                    <ProductText>Velocidade com overclock: {products.turbo}</ProductText>
                </ProductInfo>
            </ProductContainer>
        </>
    );
};
