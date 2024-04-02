import {
  Box,
  CircularProgress,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import AppContext from "../AppContext";

const LoadingBox = () => {
  const { isLoading } = useContext(AppContext);

  if (isLoading) {
    return (
      <Box sx={containerSx}>
        <CircularProgress size={64} />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default LoadingBox;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  display: "flex",
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 2,
  backdropFilter: "blur(0.5rem)",
};
