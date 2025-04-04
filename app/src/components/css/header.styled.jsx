import styled from "styled-components";

export const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2%;
  transition: background-color 0.3s, padding 0.3s;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgb(33, 33, 33);
  font-family: 'Poppins', sans-serif;
  flex-wrap: wrap;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  width: auto;
`;

export const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
`;

export const NavItem = styled.li`
  display: inline-block;
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: var(--whitecolor);
  font-size: 1.2rem;
  transition: color 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--darkcolor);
  }
`;

export const IconSoft = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

export const LinkWithText = styled.button`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
`;

export const IconImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const Name = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;
