import React from "react";
import { Config, Edge as EdgeType } from "../../data/type";

export interface EdgeHandle {}

interface EdgeProps extends EdgeType {
  config: Config;
}

interface MemoEdgeProps extends EdgeProps {
  forwardedRef: React.ForwardedRef<EdgeHandle>;
}

const areEqual = (prevProps: MemoEdgeProps, nextProps: MemoEdgeProps) =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps);

const MemoEdge = React.memo(({ u, v, w, config }: MemoEdgeProps) => {
  const m = {
    x: (u.x + v.x) / 2,
    y: (u.y + v.y) / 2,
  };

  if (u.x === v.x && u.y === v.y) {
    return (
      <g>
        <path
          d={
            `M ${u.x},${u.y - config.radius} ` +
            `a -${config.radius},-${config.radius} 0 1,1 -${
              config.radius * 2
            },0 ` +
            `a -${config.radius},-${config.radius} 0 1,1 ${config.radius * 2},0`
          }
          fill="none"
          strokeWidth={config.strokeWidth}
          stroke={config.strokeColor}
          markerEnd="url(#selfarrowhead)"
          strokeDasharray={config.strokeStyle}
        />
        <text
          x={m.x - config.radius}
          y={m.y - config.radius * 2}
          textAnchor="middle"
          alignmentBaseline="after-edge"
          fontSize={config.edgeFontSize}
        >
          {w}
        </text>
      </g>
    );
  } else {
    return (
      <g>
        <line
          x1={u.x}
          y1={u.y}
          x2={v.x}
          y2={v.y}
          strokeWidth={config.strokeWidth}
          stroke={config.strokeColor}
          markerEnd="url(#arrowhead)"
          strokeDasharray={config.strokeStyle}
        />
        <text
          x={m.x}
          y={m.y}
          textAnchor="middle"
          alignmentBaseline="after-edge"
          fontSize={config.edgeFontSize}
        >
          {w}
        </text>
      </g>
    );
  }
}, areEqual);

const Edge = React.forwardRef<EdgeHandle, EdgeProps>((props, ref) => {
  return <MemoEdge {...props} forwardedRef={ref} />;
});

export default Edge;
