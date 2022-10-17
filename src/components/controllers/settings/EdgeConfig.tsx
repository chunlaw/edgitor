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

const EdgeConfig = () => {
  const { config, handleConfigChange } = useContext(AppContext);

  return (
    <Table sx={tableSx}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Stroke Width</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={config.strokeWidth}
              size="small"
              type="number"
              inputProps={{
                step: 1,
                min: 1,
              }}
              fullWidth
              onChange={(e) =>
                handleConfigChange("strokeWidth", parseInt(e.target.value, 10))
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Color</Typography>
          </TableCell>
          <TableCell>
            <ColorPicker
              value={config.strokeColor}
              onChange={(v) => handleConfigChange("strokeColor", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Font Size</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={config.edgeFontSize}
              size="small"
              type="number"
              inputProps={{
                step: 1,
                min: 4,
              }}
              fullWidth
              onChange={(e) =>
                handleConfigChange("edgeFontSize", parseInt(e.target.value, 10))
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Style</Typography>
          </TableCell>
          <TableCell>
            <Select
              value={config.strokeStyle}
              onChange={(e) =>
                handleConfigChange("strokeStyle", e.target.value)
              }
              fullWidth
              size="small"
            >
              <MenuItem value="none">Line</MenuItem>
              <MenuItem value="1 4">Dot</MenuItem>
              <MenuItem value="4">Dash</MenuItem>
            </Select>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default EdgeConfig;

const tableSx: SxProps<Theme> = {
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
  },
};
