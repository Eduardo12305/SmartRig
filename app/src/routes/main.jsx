import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "../components/auth/notAuthRoute";
import { Home } from "../pages/home";
import { Forbidden } from "../pages/error/forbidden";
import { Teste } from "../pages/teste";

export function AppRoutes () {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Home/>} />
            </Route>

            <Route >
                <Route path="/teste" element={<Teste/>} />
            </Route>

            {/* Pagina de erro */}
            <Route path="/forbidden" element={Forbidden}/>
        </Routes>
    )
}