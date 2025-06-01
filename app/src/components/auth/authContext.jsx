import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, decodeToken } from './authToken';

const AuthContext = createContext();

// Função para validar o token
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    // Verifica se o token tem data de expiração
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = decoded.exp <= currentTime;
      
      if (isExpired) {
        console.warn('Token expirado');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
};

// Função para obter cookies de forma segura
export const getUserCookies = () => {
  try {
    if (typeof document === 'undefined') {
      return { username: null, role: null };
    }

    const cookies = document.cookie.split('; ');
    
    const usernameCookie = cookies.find(row => row.startsWith('username='));
    const roleCookie = cookies.find(row => row.startsWith('role='));

    return {
      username: usernameCookie ? decodeURIComponent(usernameCookie.split('=')[1]) : null,
      role: roleCookie ? decodeURIComponent(roleCookie.split('=')[1]) : null,
    };
  } catch (error) {
    console.error('Erro ao obter cookies:', error);
    return { username: null, role: null };
  }
};

// Função para limpar estado de autenticação
export const clearAuth = () => {
  try {
    // Remover do localStorage
    setToken(null);
    
    // Limpar cookies de forma segura
    if (typeof document !== 'undefined') {
      const cookieOptions = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = `username=; ${cookieOptions}`;
      document.cookie = `role=; ${cookieOptions}`;
    }
  } catch (error) {
    console.error('Erro ao limpar autenticação:', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para inicializar autenticação
  const initializeAuth = useCallback(async () => {
    setLoading(true);
    
    try {
      
      const token = getToken();
      console.log('Token obtido:', token);
      
      if (token && isTokenValid(token)) {
        const decoded = decodeToken(token);
        
        if (decoded) {
          // Combina dados do token com cookies se disponíveis
          const cookieData = getUserCookies();
          const userData = {
            ...decoded,
            username: decoded.username || decoded.name || cookieData.username,
            role: decoded.role || decoded.roles || cookieData.role,
          };
          
          setUser(userData);
        } else {
          // Token inválido, limpa tudo
          clearAuth();
          setUser(null);
        }
      } else {
        // Token ausente ou inválido
        if (token) {
          clearAuth(); // Limpa token inválido
        }
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicializa autenticação quando o componente monta
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Verifica periodicamente se o token ainda é válido
  useEffect(() => {
    if (!user) return;

    const checkTokenValidity = () => {
      const token = getToken();
      if (!token || !isTokenValid(token)) {
        console.warn('Token expirado ou inválido, fazendo logout automático');
        logout();
      }
    };

    // Verifica a cada 5 minutos
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const isLoggedIn = !!user;

  // Função de login
  const login = useCallback((userData, token = null) => {
    try {
      if (token) {
        // Se recebeu um token, valida e salva
        if (isTokenValid(token)) {
          setToken(token);
          const decoded = decodeToken(token);
          setUser(decoded || userData);
        } else {
          throw new Error('Token inválido fornecido no login');
        }
      } else {
        // Se não recebeu token, apenas define os dados do usuário
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }, []);

  // Função de logout
  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  // Função para atualizar dados do usuário
  const updateUser = useCallback((newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  }, []);

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUser,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
