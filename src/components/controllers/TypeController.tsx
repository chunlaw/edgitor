import React, { useContext, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import AppContext from "../../AppContext";
import { GraphType } from "../../data/type";
import {
  ArrowRightAlt as ArrowRightAltIcon,
  HorizontalRule as HorizontalRuleIcon,
} from "@mui/icons-material";

const TypeController = () => {
  const {
    graph: { type },
    setGraphType,
  } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type?: GraphType) => {
    if (type) {
      setGraphType(type);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={
          type === "directed" ? <ArrowRightAltIcon /> : <HorizontalRuleIcon />
        }
        aria-controls={open ? "type-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {type}
      </Button>
      <Menu
        id="type-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleClose("directed")}>
          <ArrowRightAltIcon /> Directed
        </MenuItem>
        <MenuItem onClick={() => handleClose("undirected")}>
          <HorizontalRuleIcon /> Undirected
        </MenuItem>
      </Menu>
    </>
  );
};

export default TypeController;
