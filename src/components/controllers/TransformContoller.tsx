import React, { useContext, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import AppContext from "../../AppContext";
import { FlipType, RotateType } from "../../data/type";
import {
  SwapHoriz as SwapHorizIcon,
  SwapVert as SwapVertIcon,
  Transform as TransformIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  OpenInFull as OpenInFullIcon,
} from "@mui/icons-material";

const TransformController = () => {
  const { flipGraph, rotateGraph, transposeGraph } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type?: FlipType | RotateType | "transpose") => {
    switch (type) {
      case "horizontal":
      case "vertical":
        flipGraph(type);
        break;
      case "left":
      case "right":
        rotateGraph(type);
        break;
      case "transpose":
        transposeGraph();
        break;
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<TransformIcon />}
        aria-controls={open ? "flip-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Transform
      </Button>
      <Menu
        id="flip-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleClose("horizontal")}>
          <SwapHorizIcon /> Horizontal Flip
        </MenuItem>
        <MenuItem onClick={() => handleClose("vertical")}>
          <SwapVertIcon /> Vertical Flip
        </MenuItem>
        <MenuItem onClick={() => handleClose("left")}>
          <RotateLeftIcon /> Rotate Left
        </MenuItem>
        <MenuItem onClick={() => handleClose("right")}>
          <RotateRightIcon /> Rotate Right
        </MenuItem>
        <MenuItem onClick={() => handleClose("transpose")}>
          <OpenInFullIcon /> Transpose
        </MenuItem>
      </Menu>
    </>
  );
};

export default TransformController;
