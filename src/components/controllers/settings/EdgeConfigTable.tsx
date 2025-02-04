import { useContext } from "react";
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
import { DEFAULT_EDGE_CONFIG } from "../../../data/constants";

const EdgeConfigTable = () => {
  const { defaultEdgeConfig, handleEdgeConfigChange } = useContext(AppContext);

  return (
    <Table sx={tableSx}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Style</Typography>
          </TableCell>
          <TableCell>
            <Select
              value={defaultEdgeConfig.strokeStyle}
              onChange={(e) =>
                handleEdgeConfigChange("strokeStyle", e.target.value)
              }
            >
              <MenuItem value="none">Line</MenuItem>
              <MenuItem value="1 4">Dot</MenuItem>
              <MenuItem value="4">Dash</MenuItem>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Stroke Width</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={defaultEdgeConfig.strokeWidth}
              type="number"
              inputProps={{
                step: 1,
                min: 1,
              }}
              onChange={(e) =>
                handleEdgeConfigChange(
                  "strokeWidth",
                  parseInt(e.target.value, 10)
                )
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Stroke Color</Typography>
          </TableCell>
          <TableCell>
            <ColorPicker
              value={defaultEdgeConfig.strokeColor}
              defaultValue={DEFAULT_EDGE_CONFIG.strokeColor}
              onChange={(v) => handleEdgeConfigChange("strokeColor", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Font Size</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={defaultEdgeConfig.fontSize}
              type="number"
              inputProps={{
                step: 1,
                min: 4,
              }}
              onChange={(e) =>
                handleEdgeConfigChange("fontSize", parseInt(e.target.value, 10))
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Stroke Width</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={defaultEdgeConfig.strokeWidth}
              type="number"
              inputProps={{
                step: 1,
                min: 1,
              }}
              onChange={(e) =>
                handleEdgeConfigChange(
                  "strokeWidth",
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
              value={defaultEdgeConfig.fontColor}
              defaultValue={DEFAULT_EDGE_CONFIG.fontColor}
              onChange={(v) => handleEdgeConfigChange("fontColor", v)}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default EdgeConfigTable;

const tableSx: SxProps<Theme> = {
  mt: 1,
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
    py: 0.5,
  },
};
