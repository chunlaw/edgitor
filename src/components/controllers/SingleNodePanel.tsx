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
import { Close as CloseIcon } from "@mui/icons-material";
import AppContext from "../../AppContext";
import ColorPicker from "../widgets/ColorPicker";

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
  right: 0,
  width: 400,
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
  },
};
