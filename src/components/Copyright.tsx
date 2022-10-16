import React from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";

const Copyright = () => {
  return (
    <Box sx={containerSx}>
      <Typography
        variant="subtitle2"
        color="GrayText"
        sx={{ cursor: "pointer" }}
        onClick={() => window.open("https://chunlaw.io")}
      >
        © Chun Law 2022
      </Typography>
    </Box>
  );
};

export default Copyright;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  bottom: 0,
  right: 0,
  mr: 2,
  mb: 1,
};
