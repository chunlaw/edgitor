import { Box, Button, TextField } from "@mui/material";
import { useCallback, useRef } from "react";
import { toBase64 } from "../../utils";

interface BackgroundPickerProps {
  value: string;
  onChange: (url: string) => void;
}

const BackgroundPicker = ({ value, onChange }: BackgroundPickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(() => {
    if (fileInputRef.current?.files?.length) {
      toBase64(fileInputRef.current?.files[0]).then((v) => {
        onChange(v);
        fileInputRef.current!.value = "";
      });
    }
  }, []);

  return (
    <Box sx={{ flex: 1, display: "flex", gap: 1 }}>
      <TextField
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        label={"Image URL/Base 64 image"}
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
