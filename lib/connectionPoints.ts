/**
 * Connection Points Utility
 * Manages 8 connection points on each node:
 * - 4 corner points (shared between adjacent sides)
 * - 4 center points (one per side)
 */

import { NodeData } from "./types";

export const HANDLE_DIRS = ["top", "right", "bottom", "left"] as const;
export type HandleDir = (typeof HANDLE_DIRS)[number];

/**
 * Point identifier format: "{side}-center" or "{corner}"
 * Examples: "top-center", "right-center", "top-left", "top-right", etc.
 */
export type PointId = "top-center" | "right-center" | "bottom-center" | "left-center" | "top-left" | "top-right" | "bottom-right" | "bottom-left";

export interface Point {
  id: PointId;
  x: number;
  y: number;
  side: HandleDir | "corner";
  isCorner: boolean;
  label: string;
}

/**
 * Get all 8 connection points for a node (4 corners + 4 center sides)
 * @param node - The node with x, y, width, and height
 * @param nodeWidth - Width of the node
 * @param nodeHeight - Height of the node
 * @returns Array of 8 Point objects
 */
export function getPointPositions(
  node: NodeData,
  nodeWidth: number,
  nodeHeight: number
): Point[] {
  const points: Point[] = [];
  const { x, y } = node;

  // Corner points (shared between adjacent sides)
  const corners: Array<{ id: PointId; px: number; py: number }> = [
    { id: "top-left", px: x, py: y },
    { id: "top-right", px: x + nodeWidth, py: y },
    { id: "bottom-right", px: x + nodeWidth, py: y + nodeHeight },
    { id: "bottom-left", px: x, py: y + nodeHeight },
  ];

  for (const corner of corners) {
    points.push({
      id: corner.id,
      x: corner.px,
      y: corner.py,
      side: "corner",
      isCorner: true,
      label: corner.id,
    });
  }

  // Center points (one per side)
  const centers: Array<{ id: PointId; px: number; py: number; side: HandleDir }> = [
    { id: "top-center", px: x + nodeWidth / 2, py: y, side: "top" },
    { id: "right-center", px: x + nodeWidth, py: y + nodeHeight / 2, side: "right" },
    { id: "bottom-center", px: x + nodeWidth / 2, py: y + nodeHeight, side: "bottom" },
    { id: "left-center", px: x, py: y + nodeHeight / 2, side: "left" },
  ];

  for (const center of centers) {
    points.push({
      id: center.id,
      x: center.px,
      y: center.py,
      side: center.side,
      isCorner: false,
      label: center.id,
    });
  }

  return points;
}

/**
 * Get the nearest connection point to a given coordinate
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param node - The node
 * @param nodeWidth - Width of the node
 * @param nodeHeight - Height of the node
 * @returns The nearest Point object
 */
export function getNearestPoint(
  x: number,
  y: number,
  node: NodeData,
  nodeWidth: number,
  nodeHeight: number
): Point {
  const points = getPointPositions(node, nodeWidth, nodeHeight);
  let nearest = points[0];
  let minDist = Infinity;

  for (const point of points) {
    const dx = point.x - x;
    const dy = point.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      minDist = dist;
      nearest = point;
    }
  }

  return nearest;
}

/**
 * Convert a point ID to coordinates
 * @param node - The node
 * @param pointId - The point identifier
 * @param nodeWidth - Width of the node
 * @param nodeHeight - Height of the node
 * @returns Object with x and y coordinates, or null if invalid
 */
export function pointToCoords(
  node: NodeData,
  pointId: PointId,
  nodeWidth: number,
  nodeHeight: number
): { x: number; y: number } | null {
  const points = getPointPositions(node, nodeWidth, nodeHeight);
  const point = points.find((p) => p.id === pointId);
  return point ? { x: point.x, y: point.y } : null;
}

/**
 * Get the center point of a node (fallback anchor for edges without point info)
 * @param node - The node
 * @param nodeWidth - Width of the node
 * @param nodeHeight - Height of the node
 * @returns Object with x and y coordinates of node center
 */
export function getNodeCenter(
  node: NodeData,
  nodeWidth: number,
  nodeHeight: number
): { x: number; y: number } {
  return {
    x: node.x + nodeWidth / 2,
    y: node.y + nodeHeight / 2,
  };
}
