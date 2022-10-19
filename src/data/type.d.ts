// svg interface
export interface Point {
  x: number;
  y: number;
}

export interface Edge {
  u: Point;
  v: Point;
  w?: string;
}

// Context
export interface NodeConfig {
  radius: number;
  fontSize: number;
  fontColor: string;
  color: string;
  strokeColor: string;
  verticalAlign: "top" | "middle" | "bottom";
  backgroundImage: string;
  description: string;
}

export interface EdgeConfig {
  fontSize: number;
  fontColor: string;
  strokeWidth: number;
  strokeColor: string;
  strokeStyle: string;
}

export interface BackgroundConfig {
  color: string;
  imageUrl: string;
  position: string;
  repeat: string;
  size: string;
}

export interface SelectedObj {
  type: "node" | "edge";
  label: string | number;
}

// data structure
export interface Node extends Point {
  label: string;
}

export type GraphType = "directed" | "undirected";

export type FlipType = "horizontal" | "vertical";

export type RotateType = "left" | "right";

export type GraphArrangement = "Circle" | "Grid" | "Tree";

export interface Graph {
  nodes: {
    [label: string]: Node;
  };
  edges: Array<string[]>;
  type: GraphType;
  defaultNodeConfig: NodeConfig;
  defaultEdgeConfig: EdgeConfig;
  nodeConfig: {
    [label: string]: {
      radius?: number;
      fontSize?: number;
      fontColor?: string;
      color?: string;
      strokeColor?: string;
      verticalAlign?: "top" | "middle" | "bottom";
      backgroundImage?: string;
      description?: string;
    };
  };
  backgroundConfig: BackgroundConfig;
}

interface MouseTouchEvent {
  clientX: number;
  clientY: number;
  button?: number;
  target: EventTarget;
}
