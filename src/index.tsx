import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AppContextProvider } from "./AppContext";
import { createTheme, ThemeProvider } from "@mui/material";
import { deepOrange, teal } from "@mui/material/colors";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: deepOrange,
  },
});

root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </ThemeProvider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
