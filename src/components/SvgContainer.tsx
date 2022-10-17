import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import throttle from "lodash.throttle";
import { MouseTouchEvent, Point } from "../data/type";
import { __MOUSE_LEFT_KEY_BUTTON__ } from "../data/constants";
import AppContext from "../AppContext";
import Node, { NodeHandle } from "./graph/Node";
import Edge from "./graph/Edge";

const SvgContainer = () => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const selectedNodeRef = useRef<NodeHandle | null>(null);
  const { center, scale, setCenter, zoomIn, zoomOut } = useContext(AppContext);
  const { graph, edges, nodesRef } = useContext(AppContext);
  const { config } = useContext(AppContext);
  const isDragging = useRef<boolean>(false);
  const prevClickPoint = useRef<Point>({ x: 0, y: 0 });
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
    if (selectedNodeRef.current) {
      selectedNodeRef.current.handleMouseUp(e);
      selectedNodeRef.current = null;
      return;
    }
    if (e.target !== containerRef.current) return;
    isDragging.current = false;
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

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches.length === 1) {
        handleMouseDown(e.touches[0]);
      }
    },
    [handleMouseDown]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches.length === 1) {
        handleMouseMove(e.touches[0]);
      }
    },
    [handleMouseMove]
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

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [scale, handleResize]);

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
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX={config.radius + 9}
          refY="3.5"
          orient="auto"
          style={{ fill: config.strokeColor }}
        >
          {graph.type === "directed" && <polygon points="0 0, 10 3.5, 0 7" />}
        </marker>
        <marker
          id="selfarrowhead"
          markerWidth="10"
          markerHeight="7"
          refX={7.5}
          refY="3"
          orient="auto"
          style={{ fill: config.strokeColor }}
        >
          {graph.type === "directed" && <polygon points="0 0, 10 3.5, 0 7" />}
        </marker>
      </defs>
      {edges.map((edge, idx) => (
        <Edge key={`edge-${idx}`} {...edge} config={config} />
      ))}
      {Object.values(graph.nodes).map((node, idx) => (
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
          config={config}
          onMouseDown={(e) => handleCircleMouseDown(e, node.label)}
        />
      ))}
    </svg>
  );
};

export default SvgContainer;
