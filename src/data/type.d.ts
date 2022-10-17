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
export interface Config {
  radius: number;
  fontSize: number;
  fontColor: string;
  nodeColor: string;
  nodeStrokeColor: string;
  verticalAlign: "top" | "middle" | "bottom";

  edgeFontSize: number;
  strokeWidth: number;
  strokeColor: string;
  strokeStyle: string;
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
}

interface MouseTouchEvent {
  clientX: number;
  clientY: number;
  button?: number;
  target: EventTarget;
}
