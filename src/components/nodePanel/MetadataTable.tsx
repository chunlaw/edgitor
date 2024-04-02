import React, { useContext, useMemo } from "react";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  SxProps,
  Theme,
} from "@mui/material";
import AppContext from "../../AppContext";
import { flatten } from "../../utils";

const MetadataTable = () => {
  const {
    selectedNode,
    graph: { nodeMetadataType, nodes },
    updateSelectedNodeMetadata,
  } = useContext(AppContext);

  const metadata = useMemo(
    () => (selectedNode ? flatten(nodes[selectedNode].metadata ?? {}) : {}),
    [selectedNode, nodes]
  );

  if (selectedNode === null) {
    return <></>;
  }

  return (
    <Table sx={tableSx}>
      <TableBody>
        {Object.entries(nodeMetadataType).map(([label, type]) => (
          <TableRow key={`${selectedNode}-${label}`}>
            <TableCell>{label}</TableCell>
            <TableCell>
              <TextField
                value={metadata?.[label] ?? ""}
                type={type}
                size="small"
                multiline={type === "string"}
                fullWidth
                placeholder={type}
                maxRows={4}
                onChange={(e) => {
                  if (type === "number") {
                    updateSelectedNodeMetadata(
                      label,
                      // @ts-ignore
                      e.target.value === "" ? undefined : e.target.value * 1
                    );
                  } else {
                    updateSelectedNodeMetadata(
                      label,
                      e.target.value === "" ? undefined : e.target.value
                    );
                  }
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MetadataTable;

const tableSx: SxProps<Theme> = {
  [`& .MuiTableCell-root`]: {
    borderBottom: "none",
    py: 0.5,
  },
};
