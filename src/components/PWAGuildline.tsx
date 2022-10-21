import React from "react";
import { Theme } from "@emotion/react";
import { Box, Divider, SxProps, Typography } from "@mui/material";
import { isIOS } from "../utils";
import IosShareIcon from "@mui/icons-material/IosShare";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const PWAGuideline = () => {
  return (
    <Box sx={containerSx}>
      <Box
        component={"img"}
        src="/edgitor-share.png"
        alt="Cover"
        style={{ maxWidth: "80%" }}
      />
      <Typography variant="h6">
        Install the app in your mobile device{" "}
      </Typography>
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
    </Box>
  );
};

export default PWAGuideline;

const containerSx: SxProps<Theme> = {
  background: "#aaa",
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const instructionSx: SxProps<Theme> = {
  my: 1,
};
