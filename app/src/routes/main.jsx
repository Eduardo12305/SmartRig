import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "../components/auth/notAuthRoute";
import { Home } from "../pages/home";

export function AppRoutes () {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Home/>} />
            </Route>
        </Routes>
    )
}