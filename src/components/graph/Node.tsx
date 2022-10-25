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
  MouseTouchEvent,
  Node as NodeType,
  NodeConfig,
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
  onMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void;
  config: NodeConfig;
  selected: boolean;
}

interface MemoNodeProps extends NodeProps {
  forwardedRef: React.ForwardedRef<NodeHandle>;
  scale: number;
  pickNode: (label: string) => void;
  updateNode: (node: NodeType) => void;
}

const areEqual = (prevProps: MemoNodeProps, nextProps: MemoNodeProps) =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps) &&
  prevProps.pickNode === nextProps.pickNode &&
  prevProps.updateNode === nextProps.updateNode;

const MemoNode = React.memo(
  ({
    node,
    onMouseDown,
    selected,
    config,
    forwardedRef,
    scale,
    pickNode,
    updateNode,
  }: MemoNodeProps) => {
    const circleRef = useRef<SVGCircleElement | null>(null);
    const textRef = useRef<SVGTextElement | null>(null);
    const [hover, setHover] = useState<boolean>(false);
    const [center, setCenter] = useState<Point>({ x: node.x, y: node.y });
    const animationDelay = useMemo(() => -Math.random() * 10, []);

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

    const handleDoubleClick = useCallback(() => {
      pickNode(node.label);
    }, [pickNode, node.label]);

    useEffect(() => {
      updateNode({
        label: node.label,
        metadata: node.metadata,
        ...center,
      });
    }, [updateNode, node.label, node.metadata, center]);

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

    const getTextOffsetY = useCallback(
      ({ radius, verticalAlign, fontSize }: NodeConfig): number => {
        switch (verticalAlign) {
          case "top":
            return -radius - fontSize - 5;
          case "bottom":
            return radius + fontSize + 5;
          default:
            return 0;
        }
      },
      []
    );

    const handleMouseEnter = useCallback(() => {
      setHover(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setHover(false);
    }, []);

    return (
      <g
        onMouseDown={onMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
        className={config.animation}
        style={{ cursor: "pointer", animationDelay: `${animationDelay}s` }}
      >
        {config.backgroundImage && (
          <defs>
            <pattern
              id={`node-${label}-background`}
              height="100%"
              width="100%"
              patternContentUnits="objectBoundingBox"
              viewBox="0 0 1 1"
            >
              <rect height="1" width="1" fill={config.color} />
              <image
                height="1"
                width="1"
                preserveAspectRatio={`${config.backgroundImageAlign} ${config.backgroundImageMeetOrSlice}`}
                href={config.backgroundImage}
              />
            </pattern>
          </defs>
        )}
        {(hover || selected) && (
          <circle
            cx={x}
            cy={y}
            r={config.radius + 2}
            stroke={config.strokeColor}
            fill="transparent"
          />
        )}
        <circle
          ref={circleRef}
          cx={x}
          cy={y}
          r={config.radius}
          stroke={config.strokeColor}
          fill={
            config.backgroundImage
              ? `url(#node-${label}-background)`
              : config.color
          }
        />
        <text
          ref={textRef}
          x={x}
          y={y + getTextOffsetY(config)}
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
  const { scale, pickNode, updateNode } = useContext(AppContext);
  return (
    <MemoNode
      {...props}
      forwardedRef={ref}
      scale={scale}
      pickNode={pickNode}
      updateNode={updateNode}
    />
  );
});

export default Node;
