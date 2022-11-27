import type { Graph, Point } from "./data/type";

interface FddProps {
  g: Graph;
  cf?: number;
  epsilon?: number;
  maxIteration?: number;
  is2d?: boolean;
}

// Force-Directed Drawings
export const fdd = ({
  g: { edges, nodes },
  cf = 0.995,
  epsilon = 0.01,
  maxIteration = 1000000,
}: FddProps): { [label: string]: Point } => {
  const nodeIds = Object.keys(nodes);
  const forces: { [id: string]: Point } = {};
  const eMap: { [label: string]: string[] } = {};
  const points: { [label: string]: Point } = {};

  edges.forEach(([u, v]) => {
    if (eMap[u] === undefined) eMap[u] = [];
    if (eMap[v] === undefined) eMap[v] = [];
    eMap[v].push(u);
    eMap[u].push(v);
    if (points[u] === undefined) {
      points[u] = { x: Math.random() * 50 - 25, y: Math.random() * 50 - 25 };
    }
    if (points[v] === undefined) {
      points[v] = { x: Math.random() * 50 - 25, y: Math.random() * 50 - 25 };
    }
  });

  let t = 0;
  let fSum = epsilon * 10;
  let aCoef = 0,
    rCoef = 0;
  while (t < maxIteration && fSum > epsilon) {
    fSum = 0;
    // calc forces for each node
    for (const u of nodeIds) {
      forces[u] = { x: 0, y: 0 };
      for (const v of nodeIds) {
        if (u === v) continue;
        const dist = getDist(points[v], points[u]);
        const uv = getUnitVector(points[u], points[v]);

        // attractive force
        if (eMap[u].includes(v)) {
          aCoef = SPR_C * Math.log(dist / SPRING_LEN);
          forces[u].x += aCoef * uv.x;
          forces[u].y += aCoef * uv.y;
        }
        // replusive force
        rCoef = -REP_C / dist;
        forces[u].x += rCoef * uv.x;
        forces[u].y += rCoef * uv.y;
      }
      fSum += Math.sqrt(forces[u].x * forces[u].x + forces[u].y * forces[u].y);
    }

    // update graph for each node
    Object.entries(forces).forEach(([u, force]) => {
      points[u].x += cf * force.x;
      points[u].y += cf * force.y;
    });

    t += 1;
  }
  return points;
};

const getDist = (a: Point, b: Point): number => {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  let ret = Math.sqrt(dx * dx + dy * dy);
  return ret < 1e-6 ? 1e-6 : ret;
};

const getUnitVector = (u: Point, v: Point): Point => {
  const dist = getDist(u, v);
  return {
    x: (v.x - u.x) / dist,
    y: (v.y - u.y) / dist,
  };
};

const SPRING_LEN = 200;
const REP_C = 2;
const SPR_C = 1;
