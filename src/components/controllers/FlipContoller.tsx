import React, { useContext, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import AppContext from "../../AppContext";
import { FlipType } from "../../data/type";
import {
  SwapHoriz as SwapHorizIcon,
  SwapVert as SwapVertIcon,
  Flip as FlipIcon,
} from "@mui/icons-material";

const FlipController = () => {
  const { flipGraph } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type?: FlipType) => {
    if (type) {
      flipGraph(type);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<FlipIcon />}
        aria-controls={open ? "flip-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Flip
      </Button>
      <Menu
        id="flip-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleClose("horizontal")}>
          <SwapHorizIcon /> Horizontal
        </MenuItem>
        <MenuItem onClick={() => handleClose("vertical")}>
          <SwapVertIcon /> Vertical
        </MenuItem>
      </Menu>
    </>
  );
};

export default FlipController;
