import { Box, Typography } from "@mui/material";
import React from "react";

const Branding = () => (
  <Box
    sx={{
      position: "fixed",
      right: 0,
      bottom: 0,
      mb: 6,
      mr: 1,
    }}
  >
    <Typography
      variant="h2"
      sx={{
        fontFamily: "Cantarell",
        color: "rgba(255, 255, 255, 0.4)",
        userSelect: "none",
      }}
    >
      EDGITOR
    </Typography>
  </Box>
);

export default Branding;
