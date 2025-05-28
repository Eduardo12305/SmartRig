import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 1000;
`;

export const Modal = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  max-width: ${(prop) => (prop.width ? prop.width : "400px")};
  background-color: ${(prop) =>
    prop.background ? prop.background : "#ffffff"};
  padding: ${(prop) => (prop.padd ? prop.padd : "2rem")};
  ${(prop) => (prop.radius ? prop.radius : "10px")};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #000000;
    border-radius: 100px;
    font-size: 1rem;
  }

  h2 {
    color: ${(prop) => (prop.color ? prop.color : "#000")};
    top: ${(prop) =>
      prop.top ? prop.top : "-40px"}; //Alterar a altura em relação ao modal
    position: relative;
    height: 100%;
  }

  /* @media (max-width:745px) {
    input {
      width: 10%;
      border: 1px solid #ff9c07;
      
    }
  } */
`;

export const CloseButton = styled.button`
  all: unset;
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  width: 3rem;
  height: 3rem;
  background: white;
  color: gray;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1100;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: #ff8c00;
    color: white;
    transition: background 0.3s ease, color 0.3s ease;
  }
`;
export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  button {
    margin: 0 auto;
    padding: 10px 75px;
    font-weight: bold;
    background-color: #ff8c00;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      color: #ff8c00;
      background-color: white;
      box-shadow: 0 0 0 1px #ff8c00 inset;
      transition: background 0.3s ease;
    }
  }

  label {
    font-size: 1rem;
    color: ${(prop) => (prop.color ? prop.color : "#007bff")};
    gap: 100px;
    font-weight: bold;
  }
`;
export const ErrorMenss = styled.div`
  color: ${(prop) => (prop.color ? prop.color : "red")};
  font-size: ${(prop) => (prop.fontSize ? prop.fontSize : "0.9rem")};
  margin-top: ${(prop) => (prop.marginT ? prop.marginT : "0.5rem")};
`;

export const Cursor = styled.a`
  cursor: ${(prop) => (prop.cursor ? prop.cursor : "pointer")};
`;
