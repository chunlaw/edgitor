import React, { useContext, useMemo } from "react";
import AppContext from "../../AppContext";
import { Edge as EdgeType, EdgeConfig } from "../../data/type";
import { makeId } from "../../utils";

export interface EdgeHandle {}

interface EdgeProps extends EdgeType {
  vRadius: number;
  isDirected: boolean;
}

interface MemoEdgeProps extends EdgeProps {
  forwardedRef: React.ForwardedRef<EdgeHandle>;
  defaultEdgeConfig: EdgeConfig;
}

const areEqual = (prevProps: MemoEdgeProps, nextProps: MemoEdgeProps) =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps);

const MemoEdge = React.memo(
  ({ u, v, w, vRadius, isDirected, defaultEdgeConfig }: MemoEdgeProps) => {
    const { strokeColor, strokeStyle, strokeWidth, fontSize, fontColor } =
      defaultEdgeConfig;

    const edgeId = useMemo(() => makeId(7), []);

    const m = {
      x: (u.x + v.x) / 2,
      y: (u.y + v.y) / 2,
    };

    if (u.x === v.x && u.y === v.y) {
      return (
        <g>
          <defs>
            <marker
              id={`${edgeId}-marker`}
              markerWidth="10"
              markerHeight="7"
              refX={10}
              refY="3"
              orient="auto"
              style={{ fill: defaultEdgeConfig.strokeColor }}
            >
              {isDirected && <polygon points="0 0, 10 3.5, 0 7" />}
            </marker>
          </defs>
          <path
            d={
              `M ${u.x},${u.y - vRadius} ` +
              `a -${vRadius},-${vRadius} 0 1,1 -${vRadius * 2},0 ` +
              `a -${vRadius},-${vRadius} 0 1,1 ${vRadius * 2},0`
            }
            fill="none"
            strokeWidth={strokeWidth}
            stroke={strokeColor}
            markerEnd={`url(#${edgeId}-marker)`}
            strokeDasharray={strokeStyle}
          />
          <text
            x={m.x - vRadius}
            y={m.y - vRadius * 2}
            textAnchor="middle"
            alignmentBaseline="after-edge"
            fontSize={fontSize}
            style={{ fill: fontColor }}
          >
            {w}
          </text>
        </g>
      );
    } else {
      return (
        <g>
          <defs>
            <marker
              id={`${edgeId}-marker`}
              markerWidth="10"
              markerHeight="7"
              refX={vRadius + 9}
              refY="3.5"
              orient="auto"
              style={{ fill: defaultEdgeConfig.strokeColor }}
            >
              {isDirected && <polygon points="0 0, 10 3.5, 0 7" />}
            </marker>
          </defs>
          <line
            x1={u.x}
            y1={u.y}
            x2={v.x}
            y2={v.y}
            strokeWidth={strokeWidth}
            stroke={strokeColor}
            markerEnd={`url(#${edgeId}-marker)`}
            strokeDasharray={strokeStyle}
          />
          <text
            x={m.x}
            y={m.y}
            textAnchor="middle"
            alignmentBaseline="after-edge"
            fontSize={fontSize}
            style={{ fill: fontColor }}
          >
            {w}
          </text>
        </g>
      );
    }
  },
  areEqual
);

const Edge = React.forwardRef<EdgeHandle, EdgeProps>((props, ref) => {
  const { defaultEdgeConfig } = useContext(AppContext);
  return (
    <MemoEdge
      {...props}
      forwardedRef={ref}
      defaultEdgeConfig={defaultEdgeConfig}
    />
  );
});

export default Edge;
