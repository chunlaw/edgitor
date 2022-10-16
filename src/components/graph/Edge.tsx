import React from "react";
import { Edge as EdgeType } from "../../data/type";

export interface EdgeHandle {}

interface EdgeProps extends EdgeType {}

interface MemoEdgeProps extends EdgeProps {
  forwardedRef: React.ForwardedRef<EdgeHandle>;
}

const areEqual = (prevProps: MemoEdgeProps, nextProps: MemoEdgeProps) =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps);

const MemoEdge = React.memo(({ u, v, w }: MemoEdgeProps) => {
  const m = {
    x: (u.x + v.x) / 2,
    y: (u.y + v.y) / 2,
  };

  return (
    <g>
      <line
        x1={u.x}
        y1={u.y}
        x2={v.x}
        y2={v.y}
        strokeWidth={1}
        stroke="#000"
        markerEnd="url(#arrowhead)"
      />
      <text x={m.x} y={m.y} textAnchor="middle" alignmentBaseline="after-edge">
        {w}
      </text>
    </g>
  );
}, areEqual);

const Edge = React.forwardRef<EdgeHandle, EdgeProps>((props, ref) => {
  return <MemoEdge {...props} forwardedRef={ref} />;
});

export default Edge;
