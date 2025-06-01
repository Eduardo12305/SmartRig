// Função para decodificar Base64 de forma segura em qualquer ambiente
const safeBase64Decode = (str) => {
  try {
    // Remove caracteres inválidos e normaliza o Base64
    let cleanStr = str.replace(/[^A-Za-z0-9+/]/g, '');
    
    // Adiciona padding se necessário
    while (cleanStr.length % 4) {
      cleanStr += '=';
    }
    
    // Verifica se estamos em um ambiente com window/atob disponível
    if (typeof window !== 'undefined' && window.atob) {
      return window.atob(cleanStr);
    }
    
    // Fallback para ambientes Node.js ou que não têm atob
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(cleanStr, 'base64').toString('utf-8');
    }
    
    // Implementação manual do Base64 decode como último recurso
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    cleanStr = cleanStr.replace(/[^A-Za-z0-9+/]/g, '');
    
    while (i < cleanStr.length) {
      const encoded1 = chars.indexOf(cleanStr.charAt(i++));
      const encoded2 = chars.indexOf(cleanStr.charAt(i++));
      const encoded3 = chars.indexOf(cleanStr.charAt(i++));
      const encoded4 = chars.indexOf(cleanStr.charAt(i++));
      
      if (encoded1 === -1 || encoded2 === -1) break;
      
      const bitmap = (encoded1 << 18) | (encoded2 << 12) | 
                    ((encoded3 === -1 ? 0 : encoded3) << 6) | 
                    (encoded4 === -1 ? 0 : encoded4);
      
      result += String.fromCharCode((bitmap >> 16) & 255);
      if (encoded3 !== -1 && encoded3 !== 64) {
        result += String.fromCharCode((bitmap >> 8) & 255);
      }
      if (encoded4 !== -1 && encoded4 !== 64) {
        result += String.fromCharCode(bitmap & 255);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Erro na decodificação Base64:', error);
    throw new Error('Token inválido ou corrompido');
  }
};

// Função para obter token do localStorage de forma segura
export const getToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      console.log('🔐 Token recuperado:', token);
      return token;
    }
    console.warn('window ou localStorage não disponível');
    return null;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
};


// Função para salvar token no localStorage de forma segura
export const setToken = (token) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
};

// Função para decodificar token JWT de forma segura
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    // Limpa o token removendo prefixos como "Bearer "
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    
    if (!cleanToken) {
      return null;
    }

    // Divide o JWT nas suas três partes
    const parts = cleanToken.split('.');
    
    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;

    // Valida se as partes não estão vazias
    if (!header || !payload || !signature) {
      return null;
    }

    // Decodifica o payload (parte que contém os dados do usuário)
    const decodedPayload = safeBase64Decode(payload);
    
    if (!decodedPayload) {
      return null;
    }

    // Tenta fazer o parse do JSON
    const parsedPayload = JSON.parse(decodedPayload);

    return parsedPayload;

  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};