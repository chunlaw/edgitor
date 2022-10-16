import { Box, Typography } from "@mui/material";
import React from "react";

const Branding = () => (
  <Box
    sx={{
      position: "fixed",
      right: 0,
      bottom: 0,
      mb: 8,
      mr: 2,
    }}
  >
    <Typography
      variant="h4"
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
