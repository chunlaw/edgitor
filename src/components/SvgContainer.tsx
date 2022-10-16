import React, { useCallback, useContext, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { Point } from "../data/type";
import { __MOUSE_LEFT_KEY_BUTTON__ } from "../data/constants";
import AppContext from "../AppContext";
import Node, { NodeHandle } from "./graph/Node";
import Edge from "./graph/Edge";

const SvgContainer = () => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const selectedNodeRef = useRef<NodeHandle | null>(null);
  const { center, scale, setCenter, zoomIn, zoomOut } = useContext(AppContext);
  const { graph, edges, nodesRef } = useContext(AppContext);
  const {
    config: { radius },
  } = useContext(AppContext);
  const isDragging = useRef<boolean>(false);
  const prevClickPoint = useRef<Point>({ x: 0, y: 0 });

  const viewWidth = useMemo(() => window.innerWidth * scale, [scale]);

  const viewHeight = useMemo(() => window.innerHeight * scale, [scale]);

  const handleMouseDown = useCallback(
    ({ clientX, clientY, button, target }: React.MouseEvent<SVGSVGElement>) => {
      if (button !== __MOUSE_LEFT_KEY_BUTTON__) return;
      if (target !== containerRef.current) return;
      prevClickPoint.current = { x: clientX, y: clientY };
      isDragging.current = true;
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (selectedNodeRef.current) {
        selectedNodeRef.current.handleMouseMove(e);
        return;
      }
      if (e.target !== containerRef.current) return;
      if (isDragging.current) {
        const { clientX, clientY } = e;
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

  const handleMouseUp = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
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

  const handleCircleMouseDown = (
    e: React.MouseEvent<SVGSVGElement>,
    idx: number
  ) => {
    selectedNodeRef.current = nodesRef.current[idx];
    selectedNodeRef.current.handleMouseDown(e);
  };

  return (
    <svg
      ref={containerRef}
      id="edgitor"
      width={"100vw"}
      height={"100vh"}
      style={{ background: "#aaa" }}
      viewBox={`${center.x - viewWidth / 2},${
        center.y - viewHeight / 2
      },${viewWidth}, ${viewHeight}`}
      preserveAspectRatio="xMinYMin slice"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX={radius + 9}
          refY="3.5"
          orient="auto"
        >
          {graph.type === "directed" && <polygon points="0 0, 10 3.5, 0 7" />}
        </marker>
      </defs>
      {edges.map((edge, idx) => (
        <Edge key={`edge-${idx}`} {...edge} />
      ))}
      {Object.values(graph.nodes).map((node, idx) => (
        <Node
          key={`node-${idx}`}
          ref={(el: NodeHandle) => {
            nodesRef.current[idx] = el;
          }}
          node={node}
          radius={radius}
          onMouseDown={(e) => handleCircleMouseDown(e, idx)}
        />
      ))}
    </svg>
  );
};

export default SvgContainer;
