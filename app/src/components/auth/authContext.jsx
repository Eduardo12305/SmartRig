import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, decodeToken } from './authToken';  // Importação correta das funções

// Cria o contexto de autenticação
const AuthContext = createContext();

// Função auxiliar para verificar se o token é válido
const isTokenValid = (token) => {
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    const expirationDate = new Date(decoded.exp * 1000);  // exp é o timestamp em segundos
    return expirationDate > new Date();  // Verifica se o token ainda não expirou
  }
  return true;  // Se não houver campo de expiração, assume que o token é válido
};

// Função para obter o usuário dos cookies
export const getUserCookies = () => {
  const username = document.cookie.split('; ').find(row => row.startsWith('username='));
  const role = document.cookie.split('; ').find(row => row.startsWith('role='));

  return {
    username: username ? username.split('=')[1] : null,
    role: role ? role.split('=')[1] : null,
  };
};

// Provider para envolver o app e fornecer o estado de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();  // Obtém o token do localStorage
    if (token && isTokenValid(token)) {
      const decoded = decodeToken(token);  // Decodifica o token
      setUser(decoded);  // Armazena as informações do usuário no estado
    } else {
      setUser(null);  // Se o token for inválido ou expirado, limpa o estado de autenticação
    }
  }, []);  // Executa a verificação apenas uma vez, ao carregar o componente

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Função para limpar o estado de autenticação, caso necessário (ex: logout)
export const clearAuth = () => {
  localStorage.removeItem('authToken');
  document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
};
