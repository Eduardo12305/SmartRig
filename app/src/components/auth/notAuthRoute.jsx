import { Outlet, Navigate } from "react-router-dom";
import {getUserCookies} from "./authContext"

export const PublicRoute = () => {
  const { username, role } = getUserCookies();

  // Verifica se o usuário está autenticado com base nos cookies (username e role)
  const isAuthenticated = username && role;

  // Se o usuário estiver autenticado, redireciona para a página /home
  if (!isAuthenticated) {
    return <Outlet />;
  } else {
    // Se não estiver autenticado, redireciona para a página inicial (/)
    return <Navigate to="/teste" />;
  }

  // Outlet pode ser usado caso você tenha uma estrutura de rotas aninhadas
  // return <Outlet />;
};
