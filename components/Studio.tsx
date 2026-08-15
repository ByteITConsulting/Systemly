"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import ChallengePanel from "./ChallengePanel";
import { Tutorial } from "./Tutorial";
import { NodeData, EdgeData } from "@/lib/types";
import { COMPONENT_TYPES } from "@/lib/componentTypes";
import { type PointId } from "@/lib/connectionPoints";
import styles from "./Studio.module.scss";

const typeMap = Object.fromEntries(COMPONENT_TYPES.map((c) => [c.id, c]));

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export default function Studio() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [challengeId, setChallengeId] = useState("url-shortener");
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddNode = useCallback((typeId: string, x: number, y: number) => {
    const type = typeMap[typeId];
    setNodes((prev) => [
      ...prev,
      { id: nextId("node"), typeId, label: type?.label ?? typeId, x, y },
    ]);
  }, []);

  const handleMoveNode = useCallback((id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
  }, []);

  const handleRenameNode = useCallback((id: string, label: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, label } : n)));
  }, []);

  const handleDeleteEdge = useCallback((id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleLabelEdge = useCallback((id: string, label: string) => {
    setEdges((prev) => prev.map((e) => (e.id === id ? { ...e, label } : e)));
  }, []);

  const handleCreateEdge = useCallback(
    (fromId: string, toId: string, fromPoint?: PointId, toPoint?: PointId) => {
      setEdges((prev) => {
        const exists = prev.some(
          (e) => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
        );
        if (exists) return prev;
        return [
          ...prev,
          {
            id: nextId("edge"),
            from: fromId,
            to: toId,
            label: "",
            fromPoint,
            toPoint,
          },
        ];
      });
    },
    []
  );

  const handleClear = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    if (!window.confirm("Limpar todo o canvas? Essa ação não pode ser desfeita.")) return;
    setNodes([]);
    setEdges([]);
  }, [nodes.length, edges.length]);

  const handleExport = useCallback(async () => {
    if (!canvasRef.current || nodes.length === 0) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: "#0a1f33",
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `system-design-${challengeId}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível exportar o diagrama. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }, [nodes.length, challengeId]);

  return (
    <div className={styles.studio}>
      <Tutorial />
      <Toolbar
        onExport={handleExport}
        onClear={handleClear}
        exporting={exporting}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />
      <div className={styles.body}>
        <Sidebar />
        <Canvas
          nodes={nodes}
          edges={edges}
          onAddNode={handleAddNode}
          onMoveNode={handleMoveNode}
          onDeleteNode={handleDeleteNode}
          onRenameNode={handleRenameNode}
          onCreateEdge={handleCreateEdge}
          onDeleteEdge={handleDeleteEdge}
          onLabelEdge={handleLabelEdge}
          canvasRef={canvasRef}
        />
        <ChallengePanel challengeId={challengeId} onSelectChallenge={setChallengeId} nodes={nodes} />
      </div>
    </div>
  );
}
