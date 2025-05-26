import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "../components/auth/notAuthRoute";
import { Home } from "../pages/home";
import { Forbidden } from "../pages/error/forbidden";
import { Register } from "../pages/register";
import { Products } from "../pages/produtos";
import { CategoryPage } from "../pages/category";
import { CardPage } from "../components/card";
import { Layout } from "../components/layout";

export function AppRoutes () {
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<Home/>} />
                </Route>

                <Route >
                    <Route path="/register" element={<Register/>} />
                </Route>

                <Route>
                    <Route path="/produto/:id" element={<Products />} /> //produto especifico //
                </Route>

                <Route>
                    <Route path="/prices/:id" element={<Products />} /> //preço produto especifico //
                </Route>

                <Route>
                    <Route path="/produtos/:category" element={<CategoryPage/>} /> // categoria de produtos//
                </Route>

                <Route>
                    <Route path="produtos/search/:search"  element={<CardPage/> } />
                </Route>

                {/* Pagina de erro */}
                <Route path="/forbidden" element={Forbidden}/>
            </Route>
        </Routes>
    )
}