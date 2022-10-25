import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
import NodeConfigTable from "./settings/NodeConfigTable";
import EdgeConfigTable from "./settings/EdgeConfigTable";
import BackgroundConfigTable from "./settings/BackgroundConfigTable";
import MetadataConfigTable from "./settings/MetadataConfigTable";

const SettingsController = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<"Node" | "Edge" | "Background" | "Meta">(
    "Node"
  );
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
            <Tab value="Background" label="Background" />
            <Tab value="Meta" label="Metadata" />
          </Tabs>
          {tab === "Node" && <NodeConfigTable />}
          {tab === "Edge" && <EdgeConfigTable />}
          {tab === "Background" && <BackgroundConfigTable />}
          {tab === "Meta" && <MetadataConfigTable />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsController;

const headerSx: SxProps<Theme> = {
  display: "flex",
  alignContent: "center",
  justifyContent: "space-between",
  gap: 8,
};
