import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import ExportController from "./controllers/ExportController";
import ImportController from "./controllers/ImportController";
import TypeController from "./controllers/TypeController";
import FlipController from "./controllers/FlipContoller";
import ArrangeController from "./controllers/ArrangeController";

const FunctionBtnContainer = () => {
  return (
    <Box sx={containerSx}>
      <ImportController />
      <ExportController />
      <FlipController />
      <TypeController />
      <ArrangeController />
    </Box>
  );
};

export default FunctionBtnContainer;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  m: 1,
  display: "flex",
  gap: 1,
};
