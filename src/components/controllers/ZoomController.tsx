import React, { useContext } from "react";
import {
  Box,
  IconButton,
  Slider,
  SxProps,
  Theme,
  Tooltip,
} from "@mui/material";
import {
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
  GpsFixed as GpsFixedIcon,
} from "@mui/icons-material";
import AppContext from "../../AppContext";
import { ZOOM_MAX_SCALE, ZOOM_MIN_SCALE } from "../../data/constants";

const ZoomController = () => {
  const { scale, setScale, resetCenter, zoomIn, zoomOut } =
    useContext(AppContext);

  return (
    <Box sx={containerSx}>
      <IconButton color="primary" onClick={zoomIn}>
        <RemoveIcon />
      </IconButton>
      <Slider
        color="primary"
        size="small"
        value={100 - (100 * scale) / (ZOOM_MAX_SCALE + ZOOM_MIN_SCALE)}
        onChange={(e, v) =>
          setScale(
            Number(
              Math.min(
                2,
                Math.max(
                  0.1,
                  ((100 - (v as number)) / 100) *
                    (ZOOM_MAX_SCALE + ZOOM_MIN_SCALE)
                )
              ).toPrecision(2)
            )
          )
        }
      />
      <IconButton color="primary" onClick={zoomOut}>
        <AddIcon />
      </IconButton>
      <Tooltip title="Re-center">
        <IconButton color="primary" onClick={resetCenter}>
          <GpsFixedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ZoomController;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  width: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bottom: 0,
  right: 0,
  mr: 2,
  mb: 3,
  gap: 1,
};
