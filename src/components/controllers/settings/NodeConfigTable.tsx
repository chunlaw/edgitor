import React, { useContext } from "react";
import {
  IconButton,
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
import { HelpOutline as HelpOutlineIcon } from "@mui/icons-material";
import AppContext from "../../../AppContext";
import ColorPicker from "../../widgets/ColorPicker";
import {
  DEFAULT_NODE_CONFIG,
  SVG_IMAGE_MEET_OR_SLICE,
  SVG_NODE_ANIMATION,
} from "../../../data/constants";
import ImageAlignPicker from "../../widgets/ImageAlignPicker";

const NodeConfigTable = () => {
  const { defaultNodeConfig: config, handleNodeConfigChange } =
    useContext(AppContext);

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
                handleNodeConfigChange("radius", parseInt(e.target.value, 10))
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
                handleNodeConfigChange("fontSize", parseInt(e.target.value, 10))
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
              defaultValue={DEFAULT_NODE_CONFIG.fontColor}
              onChange={(v) => handleNodeConfigChange("fontColor", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Node Color</Typography>
          </TableCell>
          <TableCell>
            <ColorPicker
              value={config.color}
              defaultValue={DEFAULT_NODE_CONFIG.color}
              onChange={(v) => handleNodeConfigChange("color", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background URL</TableCell>
          <TableCell>
            <TextField
              value={config.backgroundImage}
              size="small"
              fullWidth
              onChange={(e) =>
                handleNodeConfigChange("backgroundImage", e.target.value)
              }
              placeholder={DEFAULT_NODE_CONFIG.backgroundImage || "Image URL"}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Line Color</Typography>
          </TableCell>
          <TableCell>
            <ColorPicker
              value={config.strokeColor}
              defaultValue={DEFAULT_NODE_CONFIG.strokeColor}
              onChange={(v) => handleNodeConfigChange("strokeColor", v)}
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
                handleNodeConfigChange("verticalAlign", e.target.value)
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
            <ImageAlignPicker
              value={config.backgroundImageAlign}
              defaultValue={DEFAULT_NODE_CONFIG.backgroundImageAlign}
              onChange={(v) =>
                handleNodeConfigChange("backgroundImageAlign", v)
              }
              nullable={false}
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
            <Select
              value={config.backgroundImageMeetOrSlice}
              onChange={(e, v) =>
                handleNodeConfigChange(
                  "backgroundImageMeetOrSlice",
                  e.target.value
                )
              }
              fullWidth
              size="small"
            >
              {SVG_IMAGE_MEET_OR_SLICE.map((mos) => (
                <MenuItem key={mos} value={mos}>
                  {mos}
                </MenuItem>
              ))}
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Animation</Typography>
          </TableCell>
          <TableCell>
            <Select
              value={config.animation}
              onChange={(e, v) =>
                handleNodeConfigChange("animation", e.target.value)
              }
              fullWidth
              size="small"
            >
              {SVG_NODE_ANIMATION.map((ani) => (
                <MenuItem key={`animation-${ani}`} value={ani}>
                  {ani}
                </MenuItem>
              ))}
            </Select>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default NodeConfigTable;

const tableSx: SxProps<Theme> = {
  mt: 1,
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
    py: 0.5,
  },
};
