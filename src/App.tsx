import React, { useContext } from "react";
import "./App.css";
import { Box, SxProps, Theme } from "@mui/material";

import SvgContainer from "./components/SvgContainer";
import ZoomController from "./components/controllers/ZoomController";
import FunctionBtnContainer from "./components/FunctionBtnContainer";
import Panel from "./components/controllers/Panel";
import Branding from "./components/Branding";
import Copyright from "./components/Copyright";
import SingleNodePanel from "./components/controllers/SingleNodePanel";
import AppContext from "./AppContext";
import { isMobilOrTablet, isPWA } from "./utils";
import PWAGuideline from "./components/PWAGuildline";

function App() {
  const { panelRef } = useContext(AppContext);

  if (isMobilOrTablet() && !isPWA()) {
    return <PWAGuideline />;
  }

  return (
    <Box sx={rootContainerSx}>
      <SvgContainer />
      <FunctionBtnContainer />
      <Panel ref={panelRef} />
      <SingleNodePanel />
      <Branding />
      <Copyright />
      <ZoomController />
    </Box>
  );
}

export default App;

const rootContainerSx: SxProps<Theme> = {
  display: "flex",
  height: "100vh",
  widht: "100vw",
};
