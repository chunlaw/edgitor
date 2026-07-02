import { Box, Button, TextField } from "@mui/material";
import { useCallback, useContext, useRef } from "react";
import AppContext from "../../AppContext";

interface BackgroundPickerProps {
  value: string;
  onChange: (url: string) => void;
}

const BackgroundPicker = ({ value, onChange }: BackgroundPickerProps) => {
  const { addImage } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(() => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      // Store the upload as a Blob in IndexedDB and keep only a lightweight
      // idb:// reference in the graph (no more base64 bloat).
      addImage(file).then((ref) => {
        onChange(ref);
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
    }
  }, [addImage, onChange]);

  return (
    <Box sx={{ flex: 1, display: "flex", gap: 1 }}>
      <TextField
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        label={"Image URL"}
        placeholder="https://...."
      />
      <input
        ref={fileInputRef}
        hidden
        type="file"
        onChange={handleChange}
        accept="image/jpeg,image/png,image/svg"
      />
      <Button
        variant="outlined"
        sx={{ flex: "none" }}
        onClick={() => fileInputRef.current?.click()}
      >
        Select File
      </Button>
    </Box>
  );
};

export default BackgroundPicker;
