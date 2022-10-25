import React, { useContext } from "react";
import "./App.css";
import { Box, SxProps, Theme } from "@mui/material";

import SvgContainer from "./components/SvgContainer";
import ZoomController from "./components/controllers/ZoomController";
import FunctionBtnContainer from "./components/FunctionBtnContainer";
import Panel from "./components/controllers/Panel";
import Branding from "./components/Branding";
import Copyright from "./components/Copyright";
import SingleNodePanel from "./components/nodePanel/SingleNodePanel";
import AppContext from "./AppContext";
import PWAGuideline from "./components/PWAGuildline";
import LoadingBox from "./components/LoadingBox";

function App() {
  const { panelRef } = useContext(AppContext);

  return (
    <Box sx={rootContainerSx}>
      <SvgContainer />
      <FunctionBtnContainer />
      <Panel ref={panelRef} />
      <SingleNodePanel />
      <Branding />
      <Copyright />
      <ZoomController />
      <LoadingBox />
      <PWAGuideline />
    </Box>
  );
}

export default App;

const rootContainerSx: SxProps<Theme> = {
  display: "flex",
  height: "100vh",
  widht: "100vw",
};
