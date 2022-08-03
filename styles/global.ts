import { createGlobalStyle } from "styled-components";
import Screen from "./Screen";


export default createGlobalStyle`

  :root {

    --border-radius: 10px;
    --main-transition: all 0.3s ease-in-out;

    --grey-color-10: #ececec; 
    --grey-color-40: #aeaeae;
    --grey-color-50: #676767;

    --red-color: #db4646;
    --green-color: #339c33;

    --blue-color: #3357D3;

    --black-color: #202124;
  }

 
  *{
    margin: 0;
    padding:0;
    box-sizing:border-box
  }
  html {
    height: 100%;
  }
  body {
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.background};
    font: 400 16px Poppins, sans-serif;
    height: 100%;
    scroll-behavior: smooth; 
    font-size: 0.85rem;   
     
    ${Screen.sm`
    font-size: 0.562rem;  
    `}

${Screen.md`
  font-size: 0.625rem; 
  `}

${Screen.lg`
font-size: 1rem; 
  `}
    
 
  }


  a {
    text-decoration: none;
  }

  input {
    outline: none;
    border: none;
  }


  #__next {
  height: 100%;
  }
`;
