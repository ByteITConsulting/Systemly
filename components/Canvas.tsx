"use client";

import { useEffect, useRef, useState } from "react";
import { NodeData, EdgeData, NODE_WIDTH, NODE_HEIGHT } from "@/lib/types";
import { COMPONENT_TYPES } from "@/lib/componentTypes";
import styles from "./Canvas.module.scss";
import ComponentLabel from "./ComponentLabel";

export const CANVAS_WIDTH = 2400;
export const CANVAS_HEIGHT = 1400;

const typeMap = Object.fromEntries(COMPONENT_TYPES.map((c) => [c.id, c]));
const HANDLE_DIRS = ["top", "right", "bottom", "left"] as const;
type HandleDir = (typeof HANDLE_DIRS)[number];

interface CanvasProps {
  nodes: NodeData[];
  edges: EdgeData[];
  onAddNode: (typeId: string, x: number, y: number) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onDeleteNode: (id: string) => void;
  onRenameNode: (id: string, label: string) => void;
  onCreateEdge: (fromId: string, toId: string) => void;
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
  const pendingConnectionRef = useRef<{ fromId: string; toId: string } | null>(null);
  const [dragging, setDragging] = useState<Dragging | null>(null);
  const [connecting, setConnecting] = useState<Connecting | null>(null);
  const [connectTargetId, setConnectTargetId] = useState<string | null>(null);
  const [tempPoint, setTempPoint] = useState<{ x: number; y: number } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);

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
    onAddNode(typeId, Math.max(0, p.x - NODE_WIDTH / 2), Math.max(0, p.y - NODE_HEIGHT / 2));
  }

  function startDragNode(e: React.PointerEvent, node: NodeData) {
    e.stopPropagation();
    const p = pointInCanvas(e);
    setDragging({ id: node.id, offsetX: p.x - node.x, offsetY: p.y - node.y });
  }

  function handleAnchor(node: NodeData, dir: HandleDir) {
    switch (dir) {
      case "top":
        return { x: node.x + NODE_WIDTH / 2, y: node.y };
      case "bottom":
        return { x: node.x + NODE_WIDTH / 2, y: node.y + NODE_HEIGHT };
      case "left":
        return { x: node.x, y: node.y + NODE_HEIGHT / 2 };
      case "right":
        return { x: node.x + NODE_WIDTH, y: node.y + NODE_HEIGHT / 2 };
    }
  }

  function startConnecting(e: React.PointerEvent, node: NodeData, dir: HandleDir) {
    e.stopPropagation();
    e.preventDefault();
    const anchor = handleAnchor(node, dir);
    setConnecting({ fromId: node.id, x: anchor.x, y: anchor.y });
    setTempPoint(anchor);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (connecting) {
      const p = pointInCanvas(e);
      setTempPoint(p);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hoverNode = el?.closest<HTMLElement>("[data-node-id]");
      const hoverId = hoverNode?.dataset.nodeId ?? null;
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
          pendingConnectionRef.current = { fromId: current.fromId, toId };
        }
        return null;
      });
      setConnectTargetId(null);
      setTempPoint(null);
      setDragging(null);
    }
    window.addEventListener("pointerup", finishConnection);
    return () => window.removeEventListener("pointerup", finishConnection);
  }, []);

  // Handle pending connection creation after state updates
  useEffect(() => {
    if (pendingConnectionRef.current) {
      const { fromId, toId } = pendingConnectionRef.current;
      pendingConnectionRef.current = null;
      onCreateEdge(fromId, toId);
    }
  }, [connecting, onCreateEdge]);

  function center(node: NodeData) {
    return { x: node.x + NODE_WIDTH / 2, y: node.y + NODE_HEIGHT / 2 };
  }

  function edgeGeometry(edge: EdgeData) {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);
    if (!from || !to) return null;
    const c1 = center(from);
    const c2 = center(to);
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
              style={{ left: node.x, top: node.y, width: NODE_WIDTH, height: NODE_HEIGHT }}
            >
              <div
                className={styles.node}
                style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
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
                <span className={styles.nodeGlyph}>{type?.glyph}</span>

                {HANDLE_DIRS.map((dir) => (
                  <div
                    key={dir}
                    className={`${styles.handle} ${styles[`handle_${dir}`]}`}
                    title="Arraste para conectar"
                    onPointerDown={(e) => startConnecting(e, node, dir)}
                    data-tour={dir === "right" && nodes.length > 0 ? "canvas-connect" : undefined}
                  />
                ))}
              </div>

              <ComponentLabel
                id={`label-${node.id}`}
                text={node.label}
                editing={editingNodeId === node.id}
                labelClassName={styles.nodeLabel}
                inputClassName={styles.nodeInput}
                onRequestEdit={() => setEditingNodeId(node.id)}
                onRename={(val) => {
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
