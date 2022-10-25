import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  SxProps,
  Theme,
  Divider,
  TextField,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import AppContext from "../../AppContext";
import MetadataTable from "./MetadataTable";
import NodeGraphicTable from "./NodeGraphicTable";

const SingleNodePanel = () => {
  const { selectedNode, unsetNode, renameNodeLabel } = useContext(AppContext);
  const [label, setLabel] = useState<string>(selectedNode ?? "");
  const [tab, setTab] = useState<"Graphic" | "Metadata">("Graphic");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value);
    },
    [setLabel]
  );

  const handleBlur = useCallback(() => {
    if (selectedNode && label) {
      renameNodeLabel(selectedNode, label);
    }
  }, [selectedNode, label, renameNodeLabel]);

  useEffect(() => {
    setLabel(selectedNode ?? "");
  }, [selectedNode]);

  if (selectedNode === null) {
    return <></>;
  }

  return (
    <Paper sx={containerSx}>
      <Box sx={headerSx}>
        <Typography variant="h6">Node:</Typography>
        <TextField
          variant="standard"
          margin="normal"
          sx={nodeLabelSx}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <IconButton onClick={unsetNode}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab value="Graphic" label="Graphic" />
        <Tab value="Metadata" label="Metadata" />
      </Tabs>
      <Divider />
      <Box sx={{ maxHeight: "60vh", overflow: "scroll" }}>
        {tab === "Graphic" && <NodeGraphicTable />}
        {tab === "Metadata" && <MetadataTable />}
      </Box>
    </Paper>
  );
};

export default SingleNodePanel;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  mt: 7,
  mx: 1,
  p: 1,
  right: 0,
  minWidth: 300,
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  px: 1,
};

const nodeLabelSx: SxProps<Theme> = {
  m: 1,
  flex: 1,
};
