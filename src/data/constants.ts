import type { NodeConfig, EdgeConfig, BackgroundConfig } from "./type";

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
};
