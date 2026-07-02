import { useCallback, useContext, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import AppContext from "../../AppContext";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { toPng } from "html-to-image";
import { Graph } from "../../data/type";
import { getImage } from "../../db";
import { isImageRef, refToId, blobToDataUrl } from "../../imageStore";

// Rebuild a graph with every idb:// image reference replaced by an inline
// base64 data URL, so the exported JSON is a self-contained, portable file.
const inlineGraphImages = async (g: Graph): Promise<Graph> => {
  const inline = async (v?: string): Promise<string | undefined> => {
    if (isImageRef(v)) {
      const blob = await getImage(refToId(v));
      if (blob) return blobToDataUrl(blob);
      return ""; // referenced blob missing; drop it rather than export a dead ref
    }
    return v;
  };

  const defaultNodeConfig = { ...g.defaultNodeConfig };
  defaultNodeConfig.backgroundImage =
    (await inline(defaultNodeConfig.backgroundImage)) ??
    defaultNodeConfig.backgroundImage;

  const backgroundConfig = { ...g.backgroundConfig };
  backgroundConfig.imageUrl =
    (await inline(backgroundConfig.imageUrl)) ?? backgroundConfig.imageUrl;

  const nodeConfig: Graph["nodeConfig"] = {};
  for (const [label, cfg] of Object.entries(g.nodeConfig ?? {})) {
    const c = { ...cfg };
    if (isImageRef(c.backgroundImage)) {
      c.backgroundImage = await inline(c.backgroundImage);
    }
    nodeConfig[label] = c;
  }

  return { ...g, defaultNodeConfig, backgroundConfig, nodeConfig };
};

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

  const handleDownloadJson = useCallback(async () => {
    const portable = await inlineGraphImages(graph);
    handleDownload(`edgitor.json`, JSON.stringify(portable), "json");
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

  const handleDownloadPng = useCallback(() => {
    const svgNode = document.getElementById("edgitor");
    if (svgNode === null) return "";
    toPng(svgNode).then((url) => {
      const a = document.createElement("a"); //Create <a>
      a.href = url; //Image Base64 Goes here
      a.download = "edgitor.png"; //File name Here
      a.click(); //Downloaded file
    });
  }, []);

  const handleDownloadJpg = useCallback(() => {
    const svgNode = document.getElementById("edgitor");
    if (svgNode === null) return "";
    toPng(svgNode).then((url) => {
      const a = document.createElement("a"); //Create <a>
      a.href = url; //Image Base64 Goes here
      a.download = "edgitor.jpg"; //File name Here
      a.click(); //Downloaded file
    });
  }, []);

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
        <MenuItem onClick={handleDownloadPng}>PNG</MenuItem>
        <MenuItem onClick={handleDownloadJpg}>JPG</MenuItem>
      </Menu>
    </>
  );
};

export default ExportController;
