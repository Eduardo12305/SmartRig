import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsCategory } from "./apiService";

export const CategoryCard = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Mapeamento de categorias para nomes amigáveis
  const categoryNames = {
    cpu: "Processadores",
    gpu: "Placas de Vídeo", 
    mobo: "Placas Mãe",
    ram: "Memórias RAM",
    psu: "Fontes de Alimentação",
    storage: "Armazenamento"
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");
      
      try {
        console.log(`🔍 Buscando produtos da categoria: ${category}`);
        const response = await productsCategory(category);
        const data = response?.data || [];
        
        console.log(`✅ ${data.length} produtos encontrados`);
        setProducts(data);
      } catch (error) {
        console.error("❌ Erro ao carregar produtos:", error);
        setErrorMessage(error.message || "Erro ao carregar produtos da categoria");
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchData();
    }
  }, [category]);

  // Função para formatar preço
  const formatPrice = (price) => {
    if (!price) return "Preço não disponível";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Renderização de erro
  if (errorMessage) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Ops! Algo deu errado</h2>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <button onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Renderização de loading
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Categoria: {categoryNames[category] || category?.toUpperCase()}</h2>
        <p>Carregando produtos...</p>
        <div style={{ 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Cabeçalho da categoria */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>{categoryNames[category] || category?.toUpperCase()}</h1>
        <p style={{ color: '#666' }}>
          {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lista de produtos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              {/* Imagem do produto (se disponível) */}
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                  }}
                />
              )}

              {/* Nome do produto */}
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#333',
                fontSize: '1.2rem'
              }}>
                {product.name || product.title}
              </h3>

              {/* Descrição */}
              {product.description && (
                <p style={{ 
                  color: '#666', 
                  marginBottom: '1rem',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </p>
              )}

              {/* Especificações técnicas (exemplo para diferentes categorias) */}
              {category === 'cpu' && product.specs && (
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <p><strong>Cores:</strong> {product.specs.cores || 'N/A'}</p>
                  <p><strong>Frequência:</strong> {product.specs.frequency || 'N/A'}</p>
                </div>
              )}

              {category === 'gpu' && product.specs && (
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <p><strong>VRAM:</strong> {product.specs.vram || 'N/A'}</p>
                  <p><strong>Arquitetura:</strong> {product.specs.architecture || 'N/A'}</p>
                </div>
              )}

              {category === 'ram' && product.specs && (
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <p><strong>Capacidade:</strong> {product.specs.capacity || 'N/A'}</p>
                  <p><strong>Velocidade:</strong> {product.specs.speed || 'N/A'}</p>
                </div>
              )}

              {/* Preço */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 'auto'
              }}>
                <span style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold', 
                  color: '#e74c3c' 
                }}>
                  {formatPrice(product.price)}
                </span>
                
                <button style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Ver Detalhes
                </button>
              </div>

              {/* Badge de disponibilidade */}
              {product.inStock !== undefined && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: product.inStock ? '#27ae60' : '#e74c3c',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {product.inStock ? 'Em Estoque' : 'Indisponível'}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '3rem',
            color: '#666' 
          }}>
            <h3>Nenhum produto encontrado</h3>
            <p>Não há produtos disponíveis nesta categoria no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};