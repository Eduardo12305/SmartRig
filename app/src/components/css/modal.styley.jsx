import styled from 'styled-components'

export const Wrapper = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background-color: rgba(0,0,0,0.7);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
`;

export const Modal = styled.div`
position: relative;
width: 100%;
/* max-width: 400px; */
max-width: ${(prop) => prop.width ? prop.width : '400px'};
background-color: #ffffff;
/* padding: 2rem; */
padding: ${(prop) => prop.padd ? prop.padd : '2rem'};
border-radius: 10px;
box-shadow: 0 4px 10px rgba(0,0,0,0.3);
display: flex;
flex-direction: column;
align-items: center;
text-align: center;

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 100px;
  font-size: 1rem;
};

h2 {
    color: ${(prop) => prop.color ? prop.color :  'aqua'};
    top: ${(prop) => prop.top ? prop.top : '-40px'}; //Alterar a altura em relação ao modal
    position: relative;
    height: 100%;
}
`;

export const CloseButton = styled.button `
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: red;
  color: white;
  font-size: 18px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

export const Form = styled.form`
width: 100%;
display: flex;
flex-direction: column;
gap: 1.5rem;
`





