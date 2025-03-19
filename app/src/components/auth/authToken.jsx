export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

