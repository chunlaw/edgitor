import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  SxProps,
  Tab,
  Tabs,
  TextField,
  Theme,
} from "@mui/material";
import AppContext from "../../AppContext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ExportController = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<"SVG" | "JSON">("SVG");
  const { graph } = useContext(AppContext);

  return (
    <>
      <Button
        startIcon={<FileDownloadIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Export
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
        <DialogTitle>Export</DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab value="SVG" label="SVG" />
            <Tab value="JSON" label="JSON" />
          </Tabs>
          <TextField
            sx={textAreaSx}
            value={
              tab === "SVG"
                ? document.getElementById("edgitor")?.outerHTML
                : JSON.stringify(graph, null, 2)
            }
            multiline
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportController;

const textAreaSx: SxProps<Theme> = {
  my: 1,
  minWidth: "60vw",
  caretColor: "transparent",
};
