import React, { useContext } from "react";
import AppContext from "../../AppContext";
import { Edge as EdgeType } from "../../data/type";

export interface EdgeHandle {}

interface EdgeProps extends EdgeType {}

interface MemoEdgeProps extends EdgeProps {
  forwardedRef: React.ForwardedRef<EdgeHandle>;
}

const areEqual = (prevProps: MemoEdgeProps, nextProps: MemoEdgeProps) =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps);

const MemoEdge = React.memo(({ u, v, w }: MemoEdgeProps) => {
  const { defaultEdgeConfig, defaultNodeConfig } = useContext(AppContext);
  const { radius } = defaultNodeConfig;
  const { strokeColor, strokeStyle, strokeWidth, fontSize, fontColor } =
    defaultEdgeConfig;

  const m = {
    x: (u.x + v.x) / 2,
    y: (u.y + v.y) / 2,
  };

  if (u.x === v.x && u.y === v.y) {
    return (
      <g>
        <path
          d={
            `M ${u.x},${u.y - radius} ` +
            `a -${radius},-${radius} 0 1,1 -${radius * 2},0 ` +
            `a -${radius},-${radius} 0 1,1 ${radius * 2},0`
          }
          fill="none"
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          markerEnd="url(#selfarrowhead)"
          strokeDasharray={strokeStyle}
        />
        <text
          x={m.x - radius}
          y={m.y - radius * 2}
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
        <line
          x1={u.x}
          y1={u.y}
          x2={v.x}
          y2={v.y}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          markerEnd="url(#arrowhead)"
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
}, areEqual);

const Edge = React.forwardRef<EdgeHandle, EdgeProps>((props, ref) => {
  return <MemoEdge {...props} forwardedRef={ref} />;
});

export default Edge;
