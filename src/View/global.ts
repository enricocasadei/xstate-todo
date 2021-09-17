import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  html {
    box-sizing: border-box;
    height: 100%;
  }
  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }
  body {
    margin: 0;
    min-height: 100%;
    font-family: Titillium Web, sans-serif;
  }
  #root {
    display: flex;
    min-height: 100vh;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p, 
  p + p {
    margin: 0;
  }
`;
