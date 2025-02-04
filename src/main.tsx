import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppContextProvider } from "./AppContext";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { deepOrange, teal } from "@mui/material/colors";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: deepOrange,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          userSelect: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route
        path="*"
        element={
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </ThemeProvider>
        }
      />
    </Routes>
  </BrowserRouter>
  //</React.StrictMode>
);
