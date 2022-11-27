import React, { useContext, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import AppContext from "../../AppContext";
import { GraphArrangement } from "../../data/type";
import {
  Grid4x4 as Grid4x4Icon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AutoFixHigh as AutoFixHighIcon,
  Forest as ForestIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";

const ArrangeController = () => {
  const { arrangeGraph } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type?: GraphArrangement) => {
    if (type) {
      arrangeGraph(type);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AutoFixHighIcon />}
        aria-controls={open ? "arrange-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Arrange
      </Button>
      <Menu
        id="arrange-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleClose("Circle")}>
          <RadioButtonUncheckedIcon />
          Circle
        </MenuItem>
        <MenuItem onClick={() => handleClose("Grid")}>
          <Grid4x4Icon /> Grid
        </MenuItem>
        <MenuItem onClick={() => handleClose("Tree")}>
          <ForestIcon /> Tree
        </MenuItem>
        <MenuItem onClick={() => handleClose("Force")}>
          <AutoAwesomeIcon /> Force-directed
        </MenuItem>
      </Menu>
    </>
  );
};

export default ArrangeController;
