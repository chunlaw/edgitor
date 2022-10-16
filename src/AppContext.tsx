import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { NodeHandle } from "./components/graph/Node";
import { ZOOM_MAX_SCALE, ZOOM_MIN_SCALE } from "./data/constants";
import {
  Node,
  Edge,
  Point,
  Config,
  Graph,
  GraphType,
  FlipType,
  GraphArrangement,
} from "./data/type";
import { median } from "./utils";

interface AppContextState {
  scale: number;
  center: Point;
  edges: Edge[];
  graph: Graph;
  config: Config;
  nodesRef: React.MutableRefObject<NodeHandle[]>;
  setCenter: React.Dispatch<React.SetStateAction<Point>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  zoomIn: () => void;
  zoomOut: () => void;
  resetCenter: () => void;
  updateNode: (node: Node) => void;
  updateGraph: (input: string) => void;
  setGraphType: (type: GraphType) => void;
  flipGraph: (type: FlipType) => void;
  arrangeGraph: (arrangement: GraphArrangement) => void;
  importGraph: (jsonStr: string) => void;
}

const AppContext = React.createContext<AppContextState>({} as AppContextState);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [config] = useState<Config>(DAFAULT_CONFIG);
  const nodesRef = useRef<NodeHandle[]>([]);
  const [graph, setGraph] = useState<Graph>(
    JSON.parse(localStorage.getItem("edgitor-graph") || DEFAULT_GRAPH)
  );
  const [center, setCenter] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);

  const edges = useMemo(() => {
    const { nodes } = graph;
    return graph.edges.map(([u, v, w]) => {
      return { u: { ...nodes[u] }, v: { ...nodes[v] }, w };
    });
  }, [graph]);

  const updateNode = useCallback(
    (node: Node) => {
      setGraph((prev) => ({
        ...prev,
        nodes: {
          ...prev.nodes,
          [node.label]: node,
        },
      }));
    },
    [setGraph]
  );

  const zoomIn = useCallback(() => {
    setScale((prev) =>
      Number(
        Math.min(
          ZOOM_MAX_SCALE,
          Math.max(ZOOM_MIN_SCALE, prev + 0.1)
        ).toPrecision(2)
      )
    );
  }, [setScale]);

  const zoomOut = useCallback(() => {
    setScale((prev) =>
      Number(
        Math.min(
          ZOOM_MAX_SCALE,
          Math.max(ZOOM_MIN_SCALE, prev - 0.1)
        ).toPrecision(2)
      )
    );
  }, [setScale]);

  const resetCenter = useCallback(() => {
    const _nodesRef = nodesRef.current.filter((v) => v);
    if (_nodesRef.length === 0) {
      setCenter({ x: 0, y: 0 });
    } else {
      setCenter({
        x: median(_nodesRef.map((ref) => ref.node.x)),
        y: median(_nodesRef.map((ref) => ref.node.y)),
      });
    }
  }, [setCenter]);

  const updateGraph = useCallback(
    (input: string) => {
      setGraph((prev) => {
        const nodes: { [label: string]: Node } = {};
        const edges = input
          .split("\n")
          .map((line) => line.split(" ").filter((v) => v))
          .filter((v) => v.length >= 2);
        edges.forEach(([u, v]) => {
          if (prev.nodes[u] === undefined)
            nodes[u] = { x: randomX(), y: randomY(), label: u };
          else nodes[u] = prev.nodes[u];
          if (prev.nodes[v] === undefined)
            nodes[v] = { x: randomX(), y: randomY(), label: v };
          else nodes[v] = prev.nodes[v];
        });
        return {
          type: prev.type,
          nodes,
          edges: edges as Array<[string, string] | [string, string, string]>,
        };
      });
    },
    [setGraph]
  );

  const setGraphType = useCallback(
    (type: GraphType) => {
      setGraph((prev) => ({
        ...prev,
        type,
      }));
    },
    [setGraph]
  );

  const flipGraph = useCallback((type: FlipType) => {
    nodesRef.current
      .filter((v) => v)
      .forEach((ref) => {
        if (type === "horizontal") {
          ref.flipX();
        } else {
          ref.flipY();
        }
      });
  }, []);

  const setCircularGraph = useCallback(() => {
    const _nodesRef = nodesRef.current.filter((v) => v);
    const nodeCnt = _nodesRef.length;
    if (nodeCnt === 0) return;
    if (nodeCnt === 1) {
      _nodesRef[0].setCenter({ x: 0, y: 0 });
      return;
    }
    const bigRadius = (nodeCnt * config.radius) / Math.PI + config.radius * 4;
    _nodesRef.forEach((nodeRef, i) => {
      nodeRef.setCenter({
        x: bigRadius * Math.cos((i / nodeCnt) * Math.PI * 2),
        y: bigRadius * Math.sin((i / nodeCnt) * Math.PI * 2),
      });
    });
  }, [config.radius]);

  const setGridGraph = useCallback(() => {
    const _nodesRef = nodesRef.current.filter((v) => v);
    const nodeCnt = _nodesRef.length;
    const r = Math.ceil(Math.sqrt(nodeCnt));
    const c = Math.floor(nodeCnt / r);
    const dx = 4 * config.radius;
    const dy = 4 * config.radius;
    const initX = -(c * dx) / 2;
    const initY = -(r * dy) / 2;
    _nodesRef.forEach((ref, i) => {
      ref.setCenter({
        x: initX + Math.floor(i / c) * dx,
        y: initY + (i % c) * dy,
      });
    });
  }, [config.radius]);

  const setTreeGraph = useCallback(() => {
    const _nodesRef = nodesRef.current.filter((v) => v);
    const nodeCnt = _nodesRef.length;
    const inDeg: { [label: string]: number } = {};
    const lv: { [label: string]: number } = {};
    const vis: { [label: string]: boolean } = {};
    const eMap: { [label: string]: string[] } = {};
    graph.edges.forEach(([u, v]) => {
      if (inDeg[u] === undefined) inDeg[u] = 0;
      if (inDeg[v] === undefined) inDeg[v] = 0;
      inDeg[v] += 1;
      if (eMap[u] === undefined) eMap[u] = [];
      eMap[u].push(v);
      vis[u] = false;
      vis[v] = false;
    }, {});

    const dfs = (u: string) => {
      eMap[u]?.forEach((v) => {
        if (lv[v] === undefined) {
          lv[v] = lv[u] + 1;
        } else {
          lv[v] = Math.max(lv[v], lv[u] + 1);
        }
        if (!vis[v]) {
          vis[v] = true;
          dfs(v);
        }
      });
    };

    for (let i = 0; i < nodeCnt; ++i) {
      // find the min inDeg label among unvisited node
      let minDeg = nodeCnt + 1;
      let minLabel: string = "";
      Object.entries(inDeg).forEach(([label, deg]) => {
        if (lv[label] === undefined && deg < minDeg) {
          minLabel = label;
          minDeg = deg;
        }
      });
      if (minDeg === nodeCnt + 1) break;
      for (const _node in vis) {
        vis[_node] = false;
      }
      lv[minLabel] = 0;
      vis[minLabel] = true;
      dfs(minLabel);
    }

    // prepare nodes for each row
    const rowLabels = Object.entries(lv)
      .sort(([, a], [, b]) => a - b)
      .reduce<string[][]>((acc, [label, v]) => {
        if (acc.length === v) acc.push([label]);
        else acc[acc.length - 1].push(label);
        return acc;
      }, []);
    const labelToRefIdx = nodesRef.current.reduce<{ [label: string]: number }>(
      (acc, ref, idx) => {
        if (ref) {
          acc[ref.node.label] = idx;
        }
        return acc;
      },
      {}
    );

    const dx = 4 * config.radius;
    const dy = 4 * config.radius;
    rowLabels.forEach((labels, i, selfRows) => {
      const initY = -(selfRows.length * dy) / 2;
      labels.forEach((label, j, selfLabels) => {
        const initX = -(selfLabels.length * dx) / 2;
        nodesRef.current[labelToRefIdx[label]].setCenter({
          x: initX + j * dx,
          y: initY + i * dy,
        });
      });
    });
  }, [config.radius, graph.edges]);

  const arrangeGraph = useCallback(
    (arrangement: GraphArrangement) => {
      switch (arrangement) {
        case "Circle":
          setCircularGraph();
          break;
        case "Grid":
          setGridGraph();
          break;
        case "Tree":
          setTreeGraph();
          break;
      }
    },
    [setCircularGraph, setGridGraph, setTreeGraph]
  );

  const importGraph = useCallback(
    (jsonStr: string) => {
      try {
        const _graph = JSON.parse(jsonStr) as Graph;
        if (typeof _graph.nodes === "object") {
          Object.entries(_graph.nodes).forEach(([key, { x, y, label }]) => {
            if (typeof label !== "string")
              throw new Error("label is not a string");
            if (key !== label) throw new Error("label and key not match");
            if (typeof x !== "number") throw new Error("x is not a number");
            if (isNaN(x)) throw new Error("x is NaN");
            if (isNaN(y)) throw new Error("y is NaN");
          });
        } else {
          throw new Error("Unknown type of nodes");
        }
        if (!["directed", "undirected"].includes(_graph.type)) {
          throw new Error("Unknown graph type");
        }
        if (Array.isArray(_graph.edges)) {
          _graph.edges.forEach(([u, v, w]) => {
            if (_graph.nodes[u] === undefined) {
              throw new Error("Unknown node " + u);
            }
            if (_graph.nodes[v] === undefined) {
              throw new Error("Unknown node " + v);
            }
          });
        } else {
          throw new Error("Edges not array");
        }
        setGraph(_graph);
      } catch (e) {
        console.error(e);
      }
    },
    [setGraph]
  );

  useEffect(() => {
    localStorage.setItem("edgitor-graph", JSON.stringify(graph));
  }, [graph]);

  return (
    <AppContext.Provider
      value={{
        center,
        scale,
        edges,
        graph,
        config,
        nodesRef,
        setCenter,
        setScale,
        zoomIn,
        zoomOut,
        resetCenter,
        updateNode,
        updateGraph,
        setGraphType,
        flipGraph,
        arrangeGraph,
        importGraph,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

const DAFAULT_CONFIG: Config = {
  radius: 20,
};

const DEFAULT_GRAPH = JSON.stringify({
  nodes: {
    a: { x: 0, y: 0, label: "a" },
    b: { x: 50, y: 50, label: "b" },
  },
  edges: [["a", "b"]],
  type: "directed",
});

const randomX = () => {
  return Math.random() * 500 - 250;
};

const randomY = () => {
  return Math.random() * 500 - 250;
};
