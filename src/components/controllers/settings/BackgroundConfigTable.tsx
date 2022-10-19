import React, { useContext } from "react";
import {
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
import { DEFAULT_BACKGROUND_CONFIG } from "../../../data/constants";

const BackgroundConfigTable = () => {
  const { backgroundConfig, handleBackgroundConfigChange } =
    useContext(AppContext);

  return (
    <Table sx={tableSx}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Color</Typography>
          </TableCell>
          <TableCell>
            <ColorPicker
              value={backgroundConfig.color}
              defaultValue={DEFAULT_BACKGROUND_CONFIG.color}
              onChange={(v) => {
                handleBackgroundConfigChange("color", v);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Background Image</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={backgroundConfig.imageUrl}
              size="small"
              fullWidth
              onChange={(e) =>
                handleBackgroundConfigChange("imageUrl", e.target.value)
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Image Position (CSS)</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={backgroundConfig.position}
              size="small"
              fullWidth
              onChange={(e) =>
                handleBackgroundConfigChange("position", e.target.value)
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Repeat (CSS)</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={backgroundConfig.repeat}
              size="small"
              fullWidth
              onChange={(e) =>
                handleBackgroundConfigChange("repeat", e.target.value)
              }
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Size (CSS)</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={backgroundConfig.size}
              size="small"
              fullWidth
              onChange={(e) =>
                handleBackgroundConfigChange("size", e.target.value)
              }
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default BackgroundConfigTable;

const tableSx: SxProps<Theme> = {
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
  },
};
