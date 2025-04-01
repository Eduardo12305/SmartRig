import { createGlobalStyle }from "styled-components";

export const StyleBody = createGlobalStyle`
body {
background-color: ${(prop) => prop.color ? prop.color: 'rgb(207,207,207)'};
margin: 0;
padding: 0;
}
`


