import styled from "styled-components";

export const Card = styled.div`
background-color: ${(prop) => prop.cardcolor ? prop.cardcolor : "aqua"}; 
border: 1px solid hsl(0, 1.60%, 24.30%);

border-radius: ${(prop) => prop.border ? prop.border : "10px"};  // aumentar a borda, deixa mais aredondado
box-shadow:5px 5px 5px hsla(0,0%,0%,0.1);
padding: ${(prop) => prop.padding ? prop.padding : "20px"}; //tamanho do card
margin: ${(prop) => prop.margin ? prop.margin : "10px"}; 
text-align:center;
max-width:250px;
display:inline-block;

img{
    max-width: 60%;
    height: auto;
    border-radius: 50%;
    margin-bottom: 10px;
}

h2 {
    font-family: Arial, sans-serif;
    margin:0;
    color: ${(prop) => prop.colorh2 ? prop.colorh2 : "hsl(0, 0%, 20%)"};
}

p {
    font-family: Arial, sans-serif;
    color: hsl(0,0%,30%);
}
`