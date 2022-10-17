import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import AppContext from "../../AppContext";
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import NodeConfig from "./config/NodeConfig";
import EdgeConfig from "./config/EdgeConfig";

const ConfigController = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<"Node" | "Edge">("Node");
  const { resetConfig } = useContext(AppContext);

  return (
    <>
      <Button
        startIcon={<SettingsIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Settings
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
        <DialogTitle>
          <Box sx={headerSx}>
            <Typography variant="h5">Settings</Typography>
            <Tooltip title="Reset to default">
              <IconButton onClick={resetConfig}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab value="Node" label="Node" />
            <Tab value="Edge" label="Edge" />
          </Tabs>
          <Divider />
          {tab === "Node" && <NodeConfig />}
          {tab === "Edge" && <EdgeConfig />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfigController;

const headerSx: SxProps<Theme> = {
  display: "flex",
  alignContent: "center",
  justifyContent: "space-between",
};
