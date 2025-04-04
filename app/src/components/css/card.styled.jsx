import styled from "styled-components";

export const Card = styled.div`
background-color: aqua;
border: 1px solid hsl(0, 1.60%, 24.30%);
border-radius:10px;
box-shadow:5px 5px 5px hsla(0,0%,0%,0.1);
padding:20px;
margin:10px;
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
    color: hsl(0,0%,20%);
}

p {
    font-family: Arial, sans-serif;
    color: hsl(0,0%,30%);
}
`