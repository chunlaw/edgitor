import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SxProps,
  Tab,
  Tabs,
  TextField,
  Theme,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AppContext from "../../AppContext";

const ImportController = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<"JSON" | "URL">("JSON");
  const [json, setJson] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const { importGraph, loadUrl } = useContext(AppContext);

  const handleSubmit = () => {
    if (tab === "JSON") {
      importGraph(json);
    } else {
      localStorage.removeItem(url);
      loadUrl(encodeURI(url));
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<FileUploadIcon />}
        onClick={() => setOpen(true)}
      >
        Import
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
        <DialogTitle>Import</DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab value="JSON" label="JSON" />
            <Tab value="URL" label="URL" />
          </Tabs>
          {tab === "JSON" && (
            <TextField
              sx={textAreaSx}
              value={json}
              onChange={(e) => setJson(e.target.value)}
              multiline
              rows={20}
              spellCheck="false"
              placeholder={"{...}"}
            />
          )}
          {tab === "URL" && (
            <TextField
              sx={textAreaSx}
              spellCheck="false"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              placeholder="https://..."
            />
          )}
        </DialogContent>
        <DialogActions sx={{ mx: 3, mb: 1 }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportController;

const textAreaSx: SxProps<Theme> = {
  my: 1,
  minWidth: "60vw",
};
