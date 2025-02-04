import { useContext } from "react";
import {
  Autocomplete,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import { HelpOutline as HelpOutlineIcon } from "@mui/icons-material";
import {
  SVG_IMAGE_MEET_OR_SLICE,
  SVG_NODE_ANIMATION,
} from "../../data/constants";
import ColorPicker from "../widgets/ColorPicker";
import AppContext from "../../AppContext";
import ImageAlignPicker from "../widgets/ImageAlignPicker";
import BackgroundPicker from "../widgets/BackgroundPicker";

const NodeGraphicTable = () => {
  const {
    selectedNode,
    nodeConfig,
    updateSingleNodeConfig,
    defaultNodeConfig,
  } = useContext(AppContext);

  if (selectedNode === null) {
    return <></>;
  }

  return (
    <Table sx={tableSx}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Radius</Typography>
          </TableCell>
          <TableCell>
            <TextField
              value={nodeConfig[selectedNode]?.radius ?? ""}
              type="number"
              inputProps={{
                step: 1,
                min: 4,
              }}
              placeholder={`${defaultNodeConfig.radius}`}
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
              type="number"
              inputProps={{
                step: 1,
                min: 4,
              }}
              placeholder={`${defaultNodeConfig.fontSize}`}
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
              onChange={(_, v) =>
                updateSingleNodeConfig(selectedNode, "verticalAlign", v)
              }
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
              onChange={(v) => updateSingleNodeConfig(selectedNode, "color", v)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography variant="body2">Background URL</Typography>
          </TableCell>
          <TableCell>
            <BackgroundPicker
              value={nodeConfig[selectedNode]?.backgroundImage ?? ""}
              onChange={(v) =>
                updateSingleNodeConfig(selectedNode, "backgroundImage", v)
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
            <ImageAlignPicker
              value={nodeConfig[selectedNode]?.backgroundImageAlign ?? null}
              defaultValue={defaultNodeConfig.backgroundImageAlign}
              onChange={(v) =>
                updateSingleNodeConfig(selectedNode, "backgroundImageAlign", v)
              }
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
              onChange={(_, v) =>
                updateSingleNodeConfig(
                  selectedNode,
                  "backgroundImageMeetOrSlice",
                  v
                )
              }
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
        <TableRow>
          <TableCell>
            <Typography variant="body2">Animation</Typography>
          </TableCell>
          <TableCell>
            <Autocomplete
              value={nodeConfig[selectedNode]?.animation ?? null}
              onChange={(_, v) =>
                updateSingleNodeConfig(selectedNode, "animation", v)
              }
              options={SVG_NODE_ANIMATION}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={defaultNodeConfig.animation}
                />
              )}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default NodeGraphicTable;

const tableSx: SxProps<Theme> = {
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
    py: 0.5,
  },
};
