import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { Rodape } from "./Rodape"
import styled from "styled-components";

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export function Layout() {
    return (
        <LayoutWrapper>
            <Header />
            <MainContent>
                <Outlet />
            </MainContent>
            <Rodape />
        </LayoutWrapper>
    )
}