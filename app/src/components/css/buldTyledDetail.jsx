import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

export const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  padding: 2rem;
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
`;

export const NotFoundMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  padding: 2rem;
`;

export const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const ComponentCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const ComponentHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

export const ComponentType = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ComponentBody = styled.div`
  padding: 1.5rem;
`;

export const ComponentImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export const ComponentName = styled.h4`
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SpecLabel = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SpecValue = styled.span`
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
`;

export const PricesSection = styled.div`
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
`;

export const PricesTitle = styled.h5`
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1rem;
`;

export const PriceCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid ${props => props.sale ? '#28a745' : '#007bff'};
`;

export const StoreName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

export const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.sale ? '#28a745' : '#2c3e50'};
`;

export const OldPrice = styled.span`
  font-size: 1rem;
  color: #6c757d;
  text-decoration: line-through;
`;

export const SaleBadge = styled.span`
  background: #28a745;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const CollectedDate = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
`;

export const BuildUid = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const UidLabel = styled.span`
  font-size: 0.9rem;
  color: #6c757d;
  display: block;
  margin-bottom: 0.5rem;
`;

export const UidValue = styled.code`
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #2c3e50;
`;