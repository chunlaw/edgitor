import { useCallback, useContext, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import AppContext from "../../AppContext";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

const ExportController = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { graph } = useContext(AppContext);

  const handleDownload = useCallback(
    (fileName: string, content: string, type: "json" | "svg" | "png") => {
      const a = document.createElement("a");
      const file = new Blob([content], { type });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },
    []
  );

  const handleDownloadJson = useCallback(() => {
    handleDownload(`edgitor.json`, JSON.stringify(graph), "json");
  }, [graph, handleDownload]);

  const handleDownloadSvg = useCallback(() => {
    const svgNode = document.getElementById("edgitor");
    if (svgNode === null) return "";
    const node = svgNode.cloneNode(true) as HTMLElement;
    node.removeAttribute("style");
    node.setAttribute("width", `${window.innerWidth}`);
    node.setAttribute("height", `${window.innerHeight}`);
    handleDownload("edgitor.svg", node.outerHTML, "svg");
  }, [handleDownload]);

  return (
    <>
      <Button
        startIcon={<FileDownloadIcon />}
        variant="contained"
        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleDownloadJson}>JSON</MenuItem>
        <MenuItem onClick={handleDownloadSvg}>SVG</MenuItem>
      </Menu>
    </>
  );
};

export default ExportController;
