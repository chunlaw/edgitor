import React, { useMemo } from "react";
import { Theme } from "@emotion/react";
import { Box, Divider, Paper, SxProps, Typography } from "@mui/material";
import { isIOS, isMobilOrTablet, isPWA } from "../utils";
import IosShareIcon from "@mui/icons-material/IosShare";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const PWAGuideline = () => {
  const shown = useMemo(() => isMobilOrTablet() && !isPWA(), []);

  if (shown) {
    return (
      <Box sx={rootSx}>
        <Paper sx={containerSx}>
          <Typography variant="h6">Install Edgitor as an App </Typography>
          <Divider />
          {isIOS() ? (
            <Box sx={instructionSx}>
              <Typography variant="body1">
                1. Open this website with Safari{" "}
              </Typography>
              <Typography variant="body1">
                2. Share <IosShareIcon />{" "}
              </Typography>
              <Typography variant="body1">3. Add to Home Screen</Typography>
            </Box>
          ) : (
            <Box sx={instructionSx}>
              <Typography variant="body1">
                1. Open this website with Chrome{" "}
              </Typography>
              <Typography variant="body1">
                2. Tap the menu icon <MoreVertIcon />{" "}
              </Typography>
              <Typography variant="body1">
                3. Add to Home screen / Install the app
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default PWAGuideline;

const rootSx: SxProps<Theme> = {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(0.5rem)",
};

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  p: 3,
  background: "rgba(255, 255, 255, 0.6)",
  borderRadius: 2,
  mx: 2,
};

const instructionSx: SxProps<Theme> = {
  my: 1,
};
