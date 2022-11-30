import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import ExportController from "./controllers/ExportController";
import ImportController from "./controllers/ImportController";
import TypeController from "./controllers/TypeController";
import TransformController from "./controllers/TransformContoller";
import ArrangeController from "./controllers/ArrangeController";
import SettingsController from "./controllers/SettingsContoller";

const FunctionBtnContainer = () => {
  return (
    <Box sx={containerSx}>
      <ImportController />
      <ExportController />
      <TransformController />
      <TypeController />
      <ArrangeController />
      <SettingsController />
    </Box>
  );
};

export default FunctionBtnContainer;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  m: 1,
  overflowX: "scroll",
  gap: 1,
  width: "100vw",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  "> *": {
    pointerEvents: "auto",
  },
  "& button": {
    mx: 1,
  },

  // hide scroll bar
  "&::-webkit-scrollbar": {
    display: "none",
  },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};
