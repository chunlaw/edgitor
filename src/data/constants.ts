import type {
  Graph,
  NodeConfig,
  EdgeConfig,
  BackgroundConfig,
  NodeMetadataTypeConfig,
} from "./type";

export const __MOUSE_LEFT_KEY_BUTTON__ = 0;

export const ZOOM_MAX_SCALE = 2;
export const ZOOM_MIN_SCALE = 0.1;

export const DEFAULT_NODE_CONFIG: NodeConfig = {
  radius: 20,
  fontSize: 16,
  color: "#fff",
  fontColor: "black",
  strokeColor: "#000",
  verticalAlign: "middle",
  backgroundImage: "",
  backgroundImageAlign: "xMinYMid",
  backgroundImageMeetOrSlice: "slice",
  animation: "fixed",
  description: "",
};

export const DEFAULT_EDGE_CONFIG: EdgeConfig = {
  fontSize: 16,
  fontColor: "black",
  strokeWidth: 1,
  strokeColor: "#000",
  strokeStyle: "none",
};

export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  color: "#aaa",
  imageUrl: "",
  repeat: "no-repeat",
  position: "center",
  size: "contain",
};

export const DEFAULT_NODE_METADATA_TYPE: NodeMetadataTypeConfig = {
  description: "string",
};

export const SVG_IMAGE_ALIGN = [
  "none",
  "xMinYMin",
  "xMidYMin",
  "xMaxYMin",
  "xMinYMid",
  "xMidYMid",
  "xMaxYMid",
  "xMinYMax",
  "xMidYMax",
  "xMaxYMax",
];

export const SVG_IMAGE_MEET_OR_SLICE = ["meet", "slice"];

export const SVG_NODE_ANIMATION = ["fixed", "vibrate"];

export const DEFAULT_GRAPH = JSON.stringify({
  type: "undirected",
  nodes: {
    a: {
      label: "a",
      x: -80,
      y: -120,
      metadata: {},
    },
    b: {
      label: "b",
      x: -80,
      y: -40,
      metadata: {},
    },
    c: {
      label: "c",
      x: 0,
      y: -120,
      metadata: {},
    },
    d: {
      label: "d",
      x: 0,
      y: -40,
      metadata: {},
    },
    e: {
      label: "e",
      x: 80,
      y: -120,
      metadata: {},
    },
    f: {
      label: "f",
      x: 80,
      y: -40,
      metadata: {},
    },
  },
  edges: [
    ["a", "b"],
    ["b", "c"],
    ["c", "d"],
    ["d", "e"],
    ["e", "f"],
  ],
  defaultNodeConfig: DEFAULT_NODE_CONFIG,
  defaultEdgeConfig: DEFAULT_EDGE_CONFIG,
  nodeConfig: {},
  backgroundConfig: DEFAULT_BACKGROUND_CONFIG,
  nodeMetadataType: {
    description: "string",
  },
} as Graph);
