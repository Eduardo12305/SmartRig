import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "../components/auth/notAuthRoute";
import { Home } from "../pages/home";
import { Forbidden } from "../pages/error/forbidden";
import { Register } from "../pages/register";
import { LoginModal } from "../components/loginModal";

export function AppRoutes () {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Home/>} />
            </Route>

            <Route >
                <Route path="/register" element={<Register/>} />
            </Route>


            {/* Pagina de erro */}
            <Route path="/forbidden" element={Forbidden}/>
        </Routes>
    )
}