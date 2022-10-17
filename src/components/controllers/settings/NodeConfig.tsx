import React, { useContext } from "react";
import {
  MenuItem,
  Select,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import AppContext from "../../../AppContext";
import ColorPicker from "../../widgets/ColorPicker";

const NodeConfig = () => {
  const { config, handleConfigChange } = useContext(AppContext);

  return (
    <Table sx={tableSx}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Radius</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={config.radius}
              size="small"
              type="number"
              inputProps={{
                step: 1,
                min: 4,
              }}
              fullWidth
              onChange={(e) =>
                handleConfigChange("radius", parseInt(e.target.value, 10))
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
              value={config.fontSize}
              size="small"
              type="number"
              inputProps={{
                step: 1,
                min: 4,
              }}
              fullWidth
              onChange={(e) =>
                handleConfigChange("fontSize", parseInt(e.target.value, 10))
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
              value={config.fontColor}
              onChange={(v) => handleConfigChange("fontColor", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Node Color</Typography>
          </TableCell>
          <TableCell>
            <ColorPicker
              value={config.nodeColor}
              onChange={(v) => handleConfigChange("nodeColor", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Line Color</Typography>
          </TableCell>
          <TableCell>
            <ColorPicker
              value={config.nodeStrokeColor}
              onChange={(v) => handleConfigChange("nodeStrokeColor", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Text Vertical Align</Typography>
          </TableCell>
          <TableCell>
            <Select
              value={config.verticalAlign}
              onChange={(e) =>
                handleConfigChange("verticalAlign", e.target.value)
              }
              fullWidth
              size="small"
            >
              <MenuItem value="top">top</MenuItem>
              <MenuItem value="middle">middle</MenuItem>
              <MenuItem value="bottom">bottom</MenuItem>
            </Select>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default NodeConfig;

const tableSx: SxProps<Theme> = {
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
  },
};
