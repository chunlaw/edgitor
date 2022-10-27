import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import TermsAndCondition from "./legal/TermsAndConditions";
import PrivacyPolicy from "./legal/PrivacyPolicy";

const Copyright = () => {
  const [dialog, setDialog] = useState<
    "Terms And Conditions" | "Privacy Policy" | null
  >(null);
  return (
    <Box sx={containerSx}>
      <Typography
        variant="caption"
        color="MenuText"
        sx={{ cursor: "pointer" }}
        onClick={() => window.open("https://github.com/chunlaw/edgitor/issues")}
      >
        Issues
      </Typography>
      <Typography
        variant="caption"
        color="MenuText"
        sx={{ cursor: "pointer" }}
        onClick={() => setDialog("Terms And Conditions")}
      >
        Terms And Conditions
      </Typography>
      <Typography
        variant="caption"
        color="MenuText"
        sx={{ cursor: "pointer" }}
        onClick={() => setDialog("Privacy Policy")}
      >
        Privacy Policy
      </Typography>
      <Typography
        variant="caption"
        color="MenuText"
        sx={{ cursor: "pointer" }}
        onClick={() => window.open("https://chunlaw.io")}
      >
        © Chun Law 2022
      </Typography>
      <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)}>
        <DialogContent>
          {dialog === "Terms And Conditions" && <TermsAndCondition />}
          {dialog === "Privacy Policy" && <PrivacyPolicy />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Copyright;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  display: "flex",
  bottom: 0,
  right: 0,
  gap: 0.5,
  mr: 2,
  mb: 1,
  px: 0.5,
  borderRadius: 1,
  background: "rgba( 255, 255, 255, 0.4)",
};
