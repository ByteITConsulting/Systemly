"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { NodeData, EdgeData, NODE_WIDTH, NODE_HEIGHT } from "@/lib/types";
import { COMPONENT_TYPES } from "@/lib/componentTypes";
import {
  getPointPositions,
  getNearestPoint,
  pointToCoords,
  getNodeCenter,
  HANDLE_DIRS,
  type HandleDir,
  type PointId,
} from "@/lib/connectionPoints";
import styles from "./Canvas.module.scss";
import ComponentLabel from "./ComponentLabel";
import Icon from "./Icon";

export const CANVAS_WIDTH = 2400;
export const CANVAS_HEIGHT = 1400;

const typeMap = Object.fromEntries(COMPONENT_TYPES.map((c) => [c.id, c]));

interface CanvasProps {
  nodes: NodeData[];
  edges: EdgeData[];
  onAddNode: (typeId: string, x: number, y: number) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onDeleteNode: (id: string) => void;
  onRenameNode: (id: string, label: string) => void;
  onCreateEdge: (fromId: string, toId: string, fromPoint?: PointId, toPoint?: PointId) => void;
  onDeleteEdge: (id: string) => void;
  onLabelEdge: (id: string, label: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

interface Dragging {
  id: string;
  offsetX: number;
  offsetY: number;
}

interface Connecting {
  fromId: string;
  fromPoint: PointId;
  x: number;
  y: number;
}

export default function Canvas({
  nodes,
  edges,
  onAddNode,
  onMoveNode,
  onDeleteNode,
  onRenameNode,
  onCreateEdge,
  onDeleteEdge,
  onLabelEdge,
  canvasRef,
}: CanvasProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pendingConnectionRef = useRef<{
    fromId: string;
    toId: string;
    fromPoint: PointId;
    toPoint: PointId;
  } | null>(null);
  const [dragging, setDragging] = useState<Dragging | null>(null);
  const [connecting, setConnecting] = useState<Connecting | null>(null);
  const [connectTargetId, setConnectTargetId] = useState<string | null>(null);
  const [tempPoint, setTempPoint] = useState<{ x: number; y: number } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  // nodeSizes computed from label text width (measured via canvas) to match image proportion
  const [nodeSizes, setNodeSizes] = useState<Record<string, { w: number; h: number }>>({});
  const SCALE = 0.8; // final size = measured * SCALE (20% smaller)
  const BASE_MIN_SIDE = 64; // base minimum before scaling
  const MIN_SIDE = Math.max(8, Math.round(BASE_MIN_SIDE * SCALE));
  const LABEL_EXTRA = 12; // padding added to measured text width before scaling
  const LABEL_FONT_PX = 11.5; // approximate font size used in .nodeLabel
  const ICON_SCALE = 0.46; // proportion of node height used for icon size
  const FALLBACK_NODE_W = Math.round(NODE_WIDTH * SCALE);
  const FALLBACK_NODE_H = Math.round(NODE_HEIGHT * SCALE);

  function measureTextWidth(text: string, fontPx = LABEL_FONT_PX) {
    const canvas = (measureTextWidth as any)._canvas || ((measureTextWidth as any)._canvas = document.createElement("canvas"));
    const ctx = canvas.getContext("2d")!;
    // use monospace fallback similar to CSS var(--font-mono)
    ctx.font = `${fontPx}px monospace`;
    return ctx.measureText(text).width;
  }

  // Compute sizes from label text; run in layout effect to apply before paint
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const newSizes: Record<string, { w: number; h: number }> = {};
    nodes.forEach((node) => {
      const type = typeMap[node.typeId];
      const txt = (node.label || type?.label || "").toString().toUpperCase();
      const textW = Math.ceil(measureTextWidth(txt));
      const side = Math.max(MIN_SIDE, Math.ceil(textW + LABEL_EXTRA));
      // use square nodes to match attached image proportion
      const sideBase = Math.max(BASE_MIN_SIDE, Math.ceil(textW + LABEL_EXTRA));
      const sideScaled = Math.max(MIN_SIDE, Math.round(sideBase * SCALE));
      newSizes[node.id] = { w: sideScaled, h: sideScaled };
    });

    // only update when changed
    const changed = Object.keys(newSizes).some((id) => {
      const prev = nodeSizes[id];
      const cur = newSizes[id];
      return !prev || prev.w !== cur.w || prev.h !== cur.h;
    });
    if (changed) setNodeSizes(newSizes);
  }, [nodes]);

  // canvasRef (passed from the parent) is attached to the full-size inner
  // canvas so the export captures the whole diagram, not just the visible
  // scrolled viewport. Position/scroll math instead uses the outer,
  // scrollable wrapper.
  function pointInCanvas(e: { clientX: number; clientY: number }) {
    const rect = outerRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left + outerRef.current!.scrollLeft,
      y: e.clientY - rect.top + outerRef.current!.scrollTop,
    };
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const typeId = e.dataTransfer.getData("componentTypeId");
    if (!typeId || !canvasRef.current) return;
    const p = pointInCanvas(e);
    onAddNode(typeId, Math.max(0, p.x - FALLBACK_NODE_W / 2), Math.max(0, p.y - FALLBACK_NODE_H / 2));
  }

  function startDragNode(e: React.PointerEvent, node: NodeData) {
    e.stopPropagation();
    const p = pointInCanvas(e);
    setDragging({ id: node.id, offsetX: p.x - node.x, offsetY: p.y - node.y });
  }

  function handleAnchor(node: NodeData, dir: HandleDir) {
    const w = FALLBACK_NODE_W;
    const h = FALLBACK_NODE_H;
    switch (dir) {
      case "top":
        return { x: node.x + w / 2, y: node.y };
      case "bottom":
        return { x: node.x + w / 2, y: node.y + h };
      case "left":
        return { x: node.x, y: node.y + h / 2 };
      case "right":
        return { x: node.x + w, y: node.y + h / 2 };
    }
  }

  function startConnecting(e: React.PointerEvent, node: NodeData, dir: HandleDir, pointId?: PointId) {
    e.stopPropagation();
    e.preventDefault();
    // If pointId is provided, use it directly; otherwise find nearest point
    let finalPointId = pointId as PointId;
    if (!finalPointId) {
      const pointPos = pointInCanvas(e);
      const nearestPoint = getNearestPoint(
        pointPos.x,
        pointPos.y,
        node,
        FALLBACK_NODE_W,
        FALLBACK_NODE_H
      );
      finalPointId = nearestPoint.id;
    }
    
    const coords = pointToCoords(node, finalPointId, FALLBACK_NODE_W, FALLBACK_NODE_H);
    if (coords) {
      setConnecting({
        fromId: node.id,
        fromPoint: finalPointId,
        x: coords.x,
        y: coords.y,
      });
      setTempPoint(coords);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (connecting) {
      const p = pointInCanvas(e);
      
      // Snap to nearest point on any target node
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hoverNode = el?.closest<HTMLElement>("[data-node-id]");
      const hoverId = hoverNode?.dataset.nodeId ?? null;
      
      if (hoverId && hoverId !== connecting.fromId) {
        const targetNode = nodes.find((n) => n.id === hoverId);
        if (targetNode) {
          const nearestPoint = getNearestPoint(
            p.x,
            p.y,
            targetNode,
            FALLBACK_NODE_W,
            FALLBACK_NODE_H
          );
          const coords = pointToCoords(
            targetNode,
            nearestPoint.id,
            FALLBACK_NODE_W,
            FALLBACK_NODE_H
          );
          if (coords) {
            setTempPoint(coords);
          }
        }
      } else {
        // Snap to cursor if not over a target node
        setTempPoint(p);
      }
      
      setConnectTargetId(hoverId && hoverId !== connecting.fromId ? hoverId : null);
      return;
    }
    if (!dragging || !canvasRef.current) return;
    const p = pointInCanvas(e);
    onMoveNode(
      dragging.id,
      Math.max(0, p.x - dragging.offsetX),
      Math.max(0, p.y - dragging.offsetY)
    );
  }

  useEffect(() => {
    function finishConnection(e: PointerEvent) {
      setConnecting((current) => {
        if (!current) return null;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const hoverNode = el?.closest<HTMLElement>("[data-node-id]");
        const toId = hoverNode?.dataset.nodeId ?? null;
        if (toId && toId !== current.fromId) {
          // Find the nearest point on the target node
          const targetNode = nodes.find((n) => n.id === toId);
          if (targetNode) {
            const rect = (e.target as HTMLElement)?.getBoundingClientRect?.();
            const p = pointInCanvas({ clientX: e.clientX, clientY: e.clientY });
            const nearestPoint = getNearestPoint(
              p.x,
              p.y,
              targetNode,
              FALLBACK_NODE_W,
              FALLBACK_NODE_H
            );
            pendingConnectionRef.current = {
              fromId: current.fromId,
              toId,
              fromPoint: current.fromPoint,
              toPoint: nearestPoint.id,
            };
          }
        }
        return null;
      });
      setConnectTargetId(null);
      setTempPoint(null);
      setDragging(null);
    }
    window.addEventListener("pointerup", finishConnection);
    return () => window.removeEventListener("pointerup", finishConnection);
  }, [nodes]);

  // Handle pending connection creation after state updates
  useEffect(() => {
    if (pendingConnectionRef.current) {
      const { fromId, toId, fromPoint, toPoint } = pendingConnectionRef.current;
      pendingConnectionRef.current = null;
      onCreateEdge(fromId, toId, fromPoint, toPoint);
    }
  }, [connecting, onCreateEdge]);

  function center(node: NodeData) {
    const w = FALLBACK_NODE_W;
    const h = FALLBACK_NODE_H;
    return { x: node.x + w / 2, y: node.y + h / 2 };
  }

  function edgeGeometry(edge: EdgeData) {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);
    if (!from || !to) return null;

    // Use point-specific coordinates if available, otherwise fall back to center
    let c1 = center(from);
    let c2 = center(to);

    if (edge.fromPoint) {
      const coords = pointToCoords(from, edge.fromPoint as PointId, FALLBACK_NODE_W, FALLBACK_NODE_H);
      if (coords) c1 = coords;
    }

    if (edge.toPoint) {
      const coords = pointToCoords(to, edge.toPoint as PointId, FALLBACK_NODE_W, FALLBACK_NODE_H);
      if (coords) c2 = coords;
    }

    const midX = (c1.x + c2.x) / 2;
    const path = `M ${c1.x} ${c1.y} L ${midX} ${c1.y} L ${midX} ${c2.y} L ${c2.x} ${c2.y}`;
    return { path, mid: { x: midX, y: (c1.y + c2.y) / 2 } };
  }

  return (
    <div
      className={styles.canvasOuter}
      ref={outerRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPointerMove={handlePointerMove}
      data-tour="canvas"
    >
      <div
        className={styles.canvasInner}
        ref={canvasRef}
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {nodes.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyGlyph}>⌗</span>
            <p>Arraste um componente da barra lateral para começar</p>
            <p className={styles.emptySub}>
              Passe o mouse sobre um componente e arraste a bolinha da borda até outro para
              conectar
            </p>
          </div>
        )}

        <svg
          className={styles.edgesLayer}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          <defs>
            <marker
              id="bp-arrow"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#f5f5f5" />
            </marker>
          </defs>
          {edges.map((edge) => {
            const g = edgeGeometry(edge);
            if (!g) return null;
            return (
              <path
                key={edge.id}
                d={g.path}
                fill="none"
                stroke="#f5f5f5"
                strokeWidth={1.5}
                strokeOpacity={0.6}
                markerEnd="url(#bp-arrow)"
              />
            );
          })}
          {connecting && tempPoint && (
            <path
              d={`M ${connecting.x} ${connecting.y} L ${tempPoint.x} ${tempPoint.y}`}
              fill="none"
              stroke="#f5f5f5"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          )}
        </svg>

        {edges.map((edge) => {
          const g = edgeGeometry(edge);
          if (!g) return null;
          return (
            <div
              key={edge.id}
              className={styles.edgeLabelWrap}
              style={{ left: g.mid.x, top: g.mid.y }}
            >
              {editingEdgeId === edge.id ? (
                <input
                  autoFocus
                  className={styles.edgeInput}
                  defaultValue={edge.label}
                  placeholder="rótulo"
                  onBlur={(e) => {
                    onLabelEdge(edge.id, e.target.value);
                    setEditingEdgeId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                />
              ) : (
                <span
                  className={styles.edgeLabel}
                  onClick={() => setEditingEdgeId(edge.id)}
                  title="Clique para editar o rótulo"
                >
                  {edge.label || "+ rótulo"}
                </span>
              )}
              <button
                className={styles.edgeDelete}
                onClick={() => onDeleteEdge(edge.id)}
                title="Remover conexão"
              >
                ×
              </button>
            </div>
          );
        })}

        {nodes.map((node) => {
          const type = typeMap[node.typeId];
          return (
              <div
                  key={node.id}
                    data-node-id={node.id}
                    className={`${styles.nodeWrapper} ${connectTargetId === node.id ? styles.nodeTarget : ""}`}
                    data-cat={type?.category}
                  style={{ left: node.x, top: node.y, width: FALLBACK_NODE_W, height: FALLBACK_NODE_H }}
            >
                  <div
                    className={styles.node}
                    style={{ width: "50%", padding: "10px 10px 10px 10px", height: "100%" }}
                    onPointerDown={(e) => startDragNode(e, node)}
                  >
                <span className={`${styles.corner} ${styles.corner_tl}`} />
                <span className={`${styles.corner} ${styles.corner_tr}`} />
                <span className={`${styles.corner} ${styles.corner_bl}`} />
                <span className={`${styles.corner} ${styles.corner_br}`} />
                <button
                  className={styles.nodeDelete}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNode(node.id);
                  }}
                  title="Remover componente"
                >
                  ×
                </button>
                <div className={styles.iconContainer}>
                  <Icon
                    typeId={type?.id}
                    className={styles.nodeGlyph}
                    size={Math.round(FALLBACK_NODE_H * ICON_SCALE)}
                  />
                </div>

                {/* Render 8 connection points: 4 corners + 4 side centers */}
                {/* Top-left corner */}
                <div
                  className={`${styles.handle} ${styles.handle_corner} ${styles.handle_tl}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "top", "top-left")}
                />
                {/* Top center */}
                <div
                  className={`${styles.handle} ${styles.handle_top_center}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "top", "top-center")}
                />
                {/* Top-right corner */}
                <div
                  className={`${styles.handle} ${styles.handle_corner} ${styles.handle_tr}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "top", "top-right")}
                />
                {/* Right center */}
                <div
                  className={`${styles.handle} ${styles.handle_right_center}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "right", "right-center")}
                />
                {/* Bottom-right corner */}
                <div
                  className={`${styles.handle} ${styles.handle_corner} ${styles.handle_br}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "right", "bottom-right")}
                />
                {/* Bottom center */}
                <div
                  className={`${styles.handle} ${styles.handle_bottom_center}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "bottom", "bottom-center")}
                />
                {/* Bottom-left corner */}
                <div
                  className={`${styles.handle} ${styles.handle_corner} ${styles.handle_bl}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "left", "bottom-left")}
                />
                {/* Left center */}
                <div
                  className={`${styles.handle} ${styles.handle_left_center}`}
                  title="Arraste para conectar"
                  onPointerDown={(e) => startConnecting(e, node, "left", "left-center")}
                />
              </div>

                <ComponentLabel
                  id={`label-${node.id}`}
                  text={node.label}
                  editing={editingNodeId === node.id}
                  labelClassName={styles.nodeLabel}
                  inputClassName={styles.nodeInput}
                  style={{ minWidth: Math.max(0, FALLBACK_NODE_W - 8) }}
                  onRequestEdit={() => setEditingNodeId(node.id)}
                  onRename={(val?: string) => {
                    onRenameNode(node.id, (val || type?.label || "").trim());
                    setEditingNodeId(null);
                  }}
                  title="Duplo clique para renomear"
                />
            </div>
          );
        })}
      </div>
    </div>
  );
}
