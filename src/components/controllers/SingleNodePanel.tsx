import React, { useContext } from "react";
import {
  Paper,
  Box,
  Typography,
  SxProps,
  Theme,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import {
  Close as CloseIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";
import AppContext from "../../AppContext";
import ColorPicker from "../widgets/ColorPicker";
import { SVG_IMAGE_ALIGN, SVG_IMAGE_MEET_OR_SLICE } from "../../data/constants";

const SingleNodePanel = () => {
  const {
    selectedNode,
    nodeConfig,
    updateSingleNodeConfig,
    defaultNodeConfig,
    unsetNode,
  } = useContext(AppContext);

  if (selectedNode === null) {
    return <></>;
  }

  return (
    <Paper sx={containerSx}>
      <Box sx={headerSx}>
        <Typography variant="h6">Node: {selectedNode}</Typography>
        <IconButton onClick={unsetNode}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Table sx={tableSx}>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Radius</Typography>
            </TableCell>
            <TableCell>
              <TextField
                value={nodeConfig[selectedNode]?.radius ?? ""}
                size="small"
                type="number"
                inputProps={{
                  step: 1,
                  min: 4,
                }}
                placeholder={`${defaultNodeConfig.radius}`}
                fullWidth
                onChange={(e) =>
                  updateSingleNodeConfig(
                    selectedNode,
                    "radius",
                    parseInt(e.target.value, 10)
                  )
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Font Size</Typography>
            </TableCell>
            <TableCell>
              <TextField
                value={nodeConfig[selectedNode]?.fontSize ?? ""}
                size="small"
                type="number"
                inputProps={{
                  step: 1,
                  min: 4,
                }}
                placeholder={`${defaultNodeConfig.fontSize}`}
                fullWidth
                onChange={(e) =>
                  updateSingleNodeConfig(
                    selectedNode,
                    "fontSize",
                    parseInt(e.target.value, 10)
                  )
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Text Color</Typography>
            </TableCell>
            <TableCell>
              <ColorPicker
                value={nodeConfig[selectedNode]?.fontColor ?? ""}
                defaultValue={defaultNodeConfig.fontColor}
                onChange={(v) =>
                  updateSingleNodeConfig(selectedNode, "fontColor", v)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Line Color</Typography>
            </TableCell>
            <TableCell>
              <ColorPicker
                value={nodeConfig[selectedNode]?.strokeColor ?? ""}
                defaultValue={defaultNodeConfig.strokeColor}
                onChange={(v) =>
                  updateSingleNodeConfig(selectedNode, "strokeColor", v)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Text Vertical Align</Typography>
            </TableCell>
            <TableCell>
              <Autocomplete
                value={nodeConfig[selectedNode]?.verticalAlign ?? null}
                onChange={(e, v) =>
                  updateSingleNodeConfig(selectedNode, "verticalAlign", v)
                }
                fullWidth
                size="small"
                placeholder={defaultNodeConfig.verticalAlign}
                options={["top", "middle", "bottom"]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={defaultNodeConfig.verticalAlign}
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Node Color</Typography>
            </TableCell>
            <TableCell>
              <ColorPicker
                value={nodeConfig[selectedNode]?.color ?? ""}
                defaultValue={defaultNodeConfig.color}
                onChange={(v) =>
                  updateSingleNodeConfig(selectedNode, "color", v)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body2">Background URL</Typography>
            </TableCell>
            <TableCell>
              <TextField
                value={nodeConfig[selectedNode]?.backgroundImage ?? ""}
                size="small"
                inputProps={{
                  step: 1,
                  min: 4,
                }}
                placeholder={defaultNodeConfig.backgroundImage}
                fullWidth
                onChange={(e) =>
                  updateSingleNodeConfig(
                    selectedNode,
                    "backgroundImage",
                    e.target.value
                  )
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography sx={{ display: "inline-block" }} variant="body2">
                Image Align
              </Typography>
              <IconButton
                sx={{ display: "inline-block" }}
                onClick={() =>
                  window.open(
                    "https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio#syntax"
                  )
                }
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </TableCell>
            <TableCell>
              <Autocomplete
                value={nodeConfig[selectedNode]?.backgroundImageAlign ?? null}
                onChange={(e, v) =>
                  updateSingleNodeConfig(
                    selectedNode,
                    "backgroundImageAlign",
                    v
                  )
                }
                fullWidth
                size="small"
                placeholder={defaultNodeConfig.backgroundImageAlign}
                options={SVG_IMAGE_ALIGN}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={defaultNodeConfig.backgroundImageAlign}
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography sx={{ display: "inline-block" }} variant="body2">
                Image Meet Or Slice
              </Typography>
              <IconButton
                sx={{ display: "inline-block" }}
                onClick={() =>
                  window.open(
                    "https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio#syntax"
                  )
                }
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </TableCell>
            <TableCell>
              <Autocomplete
                value={
                  nodeConfig[selectedNode]?.backgroundImageMeetOrSlice ?? null
                }
                onChange={(e, v) =>
                  updateSingleNodeConfig(
                    selectedNode,
                    "backgroundImageMeetOrSlice",
                    v
                  )
                }
                fullWidth
                size="small"
                placeholder={defaultNodeConfig.backgroundImageMeetOrSlice}
                options={SVG_IMAGE_MEET_OR_SLICE}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={defaultNodeConfig.backgroundImageMeetOrSlice}
                  />
                )}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default SingleNodePanel;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  mt: 7,
  mr: 1,
  p: 1,
  right: 0,
  width: 500,
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  px: 1,
};

const tableSx: SxProps<Theme> = {
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
    py: 0.5,
  },
};
