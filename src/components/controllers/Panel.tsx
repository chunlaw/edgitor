import React, { useContext } from "react";
import { Box, SxProps, Theme } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-themes-all";
import AppContext from "../../AppContext";

const Panel = () => {
  const { graph, updateGraph } = useContext(AppContext);

  return (
    <Box sx={containerSx}>
      <CodeMirror
        value={graph.edges.map((e) => e.join(" ")).join("\n")}
        height="200px"
        theme={okaidia}
        onChange={updateGraph}
      />
    </Box>
  );
};

export default Panel;

const containerSx: SxProps<Theme> = {
  position: "fixed",
  mt: 10,
  ml: 1,
  width: 250,
};
