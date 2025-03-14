import { Outlet, Navigate } from "react-router-dom";

const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find(row => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const PublicRoute = () => {
    const isAuthenticated = getCookie('authToken');

    return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};
