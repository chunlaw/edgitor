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
}

// data structure
export interface Node extends Point {
  label: string;
}

export type GraphType = "directed" | "undirected";

export type FlipType = "horizontal" | "vertical";

export type GraphArrangement = "Circle" | "Grid";

export interface Graph {
  nodes: {
    [label: string]: Node;
  };
  edges: Array<[string, string] | [string, string, string]>;
  type: GraphType;
}
