import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { Rodape } from "./Rodape"

export function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Rodape />
        </>
    )
}