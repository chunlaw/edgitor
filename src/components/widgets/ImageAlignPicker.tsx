import React, { useState, useCallback, useRef } from "react";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Popover,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";
import { SVG_IMAGE_ALIGN } from "../../data/constants";

interface ImageAlignPickerProps {
  value: string | null;
  defaultValue: string;
  onChange: (v: string | null) => void;
  nullable?: boolean;
}

const ImageAlignPicker = ({
  value,
  defaultValue,
  onChange,
  nullable = true,
}: ImageAlignPickerProps) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [tmpValue, setTmpValue] = useState<string | null>(value);
  const textRef = useRef<HTMLInputElement | null>(null);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleChange = useCallback(
    (v: string) => {
      onChange(v || (nullable ? null : defaultValue));
      setTmpValue(v || (nullable ? null : defaultValue));
    },
    [onChange]
  );

  const PositionButton = useCallback(
    ({ v }: { v: string }) => (
      <Button
        sx={buttonSx}
        variant="outlined"
        onClick={() => handleChange(v)}
      />
    ),
    [handleChange]
  );

  return (
    <Box sx={pickerSx}>
      <Autocomplete
        ref={textRef}
        value={tmpValue}
        onChange={(e, v) => handleChange(v || "")}
        fullWidth
        size="small"
        placeholder={defaultValue}
        options={SVG_IMAGE_ALIGN}
        renderInput={(params) => (
          <TextField {...params} placeholder={defaultValue} />
        )}
        onOpen={(e) => {
          setAnchorEl(e.currentTarget);
        }}
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
        <Box sx={buttonContainerSx}>
          <Box sx={rowSx}>
            <PositionButton v="xMinYMin" />
            <PositionButton v="xMidYMin" />
            <PositionButton v="xMaxYMin" />
          </Box>
          <Box sx={rowSx}>
            <PositionButton v="xMinYMid" />
            <PositionButton v="xMidYMid" />
            <PositionButton v="xMaxYMid" />
          </Box>
          <Box sx={rowSx}>
            <PositionButton v="xMinYMax" />
            <PositionButton v="xMidYMax" />
            <PositionButton v="xMaxYMax" />
          </Box>
        </Box>
        <Box sx={{ mx: 1, mb: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleChange("none")}
          >
            Scale to fit
          </Button>
          <IconButton size="small" onClick={() => handleChange("")}>
            <CancelIcon />
          </IconButton>
        </Box>
      </Popover>
    </Box>
  );
};

export default ImageAlignPicker;

const pickerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const buttonContainerSx: SxProps<Theme> = {
  backgroundImage: "url(/logo256.png)",
  backgroundSize: "cover",
  mx: 1,
};

const rowSx: SxProps<Theme> = {
  display: "flex",
};

const buttonSx: SxProps<Theme> = {
  minWidth: 0,
  p: 3,
};
