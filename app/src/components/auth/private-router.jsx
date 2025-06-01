import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <div>Carregando...</div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const PrivateRoute = ({ redirectTo = "/forbidden" }) => {
  const { isLoggedIn, loading, user } = useAuth();
  
  // Log para debug apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('PrivateRoute - Estado:', { 
      isLoggedIn, 
      loading, 
      hasUser: !!user,
      userInfo: user ? { username: user.username, role: user.role } : null
    });
  }

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redireciona se não estiver autenticado
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Renderiza as rotas protegidas
  return <Outlet />;
};

export default PrivateRoute;