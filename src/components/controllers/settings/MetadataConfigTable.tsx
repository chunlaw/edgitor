import React, { useContext, useState } from "react";
import {
  SxProps,
  Theme,
  Table,
  TableBody,
  Box,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import AppContext from "../../../AppContext";
import {
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";

const MetadataConfigTable = () => {
  const {
    graph: { nodeMetadataType },
  } = useContext(AppContext);
  const [newField, setNewField] = useState<MetadataField>({
    label: "",
    type: "string",
  });
  const { addMetaType, removeMetaType } = useContext(AppContext);

  return (
    <Box>
      <Table sx={tableSx}>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Type</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(nodeMetadataType).map(([label, type], idx) => (
            <TableRow key={`meta-${idx}`}>
              <TableCell>{label}</TableCell>
              <TableCell>{type}</TableCell>
              <TableCell sx={{ px: 0 }}>
                <Tooltip title="remove">
                  <IconButton
                    onClick={() => removeMetaType(label)}
                    color="error"
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          <TableRow key={`meta-new`}>
            <TableCell>
              <TextField
                value={newField.label ?? ""}
                fullWidth
                size="small"
                variant="standard"
                onChange={(e) =>
                  setNewField((prev) => ({ ...prev, label: e.target.value }))
                }
              />
            </TableCell>
            <TableCell>
              <Select
                value={newField.type ?? ""}
                size="small"
                variant="standard"
                onChange={(e) =>
                  setNewField((prev) => ({
                    ...prev,
                    type: e.target.value as "string" | "number",
                  }))
                }
                fullWidth
              >
                <MenuItem value="string">string</MenuItem>
                <MenuItem value="number">number</MenuItem>
              </Select>
            </TableCell>
            <TableCell sx={{ px: 0 }}>
              <Tooltip title="add">
                <IconButton
                  onClick={() => addMetaType(newField.label, newField.type)}
                  disabled={!newField.label}
                  color="primary"
                >
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="caption" color="GrayText">
        Specify available metadata for each node{" "}
      </Typography>
    </Box>
  );
};

export default MetadataConfigTable;

const tableSx: SxProps<Theme> = {
  mt: 1,
  [`& .MuiTableCell-root`]: {
    // borderBottom: "none",
    py: 0.5,
  },
};

interface MetadataField {
  label: string;
  type: "string" | "number";
}
