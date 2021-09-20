import React from "react";
import ReactDOM from "react-dom";
import { AppRouter } from "./route/Router";

import GlobalStyles from "./View/global";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <AppRouter />
  </React.StrictMode>,
  document.getElementById("root")
);
