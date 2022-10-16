import React, { useContext } from "react";
import { Box, IconButton, Slider, SxProps, Theme } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import AppContext from "../../AppContext";
import { ZOOM_MAX_SCALE, ZOOM_MIN_SCALE } from "../../data/constants";

const ZoomController = () => {
  const { scale, setScale, zoomIn, zoomOut } = useContext(AppContext);

  return (
    <Box sx={containerSx}>
      <IconButton onClick={zoomIn}>
        <RemoveIcon />
      </IconButton>
      <Slider
        color="primary"
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
      <IconButton onClick={zoomOut}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default ZoomController;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  width: 400,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bottom: 0,
  right: 0,
  mr: 1,
  mb: 1,
};
