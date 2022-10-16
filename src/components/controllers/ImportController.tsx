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
  const [tab, setTab] = useState<"JSON">("JSON");
  const [json, setJson] = useState<string>("");
  const { importGraph } = useContext(AppContext);

  const handleSubmit = () => {
    importGraph(json);
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
          </Tabs>
          <TextField
            sx={textAreaSx}
            value={json}
            onChange={(e) => setJson(e.target.value)}
            multiline
            rows={25}
          />
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
