import React, { useContext, useMemo, useState } from "react";
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
  TextField,
  Theme,
} from "@mui/material";
import AppContext from "../../AppContext";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

const ExportController = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<"SVG" | "JSON">("SVG");
  const { graph } = useContext(AppContext);

  const content = useMemo(() => {
    if (tab === "JSON") {
      return JSON.stringify(graph);
    }

    const svgNode = document.getElementById("edgitor");
    if (svgNode === null) return "";
    const node = svgNode.cloneNode(true) as HTMLElement;
    node.removeAttribute("style");
    node.setAttribute("width", `${window.innerWidth}`);
    node.setAttribute("height", `${window.innerHeight}`);
    return node.outerHTML;
  }, [tab, graph]);

  const handleDownload = (fileName: string) => {
    var a = document.createElement("a");
    var file = new Blob([content], { type: tab });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

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
          <Box sx={tabbarSx}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
              <Tab value="SVG" label="SVG" />
              <Tab value="JSON" label="JSON" />
            </Tabs>
            <IconButton
              onClick={() => handleDownload(`edgitor.${tab.toLowerCase()}`)}
            >
              <FileDownloadIcon />
            </IconButton>
          </Box>
          <TextField
            sx={textAreaSx}
            value={content}
            maxRows="20"
            spellCheck="false"
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

const tabbarSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
};
