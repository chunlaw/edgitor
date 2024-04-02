import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-themes-all";
import AppContext from "../../AppContext";
import { Graph } from "../../data/type";

export interface PanelHandle {
  resetPanel: (edges: string[][]) => void;
}

const Panel = React.forwardRef<PanelHandle>((_, ref) => {
  const {
    graph: { nodes, edges },
    updateGraph,
  } = useContext(AppContext);
  const [text, setText] = useState<string>(
    edges.map((e) => e.join(" ")).join("\n")
  );

  const resetPanel = useCallback(
    (_edges: Graph["edges"]) => {
      setText(_edges.map((edge) => edge.join(" ")).join("\n"));
    },
    [setText]
  );

  useImperativeHandle(ref, () => ({
    resetPanel,
  }));

  const handleChange = useCallback(
    (str: string) => {
      setText(str);
      updateGraph(str);
    },
    [updateGraph, setText]
  );

  return (
    <Box sx={containerSx}>
      <Typography variant="body1">
        Table of Edges (node count: {Object.values(nodes).length})
      </Typography>
      <CodeMirror
        value={text}
        height="200px"
        theme={okaidia}
        onChange={handleChange}
      />
    </Box>
  );
});

export default Panel;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  mt: 7,
  ml: 1,
  width: 250,
};
