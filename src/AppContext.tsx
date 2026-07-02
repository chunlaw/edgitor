import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { NodeHandle } from "./components/graph/Node";
import {
  DEFAULT_BACKGROUND_CONFIG,
  DEFAULT_NODE_METADATA_TYPE,
  EMPTY_GRAPH,
  ZOOM_MAX_SCALE,
  ZOOM_MIN_SCALE,
} from "./data/constants";
import {
  Node,
  Edge,
  Point,
  NodeConfig,
  EdgeConfig,
  Graph,
  GraphType,
  FlipType,
  GraphArrangement,
  RotateType,
  BackgroundConfig,
} from "./data/type";
import {
  DEFAULT_GRAPH,
  DEFAULT_EDGE_CONFIG,
  DEFAULT_NODE_CONFIG,
} from "./data/constants";
import { flatten, median, unflatten } from "./utils";
import { PanelHandle } from "./components/controllers/Panel";
import { useSearchParams } from "react-router-dom";
import throttle from "lodash.throttle";
import {
  getGraph,
  putGraph,
  getImage,
  putImage,
  getAllGraphs,
  getAllImageIds,
  removeImage,
} from "./db";
import {
  isImageRef,
  refToId,
  newImageRef,
  isDataUrl,
  dataUrlToBlob,
} from "./imageStore";

interface AppContextState {
  scale: number;
  center: Point;
  edges: Edge[];
  graph: Graph;
  defaultNodeConfig: NodeConfig;
  defaultEdgeConfig: EdgeConfig;
  nodesRef: React.MutableRefObject<{ [label: string]: NodeHandle }>;
  panelRef: React.RefObject<PanelHandle>;
  selectedNode: string | null;
  nodeConfig: Graph["nodeConfig"];
  backgroundConfig: BackgroundConfig;
  isLoading: boolean;
  setCenter: React.Dispatch<React.SetStateAction<Point>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  zoomIn: () => void;
  zoomOut: () => void;
  zoom: (factor: number) => void;
  resetCenter: () => void;
  updateNode: (node: Node) => void;
  updateGraph: (input: string) => void;
  setGraphType: (type: GraphType) => void;
  flipGraph: (type: FlipType) => void;
  rotateGraph: (type: RotateType) => void;
  transposeGraph: () => void;
  arrangeGraph: (arrangement: GraphArrangement) => void;
  loadUrl: (url: string) => void;
  importGraph: (jsonStr: string) => Promise<void>;
  resolveImage: (ref?: string | null) => string;
  addImage: (file: File) => Promise<string>;
  renameNodeLabel: (oldLabel: string, newLabel: string) => void;
  handleNodeConfigChange: (field: keyof NodeConfig, value: any) => void;
  handleEdgeConfigChange: (field: keyof EdgeConfig, value: any) => void;
  handleBackgroundConfigChange: (
    field: keyof BackgroundConfig,
    value: any
  ) => void;
  resetConfig: () => void;
  pickNode: (label: string) => void;
  unsetNode: () => void;
  updateSingleNodeConfig: (
    label: string,
    field: keyof NodeConfig,
    value: any
  ) => void;
  addMetaType: (label: string, type: "number" | "string") => void;
  removeMetaType: (label: string) => void;
  updateSelectedNodeMetadata: (label: string, value?: string | number) => void;
}

const AppContext = React.createContext<AppContextState>({} as AppContextState);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const url = useMemo(() => searchParams.get("f"), [searchParams]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const nodesRef = useRef<{ [label: string]: NodeHandle }>({});
  const panelRef = useRef<PanelHandle>(null);
  const [graph, setGraph] = useState<Graph>({
    nodeConfig: {},
    defaultNodeConfig: DEFAULT_NODE_CONFIG,
    defaultEdgeConfig: DEFAULT_EDGE_CONFIG,
    backgroundConfig: DEFAULT_BACKGROUND_CONFIG,
    nodeMetadataType: DEFAULT_NODE_METADATA_TYPE,
    // Stored graphs are loaded asynchronously from IndexedDB (see effect
    // below). The synchronous initial value is just the empty/default graph.
    ...JSON.parse(url ? EMPTY_GRAPH : DEFAULT_GRAPH),
  });
  const [center, setCenter] = useState<Point>({ x: 0, y: -100 });
  const [scale, setScale] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  // Runtime map of image id -> live object URL. Object URLs die when the tab
  // closes, so they are never persisted; they are regenerated from the Blobs
  // in IndexedDB each session. `imageUrls` is state (drives re-render);
  // `objectUrlsRef` mirrors it for revocation on unmount.
  const [imageUrls, setImageUrls] = useState<{ [id: string]: string }>({});
  const objectUrlsRef = useRef<{ [id: string]: string }>({});
  const { defaultNodeConfig, defaultEdgeConfig, nodeConfig, backgroundConfig } =
    graph;

  const edges = useMemo(() => {
    const { nodes } = graph;
    return graph.edges
      .filter((v) => v.length >= 2)
      .map(([u, v, w]) => {
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

  const zoom = useCallback(
    (factor: number) => {
      if (Number.isNaN(factor)) return;
      setScale((prev) =>
        Number(
          Math.min(
            ZOOM_MAX_SCALE,
            Math.max(ZOOM_MIN_SCALE, prev * factor)
          ).toPrecision(2)
        )
      );
    },
    [setScale]
  );

  const resetCenter = useCallback(() => {
    const _nodesRef = Object.values(nodesRef.current).filter((v) => v);
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
          .filter((l) => l.trim() !== "")
          .map((line) =>
            line
              .split(" ")
              .filter((v) => v !== "")
              .map((n, idx) => {
                if (idx >= 2) return n;
                if (prev.nodes[n] === undefined) {
                  nodes[n] = {
                    x: randomX(),
                    y: randomY(),
                    label: n,
                    metadata: {},
                  };
                } else {
                  nodes[n] = prev.nodes[n];
                }
                return n;
              })
          );

        return {
          ...prev,
          type: prev.type,
          nodes,
          edges: edges as Array<string[]>,
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
    Object.values(nodesRef.current)
      .filter((v) => v)
      .forEach((ref) => {
        switch (type) {
          case "horizontal":
            ref.flipX();
            break;
          case "vertical":
            ref.flipY();
            break;
        }
      });
  }, []);

  const rotateGraph = useCallback((type: RotateType) => {
    Object.values(nodesRef.current)
      .filter((v) => v)
      .forEach((ref) => {
        switch (type) {
          case "left":
            ref.rotateLeft();
            break;
          case "right":
            ref.rotateRight();
            break;
        }
      });
  }, []);

  const transposeGraph = useCallback(() => {
    Object.values(nodesRef.current)
      .filter((v) => v)
      .forEach((ref) => ref.transpose());
  }, []);

  const setCircularGraph = useCallback(() => {
    const _nodesRef = Object.values(nodesRef.current).filter((v) => v);
    const nodeCnt = _nodesRef.length;
    if (nodeCnt === 0) return;
    if (nodeCnt === 1) {
      _nodesRef[0].setCenter({ x: 0, y: 0 });
      return;
    }
    const bigRadius =
      (nodeCnt * defaultNodeConfig.radius) / Math.PI +
      defaultNodeConfig.radius * 4;
    _nodesRef.forEach((nodeRef, i) => {
      nodeRef.setCenter({
        x: bigRadius * Math.cos((i / nodeCnt) * Math.PI * 2),
        y: bigRadius * Math.sin((i / nodeCnt) * Math.PI * 2),
      });
    });
  }, [defaultNodeConfig.radius]);

  const setGridGraph = useCallback(() => {
    const _nodesRef = Object.values(nodesRef.current).filter((v) => v);
    const nodeCnt = _nodesRef.length;
    const r = Math.ceil(Math.sqrt(nodeCnt));
    const c = Math.floor(nodeCnt / r);
    const dx = 4 * defaultNodeConfig.radius;
    const dy = 4 * defaultNodeConfig.radius;
    const initX = -(c * dx) / 2;
    const initY = -(r * dy) / 2;
    _nodesRef.forEach((ref, i) => {
      ref.setCenter({
        x: initX + Math.floor(i / c) * dx,
        y: initY + (i % c) * dy,
      });
    });
  }, [defaultNodeConfig.radius]);

  const setTreeGraph = useCallback(() => {
    const _nodesRef = Object.values(nodesRef.current).filter((v) => v);
    const nodeCnt = _nodesRef.length;
    const inDeg: { [label: string]: number } = {};
    const lv: { [label: string]: number } = {};
    const vis: { [label: string]: boolean } = {};
    const eMap: { [label: string]: string[] } = {};
    graph.edges.forEach(([u, v]) => {
      if (inDeg[u] === undefined) inDeg[u] = 0;
      vis[u] = false;
      if (v === undefined || v === u) return;
      if (inDeg[v] === undefined) inDeg[v] = 0;
      inDeg[v] += 1;
      if (eMap[u] === undefined) eMap[u] = [];
      eMap[u].push(v);
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
        while (acc.length <= v) {
          acc.push([]);
        }
        acc[v].push(label);
        return acc;
      }, [])
      .filter((v) => v.length);

    const dx = 4 * defaultNodeConfig.radius;
    const dy = 4 * defaultNodeConfig.radius;
    rowLabels.forEach((labels, i, selfRows) => {
      const initY = -(selfRows.length * dy) / 2;
      labels.forEach((label, j, selfLabels) => {
        const initX = -(selfLabels.length * dx) / 2;
        nodesRef.current[label].setCenter({
          x: initX + j * dx,
          y: initY + i * dy,
        });
      });
    });
  }, [defaultNodeConfig.radius, graph.edges]);

  const setForceDirectedGraph = useCallback(() => {
    const _nodesRef = Object.values(nodesRef.current).filter((v) => v);
    const nodeCnt = _nodesRef.length;
    if (nodeCnt === 0) return;
    if (nodeCnt === 1) {
      _nodesRef[0].setCenter({ x: 0, y: 0 });
      return;
    }

    // Fruchterman-Reingold force-directed layout.
    // `spread` controls how loose the layout is; raise it for more breathing room.
    const spread = 6;
    // Optimal (rest) distance between connected nodes.
    const k = spread * defaultNodeConfig.radius;

    const labels = _nodesRef.map((ref) => ref.node.label);
    const idx: { [label: string]: number } = {};
    labels.forEach((label, i) => (idx[label] = i));

    // Initialize positions on a jittered circle to avoid symmetric traps.
    const initRadius = k * Math.sqrt(nodeCnt);
    const pos = _nodesRef.map((_, i) => ({
      x: initRadius * Math.cos((i / nodeCnt) * Math.PI * 2) + (Math.random() - 0.5),
      y: initRadius * Math.sin((i / nodeCnt) * Math.PI * 2) + (Math.random() - 0.5),
    }));

    // Deduplicated list of valid edges (by index).
    const edges: Array<[number, number]> = [];
    graph.edges.forEach(([u, v]) => {
      if (v === undefined || u === v) return;
      const a = idx[u];
      const b = idx[v];
      if (a === undefined || b === undefined) return;
      edges.push([a, b]);
    });

    const iterations = 300;
    let temp = initRadius; // max displacement per step
    const cool = temp / (iterations + 1);

    for (let iter = 0; iter < iterations; ++iter) {
      const disp = pos.map(() => ({ x: 0, y: 0 }));

      // Repulsive forces between every pair of nodes.
      for (let i = 0; i < nodeCnt; ++i) {
        for (let j = i + 1; j < nodeCnt; ++j) {
          let dx = pos[i].x - pos[j].x;
          let dy = pos[i].y - pos[j].y;
          let dist = Math.hypot(dx, dy);
          if (dist < 0.01) {
            // Nudge coincident nodes apart.
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
            dist = Math.hypot(dx, dy) || 0.01;
          }
          const force = (k * k) / dist;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          disp[i].x += fx;
          disp[i].y += fy;
          disp[j].x -= fx;
          disp[j].y -= fy;
        }
      }

      // Attractive forces along edges.
      edges.forEach(([a, b]) => {
        const dx = pos[a].x - pos[b].x;
        const dy = pos[a].y - pos[b].y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const force = (dist * dist) / k;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        disp[a].x -= fx;
        disp[a].y -= fy;
        disp[b].x += fx;
        disp[b].y += fy;
      });

      // Limit displacement by the current temperature (cooling schedule).
      for (let i = 0; i < nodeCnt; ++i) {
        const dl = Math.hypot(disp[i].x, disp[i].y) || 0.01;
        const limited = Math.min(dl, temp);
        pos[i].x += (disp[i].x / dl) * limited;
        pos[i].y += (disp[i].y / dl) * limited;
      }

      temp -= cool;
    }

    // Auto-loosen: if the closest pair is tighter than a comfortable gap,
    // scale the whole layout up uniformly (preserves shape, removes crowding).
    let minDist = Infinity;
    for (let i = 0; i < nodeCnt; ++i) {
      for (let j = i + 1; j < nodeCnt; ++j) {
        const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
        if (d < minDist) minDist = d;
      }
    }
    // Target: node diameter plus a gap of ~1 radius between nearest neighbours.
    const targetMinDist = 3 * defaultNodeConfig.radius;
    let scale = 1;
    if (minDist > 0 && minDist < targetMinDist) {
      // Clamp so a single near-coincident pair can't explode the whole layout.
      scale = Math.min(targetMinDist / minDist, 4);
    }

    // Center the layout around the origin.
    const cx = pos.reduce((s, p) => s + p.x, 0) / nodeCnt;
    const cy = pos.reduce((s, p) => s + p.y, 0) / nodeCnt;
    _nodesRef.forEach((ref, i) => {
      ref.setCenter({ x: (pos[i].x - cx) * scale, y: (pos[i].y - cy) * scale });
    });
  }, [defaultNodeConfig.radius, graph.edges]);

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
        case "Force":
          setForceDirectedGraph();
          break;
      }
      // Every arrange layout positions nodes centered on the origin, so
      // re-center the viewport there. (resetCenter can't be used here: it
      // reads ref.node.x, which only updates after the setCenter -> updateNode
      // -> graph cascade commits, so it would see stale positions.)
      setCenter({ x: 0, y: 0 });
    },
    [
      setCircularGraph,
      setGridGraph,
      setTreeGraph,
      setForceDirectedGraph,
      setCenter,
    ]
  );

  const loadUrl = useCallback(
    (url: string) => {
      setIsLoading(true);
      setSearchParams({ f: url });
    },
    [setIsLoading, setSearchParams]
  );

  const importGraph = useCallback(
    async (jsonStr: string) => {
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
        _graph.edges.forEach(([u, v]) => {
          if (_graph.nodes[u] === undefined) {
            throw new Error("Unknown node " + u);
          }
          if (v !== undefined && _graph.nodes[v] === undefined) {
            throw new Error("Unknown node " + v);
          }
        });
      } else {
        throw new Error("Edges not array");
      }
      // Deprecate base64: any inline data URLs (e.g. from an imported file)
      // are converted to Blobs in IndexedDB and replaced with idb refs.
      const migrated = await migrateGraphImages(_graph);
      setGraph(migrated);
      panelRef.current?.resetPanel(migrated.edges);
    },
    [setGraph]
  );

  const resolveImage = useCallback(
    (ref?: string | null): string => {
      if (!ref) return "";
      if (isImageRef(ref)) return imageUrls[refToId(ref)] ?? "";
      return ref;
    },
    [imageUrls]
  );

  const addImage = useCallback(async (file: File): Promise<string> => {
    const { id, ref } = newImageRef();
    await putImage(id, file);
    const objectUrl = URL.createObjectURL(file);
    objectUrlsRef.current[id] = objectUrl;
    setImageUrls((prev) => ({ ...prev, [id]: objectUrl }));
    return ref;
  }, []);

  // Regenerate object URLs for any idb refs in the current graph that don't
  // have one yet (e.g. after a fresh load from IndexedDB).
  useEffect(() => {
    let cancelled = false;
    const missing = collectImageRefs(graph)
      .map(refToId)
      .filter((id) => !objectUrlsRef.current[id]);
    if (missing.length === 0) return;
    (async () => {
      const entries: Array<[string, string]> = [];
      for (const id of missing) {
        const blob = await getImage(id);
        if (blob) entries.push([id, URL.createObjectURL(blob)]);
      }
      if (cancelled) {
        entries.forEach(([, u]) => URL.revokeObjectURL(u));
        return;
      }
      if (entries.length) {
        entries.forEach(([id, u]) => (objectUrlsRef.current[id] = u));
        setImageUrls((prev) => {
          const next = { ...prev };
          entries.forEach(([id, u]) => (next[id] = u));
          return next;
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [graph]);

  // Revoke all object URLs on unmount to avoid leaking blob references.
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      Object.values(urls).forEach(URL.revokeObjectURL);
    };
  }, []);

  const renameNodeLabel = useCallback(
    (oldLabel: string, newLabel: string) => {
      if (
        graph.nodes[newLabel] !== undefined ||
        graph.nodes[oldLabel] === undefined
      ) {
        return;
      } else {
        panelRef.current?.resetPanel(
          graph.edges.map(([u, v, ...props]) => [
            u === oldLabel ? newLabel : u,
            v === oldLabel ? newLabel : v,
            ...props,
          ])
        );
      }
      setGraph((prev) => {
        if (prev.nodes[newLabel] !== undefined) {
          return prev;
        } else if (prev.nodes[oldLabel] === undefined) {
          return prev;
        }
        delete Object.assign(prev.nodes, { [newLabel]: prev.nodes[oldLabel] })[
          oldLabel
        ];
        delete Object.assign(prev.nodeConfig, {
          [newLabel]: prev.nodeConfig[oldLabel],
        })[oldLabel];
        prev.nodes[newLabel].label = newLabel;
        return {
          ...prev,
          nodeConfig: { ...prev.nodeConfig },
          nodes: { ...prev.nodes },
          edges: prev.edges.map(([u, v, ...props]) => [
            u === oldLabel ? newLabel : u,
            v === oldLabel ? newLabel : v,
            ...props,
          ]),
        };
      });
      setSelectedNode(newLabel);
    },
    [setGraph, graph]
  );

  // Persist the graph to IndexedDB, debounced so rapid edits don't thrash.
  const persistGraph = useMemo(
    () =>
      throttle(
        (key: string, g: Graph) => {
          putGraph(key, JSON.stringify(g)).catch((err) => console.error(err));
        },
        500,
        { leading: false, trailing: true }
      ),
    []
  );

  // Scoped garbage collection: delete image Blobs that are no longer
  // referenced by ANY stored graph (or the current in-memory one). Scanning
  // every graph is required because the image store is shared across graph
  // keys — a Blob may belong to a different `?f=` graph than the current one.
  const runImageGc = useCallback(async (current: Graph) => {
    try {
      const referenced = new Set<string>();
      collectImageRefs(current).forEach((r) => referenced.add(refToId(r)));
      const stored = await getAllGraphs();
      stored.forEach((s) => {
        try {
          collectImageRefs(JSON.parse(s) as Graph).forEach((r) =>
            referenced.add(refToId(r))
          );
        } catch {
          /* ignore malformed stored graph */
        }
      });

      const orphans = (await getAllImageIds()).filter(
        (id) => !referenced.has(id)
      );
      if (orphans.length === 0) return;

      await Promise.all(orphans.map((id) => removeImage(id)));
      orphans.forEach((id) => {
        const objectUrl = objectUrlsRef.current[id];
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          delete objectUrlsRef.current[id];
        }
      });
      setImageUrls((prev) => {
        const next = { ...prev };
        orphans.forEach((id) => delete next[id]);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // GC is expensive (reads every graph) so run it infrequently, on the
  // trailing edge, well after the more frequent graph persistence.
  const scheduleImageGc = useMemo(
    () =>
      throttle((g: Graph) => runImageGc(g), 5000, {
        leading: false,
        trailing: true,
      }),
    [runImageGc]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    persistGraph(url || "edgitor-graph", graph);
    scheduleImageGc(graph);
  }, [graph, url, isLoading, persistGraph, scheduleImageGc]);

  useEffect(() => {
    let cancelled = false;
    const key = url || "edgitor-graph";

    (async () => {
      try {
        // 1. Prefer a graph already stored in IndexedDB.
        const stored = await getGraph(key);
        if (cancelled) return;
        if (stored !== undefined) {
          await importGraph(stored);
          return;
        }

        // 2. One-time migration: pull a legacy graph out of localStorage.
        const legacy = localStorage.getItem(key);
        if (legacy) {
          await importGraph(legacy);
          if (!cancelled) {
            await putGraph(key, legacy);
            localStorage.removeItem(key);
          }
          return;
        }

        // 3. Otherwise fetch a remote graph for a ?f= url; the default graph
        //    is already in the initial state when there is no url.
        if (url !== null) {
          const res = await fetch(url);
          const text = await res.text();
          if (!cancelled) await importGraph(text);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled && url !== null) setSearchParams({});
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, importGraph, setSearchParams]);

  const handleNodeConfigChange = useCallback(
    (field: keyof NodeConfig, value: any) => {
      setGraph((prev) => ({
        ...prev,
        defaultNodeConfig: {
          ...prev.defaultNodeConfig,
          [field]: value,
        },
      }));
    },
    [setGraph]
  );

  const handleEdgeConfigChange = useCallback(
    (field: keyof EdgeConfig, value: any) => {
      setGraph((prev) => ({
        ...prev,
        defaultEdgeConfig: {
          ...prev.defaultEdgeConfig,
          [field]: value,
        },
      }));
    },
    [setGraph]
  );

  const handleBackgroundConfigChange = useCallback(
    (field: keyof BackgroundConfig, value: any) => {
      setGraph((prev) => ({
        ...prev,
        backgroundConfig: {
          ...prev.backgroundConfig,
          [field]: value,
        },
      }));
    },
    [setGraph]
  );

  const resetConfig = useCallback(() => {
    setGraph((prev) => ({
      ...prev,
      defaultNodeConfig: DEFAULT_NODE_CONFIG,
      defaultEdgeConfig: DEFAULT_EDGE_CONFIG,
      backgroundConfig: DEFAULT_BACKGROUND_CONFIG,
    }));
  }, [setGraph]);

  const pickNode = useCallback(
    (label: string) => {
      if (graph.nodes[label]) {
        setSelectedNode(label);
      }
    },
    [setSelectedNode, graph.nodes]
  );

  const unsetNode = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const updateSingleNodeConfig = useCallback(
    (label: string, field: keyof NodeConfig, value: any) => {
      setGraph((prev) => ({
        ...prev,
        nodeConfig: {
          ...prev.nodeConfig,
          [label]: {
            ...(prev.nodeConfig[label] ?? {}),
            [field]: value || undefined,
          },
        },
      }));
    },
    [setGraph]
  );

  const addMetaType = useCallback(
    (label: string, type: "number" | "string") => {
      setGraph((prev) => ({
        ...prev,
        nodeMetadataType: {
          ...prev.nodeMetadataType,
          [label]: type,
        },
      }));
    },
    [setGraph]
  );

  const removeMetaType = useCallback(
    (label: string) => {
      setGraph((prev) => {
        const nodeMetadataType = { ...prev.nodeMetadataType };
        delete nodeMetadataType[label];
        return {
          ...prev,
          nodeMetadataType,
        };
      });
    },
    [setGraph]
  );

  const updateSelectedNodeMetadata = useCallback(
    (label: string, value?: number | string) => {
      if (selectedNode === null) return;
      setGraph((prev) => {
        const curMetadata = flatten(prev.nodes[selectedNode].metadata ?? {});
        if (value === undefined) delete curMetadata[label];
        else curMetadata[label] = value;

        return {
          ...prev,
          nodes: {
            ...prev.nodes,
            [selectedNode]: {
              ...prev.nodes[selectedNode],
              metadata: unflatten(curMetadata),
            },
          },
        };
      });
    },
    [setGraph, selectedNode]
  );

  return (
    <AppContext.Provider
      value={{
        center,
        scale,
        edges,
        graph,
        defaultNodeConfig,
        defaultEdgeConfig,
        backgroundConfig,
        nodesRef,
        panelRef,
        selectedNode,
        nodeConfig,
        isLoading,
        setCenter,
        setScale,
        zoomIn,
        zoomOut,
        zoom,
        resetCenter,
        updateNode,
        updateGraph,
        setGraphType,
        flipGraph,
        rotateGraph,
        transposeGraph,
        arrangeGraph,
        loadUrl,
        importGraph,
        resolveImage,
        addImage,
        renameNodeLabel,
        handleNodeConfigChange,
        handleEdgeConfigChange,
        handleBackgroundConfigChange,
        resetConfig,
        pickNode,
        unsetNode,
        updateSingleNodeConfig,
        addMetaType,
        removeMetaType,
        updateSelectedNodeMetadata,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

// Collect every idb:// image reference used anywhere in a graph.
const collectImageRefs = (g: Graph): string[] => {
  const refs: string[] = [];
  const add = (v?: string | null) => {
    if (isImageRef(v)) refs.push(v);
  };
  add(g.defaultNodeConfig?.backgroundImage);
  add(g.backgroundConfig?.imageUrl);
  Object.values(g.nodeConfig ?? {}).forEach((c) => add(c?.backgroundImage));
  return refs;
};

// Convert any inline base64 data URLs in a graph into Blobs stored in
// IndexedDB, replacing them with lightweight idb:// references.
const migrateGraphImages = async (g: Graph): Promise<Graph> => {
  const convert = async (v?: string): Promise<string | undefined> => {
    if (isDataUrl(v)) {
      const { id, ref } = newImageRef();
      await putImage(id, dataUrlToBlob(v));
      return ref;
    }
    return v;
  };

  const defaultNodeConfig = { ...g.defaultNodeConfig };
  defaultNodeConfig.backgroundImage =
    (await convert(defaultNodeConfig.backgroundImage)) ??
    defaultNodeConfig.backgroundImage;

  const backgroundConfig = { ...g.backgroundConfig };
  backgroundConfig.imageUrl =
    (await convert(backgroundConfig.imageUrl)) ?? backgroundConfig.imageUrl;

  const nodeConfig: Graph["nodeConfig"] = {};
  for (const [label, cfg] of Object.entries(g.nodeConfig ?? {})) {
    const c = { ...cfg };
    if (isDataUrl(c.backgroundImage)) {
      c.backgroundImage = await convert(c.backgroundImage);
    }
    nodeConfig[label] = c;
  }

  return { ...g, defaultNodeConfig, backgroundConfig, nodeConfig };
};

const randomX = () => {
  return Math.random() * 500 - 250;
};

const randomY = () => {
  return Math.random() * 500 - 250;
};
