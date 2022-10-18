import React, { useCallback, useRef, useState } from "react";
import { Box, Popover, SxProps, TextField, Theme } from "@mui/material";
import { SketchPicker } from "react-color";

interface ColorPickerProps {
  value: string | null;
  defaultValue: string;
  onChange: (v: string | null) => void;
}

const isColor = (strColor: string) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== "";
};

const ColorPicker = ({ value, defaultValue, onChange }: ColorPickerProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [tmpValue, setTmpValue] = useState<string | null>(value);
  const textRef = useRef<HTMLInputElement | null>(null);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleChange = useCallback(
    (v: string) => {
      if (isColor(v)) {
        onChange(v);
      } else if (!v) {
        onChange(null);
      }
      setTmpValue(v);
    },
    [onChange]
  );

  return (
    <Box sx={pickerSx}>
      <Box
        sx={{ ...sampleSx, backgroundColor: value ?? defaultValue }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />
      <TextField
        ref={textRef}
        value={tmpValue}
        size="small"
        placeholder={defaultValue}
        fullWidth
        onChange={(e) => handleChange(e.target.value)}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SketchPicker
          color={value || defaultValue}
          onChangeComplete={(v) => handleChange(v.hex)}
        />
      </Popover>
    </Box>
  );
};

export default ColorPicker;

const pickerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const sampleSx: SxProps<Theme> = {
  borderWidth: 1,
  borderColor: "grey",
  borderStyle: "dashed",
  borderRadius: "50%",
  p: 1,
  height: 0,
  width: 0,
  cursor: "pointer",
};
