import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import ExportController from "./controllers/ExportController";
import ImportController from "./controllers/ImportController";
import TypeController from "./controllers/TypeController";
import TransformController from "./controllers/TransformContoller";
import ArrangeController from "./controllers/ArrangeController";
import ConfigController from "./controllers/ConfigContoller";

const FunctionBtnContainer = () => {
  return (
    <Box sx={containerSx}>
      <ImportController />
      <ExportController />
      <TransformController />
      <TypeController />
      <ArrangeController />
      <ConfigController />
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
  "& button": {
    mx: 1,
  },
};
