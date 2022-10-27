import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import throttle from "lodash.throttle";
import { Graph, MouseTouchEvent, NodeConfig, Point } from "../data/type";
import { __MOUSE_LEFT_KEY_BUTTON__ } from "../data/constants";
import AppContext from "../AppContext";
import Node, { NodeHandle } from "./graph/Node";
import Edge from "./graph/Edge";
import { getDistance } from "../utils";

const SvgContainer = () => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const selectedNodeRef = useRef<NodeHandle | null>(null);
  const { center, scale, setCenter, zoomIn, zoomOut, zoom } =
    useContext(AppContext);
  const { graph, edges, nodeConfig, nodesRef } = useContext(AppContext);
  const { selectedNode, unsetNode } = useContext(AppContext);
  const { defaultNodeConfig, backgroundConfig } = useContext(AppContext);
  const isDragging = useRef<boolean>(false);
  const prevClickPoint = useRef<Point>({ x: 0, y: 0 });
  const prevTouchesDist = useRef<number>(0);
  const [{ viewHeight, viewWidth }, setViewSize] = useState({
    viewWidth: window.innerWidth * scale,
    viewHeight: window.innerHeight * scale,
  });

  const handleMouseDown = useCallback(
    ({ clientX, clientY, button, target }: MouseTouchEvent) => {
      if (button !== undefined && button !== __MOUSE_LEFT_KEY_BUTTON__) return;
      if (target !== containerRef.current) return;
      prevClickPoint.current = { x: clientX, y: clientY };
      isDragging.current = true;
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseTouchEvent) => {
      if (selectedNodeRef.current) {
        selectedNodeRef.current.handleMouseMove(e);
        return;
      }

      const { clientX, clientY, target } = e;
      if (target !== containerRef.current) return;
      if (isDragging.current) {
        setCenter((prev) => {
          const ret = {
            x: prev.x - (clientX - prevClickPoint.current.x) * scale,
            y: prev.y - (clientY - prevClickPoint.current.y) * scale,
          };
          prevClickPoint.current.x = clientX;
          prevClickPoint.current.y = clientY;
          return ret;
        });
      }
    },
    [setCenter, scale]
  );

  const handleMouseUp = useCallback((e: MouseTouchEvent) => {
    isDragging.current = false;
    if (selectedNodeRef.current) {
      selectedNodeRef.current.handleMouseUp(e);
      selectedNodeRef.current = null;
      return;
    }
    if (e.target !== containerRef.current) return;
  }, []);

  const handleWheel = useMemo(
    () =>
      throttle(({ deltaY }: React.WheelEvent<SVGSVGElement>) => {
        if (selectedNodeRef.current) {
          return;
        }
        if (!isDragging.current) {
          if (deltaY > 0) zoomIn();
          else zoomOut();
        }
      }, 50),
    [zoomIn, zoomOut]
  );

  const handleDoubleTouches = useMemo(
    () =>
      throttle((t1: React.Touch, t2: React.Touch) => {
        let dist = getDistance(
          { x: t1.clientX, y: t1.clientY },
          { x: t2.clientX, y: t2.clientY }
        );

        zoom(prevTouchesDist.current / dist);
        prevTouchesDist.current = dist;
      }, 50),
    [zoom]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches.length === 1) {
        handleMouseDown(e.touches[0]);
      } else if (e.touches.length === 2) {
        prevTouchesDist.current = getDistance(
          { x: e.touches[0].clientX, y: e.touches[0].clientY },
          { x: e.touches[1].clientX, y: e.touches[1].clientY }
        );
      }
    },
    [handleMouseDown]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches.length === 1) {
        handleMouseMove(e.touches[0]);
      } else if (e.touches.length === 2) {
        handleDoubleTouches(e.touches[0], e.touches[1]);
      }
    },
    [handleMouseMove, handleDoubleTouches]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches.length === 1) {
        handleMouseUp(e.touches[0]);
      }
    },
    [handleMouseUp]
  );

  const handleCircleMouseDown = (
    e: React.MouseEvent<SVGSVGElement>,
    label: string
  ) => {
    selectedNodeRef.current = nodesRef.current[label];
    selectedNodeRef.current.handleMouseDown(e);
  };

  const handleResize = useCallback(() => {
    setViewSize({
      viewWidth: window.innerWidth * scale,
      viewHeight: window.innerHeight * scale,
    });
  }, [setViewSize, scale]);

  const handleDoubleClick = useCallback(
    ({ target }: MouseTouchEvent) => {
      if (target === containerRef.current) {
        unsetNode();
      }
    },
    [unsetNode]
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [scale, handleResize]);

  const containerStyle: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: backgroundConfig.color,
      backgroundImage: `url(${backgroundConfig.imageUrl})`,
      backgroundPosition: backgroundConfig.position,
      backgroundRepeat: backgroundConfig.repeat,
      backgroundSize: backgroundConfig.size,
    };
  }, [backgroundConfig]);

  return (
    <svg
      ref={containerRef}
      id="edgitor"
      width={"100vw"}
      height={"100vh"}
      viewBox={`${center.x - viewWidth / 2},${
        center.y - viewHeight / 2
      },${viewWidth}, ${viewHeight}`}
      preserveAspectRatio="xMinYMin slice"
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={containerStyle}
    >
      {edges.map((edge, idx) => (
        <Edge
          key={`edge-${idx}`}
          {...edge}
          vRadius={nodeConfig[edge.v.label]?.radius ?? defaultNodeConfig.radius}
          isDirected={graph.type === "directed"}
        />
      ))}
      {Object.values(graph.nodes).map((node) => (
        <Node
          key={`node-${node.label}`}
          ref={(el: NodeHandle) => {
            if (el) {
              nodesRef.current[node.label] = el;
            } else {
              delete nodesRef.current[node.label];
            }
          }}
          node={node}
          config={mergeNodeConfig(
            defaultNodeConfig,
            nodeConfig[node.label] ?? {}
          )}
          onMouseDown={(e) => handleCircleMouseDown(e, node.label)}
          selected={selectedNode === node.label}
        />
      ))}
    </svg>
  );
};

export default SvgContainer;

const mergeNodeConfig = (
  base: NodeConfig,
  config: Graph["nodeConfig"]["label"]
): NodeConfig => {
  return {
    radius: config.radius ?? base.radius,
    fontSize: config.fontSize ?? base.fontSize,
    fontColor: config.fontColor ?? base.fontColor,
    color: config.color ?? base.color,
    strokeColor: config.strokeColor ?? base.strokeColor,
    verticalAlign: config.verticalAlign ?? base.verticalAlign,
    backgroundImage: config.backgroundImage ?? base.backgroundImage,
    backgroundImageAlign:
      config.backgroundImageAlign ?? base.backgroundImageAlign,
    backgroundImageMeetOrSlice:
      config.backgroundImageMeetOrSlice ?? base.backgroundImageMeetOrSlice,
    animation: config.animation ?? base.animation,
    description: config.description ?? base.description,
  };
};
