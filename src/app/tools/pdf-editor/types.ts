export type Tool = "select" | "text" | "image" | "pen" | "highlight" | "rect" | "ellipse";

export interface Ann {
  id: string;
  page: number;
  type: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  text?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  font?: string;
  opacity?: number;
  imgSrc?: string;
  strokes?: { x: number; y: number }[][];
  strokeW?: number;
}

export function pathD(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x} ${pts[i].y} ${mx} ${my}`;
  }
  return d + ` L${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
}

export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}
