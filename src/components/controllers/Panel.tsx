import React, { useCallback, useContext, useState } from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-themes-all";
import AppContext from "../../AppContext";

const Panel = () => {
  const {
    graph: { nodes, edges },
    updateGraph,
  } = useContext(AppContext);
  const [text, setText] = useState<string>(
    edges.map((e) => e.join(" ")).join("\n")
  );

  const handleChange = useCallback(
    (str: string) => {
      setText(str);
      updateGraph(str);
    },
    [updateGraph, setText]
  );

  return (
    <Box sx={containerSx}>
      <Typography variant="body1">Table of Edges</Typography>
      <CodeMirror
        value={text}
        height="200px"
        theme={okaidia}
        onChange={handleChange}
      />
      <Typography variant="subtitle1">
        (Node Count: {Object.values(nodes).length})
      </Typography>
    </Box>
  );
};

export default Panel;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  mt: 7,
  ml: 1,
  width: 250,
};
