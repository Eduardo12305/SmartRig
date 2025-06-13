import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "../components/auth/notAuthRoute";
import { Home } from "../pages/home";
import { Forbidden } from "../pages/error/forbidden";
import { Register } from "../pages/register";
import { Products } from "../pages/produtos";
import { CategoryPage } from "../pages/category";
import { CardPage } from "../components/card";
import { Layout } from "../components/layout";
import  NewPC  from "../pages/auht/new_pc";
import PrivateRoute from "../components/auth/private-router";
import { BuildDetail } from "../components/auth/buildDetail";
import { BuildsUsers } from "../components/auth/biuldsUsers";


export function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Rotas Públicas */}
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/produto/:id" element={<Products />} />
                    <Route path="/prices/:id" element={<Products />} />
                    <Route path="/produtos/:category" element={<CategoryPage />} />
                    <Route path="/produtos/search/:search" element={<CardPage />} />
                </Route>

                {/* Rotas Privadas */}
                <Route element={<PrivateRoute />}>
                    <Route path="/produtos/monte-seu-pc" element={<NewPC />} />
                    <Route path="/favoritos" element={<BuildsUsers />} />
                    <Route path="/build/:uid" element={<BuildDetail />} />
                </Route>

                {/* Páginas de Erro */}
                <Route path="/forbidden" element={<Forbidden />} />
            </Route>
        </Routes>
    );
}