import React, {
  useEffect,
  useCallback,
  useContext,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
} from "react";
import AppContext from "../../AppContext";
import { __MOUSE_LEFT_KEY_BUTTON__ } from "../../data/constants";
import {
  Config,
  MouseTouchEvent,
  Node as NodeType,
  Point,
} from "../../data/type";

export interface NodeHandle {
  handleMouseDown: (e: MouseTouchEvent) => void;
  handleMouseMove: (e: MouseTouchEvent) => void;
  handleMouseUp: (e: MouseTouchEvent) => void;
  flipX: () => void;
  flipY: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  transpose: () => void;
  setCenter: React.Dispatch<React.SetStateAction<Point>>;
  node: NodeType;
}

interface NodeProps {
  node: NodeType;
  config: Config;
  onMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
}

interface MemoNodeProps extends NodeProps {
  forwardedRef: React.ForwardedRef<NodeHandle>;
}

const areEqual = (prevProps: MemoNodeProps, nextProps: MemoNodeProps) =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps);

const MemoNode = React.memo(
  ({ node, config, onMouseDown, forwardedRef }: MemoNodeProps) => {
    const circleRef = useRef<SVGCircleElement | null>(null);
    const textRef = useRef<SVGTextElement | null>(null);
    const { scale, updateNode } = useContext(AppContext);

    const [center, setCenter] = useState<Point>({ x: node.x, y: node.y });

    const isDragging = useRef<boolean>(false);
    const prevClickPoint = useRef<Point>({ x: 0, y: 0 });

    const { x, y, label } = node;

    const handleMouseDown = useCallback(
      ({ clientX, clientY, button, target }: MouseTouchEvent) => {
        if (button !== undefined && button !== __MOUSE_LEFT_KEY_BUTTON__)
          return;
        if (target === circleRef.current || target === textRef.current) {
          prevClickPoint.current = { x: clientX, y: clientY };
          isDragging.current = true;
        }
      },
      []
    );

    const handleMouseMove = useCallback(
      (e: MouseTouchEvent) => {
        if (isDragging.current) {
          const { clientX, clientY } = e;
          setCenter((prev) => {
            const ret = {
              x: prev.x + (clientX - prevClickPoint.current.x) * scale,
              y: prev.y + (clientY - prevClickPoint.current.y) * scale,
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
    }, []);

    useEffect(() => {
      updateNode({
        label: node.label,
        ...center,
      });
    }, [updateNode, node.label, center]);

    const flipX = useCallback(() => {
      setCenter((prev) => ({
        ...prev,
        x: -prev.x,
      }));
    }, [setCenter]);

    const flipY = useCallback(() => {
      setCenter((prev) => ({
        ...prev,
        y: -prev.y,
      }));
    }, [setCenter]);

    const rotateLeft = useCallback(() => {
      setCenter((prev) => ({
        x: prev.y,
        y: -prev.x,
      }));
    }, [setCenter]);

    const rotateRight = useCallback(() => {
      setCenter((prev) => ({
        x: -prev.y,
        y: prev.x,
      }));
    }, [setCenter]);

    const transpose = useCallback(() => {
      setCenter((prev) => ({
        x: prev.y,
        y: prev.x,
      }));
    }, []);

    useImperativeHandle(forwardedRef, () => ({
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      flipX,
      flipY,
      rotateLeft,
      rotateRight,
      transpose,
      setCenter,
      node,
    }));

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

    const textOffsetY = useMemo<number>(() => {
      switch (config.verticalAlign) {
        case "top":
          return -config.radius * 1.5;
        case "bottom":
          return config.radius * 1.5;
        default:
          return 0;
      }
    }, [config.radius, config.verticalAlign]);

    return (
      <g
        onMouseDown={onMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <circle
          ref={circleRef}
          cx={x}
          cy={y}
          r={config.radius}
          stroke={config.nodeStrokeColor}
          stoke-width={3}
          fill={config.nodeColor}
        />
        <text
          ref={textRef}
          x={x}
          y={y + textOffsetY}
          fontSize={config.fontSize}
          style={{ fill: config.fontColor }}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {label}
        </text>
      </g>
    );
  },
  areEqual
);

const Node = React.forwardRef<NodeHandle, NodeProps>((props, ref) => {
  return <MemoNode {...props} forwardedRef={ref} />;
});

export default Node;
