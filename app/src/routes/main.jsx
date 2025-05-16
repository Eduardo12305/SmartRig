import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "../components/auth/notAuthRoute";
import { Home } from "../pages/home";
import { Forbidden } from "../pages/error/forbidden";
import { Register } from "../pages/register";
import { Products } from "../pages/produtos";
import { Categoty } from "../pages/category";

export function AppRoutes () {
    return (
        <Routes>
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
                <Route path="/produtos/:category/" element={<Categoty/>} /> // categoria de produtos//
            </Route>

            {/* Pagina de erro */}
            <Route path="/forbidden" element={Forbidden}/>
        </Routes>
    )
}