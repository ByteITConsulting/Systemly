"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

interface ComponentLabelProps {
  id?: string;
  text: string;
  category?: string;
  editing?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  style?: React.CSSProperties;
  onRequestEdit?: () => void;
  onRename?: (newText: string) => void;
  title?: string;
}

export default function ComponentLabel({
  id,
  text,
  editing,
  labelClassName,
  inputClassName,
  style,
  onRequestEdit,
  onRename,
  title,
}: ComponentLabelProps) {
  const ref = useRef<HTMLSpanElement | HTMLInputElement | null>(null);
  const [fontSize, setFontSize] = useState<number | undefined>(undefined);
  const [widthPx, setWidthPx] = useState<number | undefined>(undefined);

  // Auto-fit font-size and compute exact width to fit the text.
  // If the text is very small, enforce a minimum width (e.g., the component width)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const defaultFont = style?.fontSize ? parseFloat(String(style.fontSize)) : 8;

    function measureTextWidthLocal(txt: string, fontPx: number) {
      const canvas = (measureTextWidthLocal as any)._canvas || ((measureTextWidthLocal as any)._canvas = document.createElement("canvas"));
      const ctx = canvas.getContext("2d")!;
      ctx.font = `${fontPx}px monospace`;
      return Math.ceil(ctx.measureText(txt).width);
    }

    const horizPad = editing ? 10 : 16; // input padding: 3px 5px => 10px, label padding: 4px 8px => 16px
    const minW = style?.minWidth ? Math.max(0, parseFloat(String(style.minWidth))) : 0;
    const cap = style?.maxWidth ? Math.max(0, parseFloat(String(style.maxWidth))) : Infinity;

    const measuredAtDefault = measureTextWidthLocal(String(text || ""), defaultFont);
    const desiredWidth = measuredAtDefault + horizPad;

    // If desired fits within cap, choose max(desired, minW)
    if (desiredWidth <= cap) {
      setFontSize(defaultFont);
      setWidthPx(Math.max(desiredWidth, minW));
      return;
    }

    // If desired exceeds cap and cap is finite, reduce font until it fits
    if (!isFinite(cap) || measuredAtDefault === 0) {
      setFontSize(defaultFont);
      setWidthPx(Math.max(desiredWidth, minW));
      return;
    }

    const availableForText = Math.max(8, cap - horizPad);
    let newFont = Math.max(8, Math.floor(defaultFont * (availableForText / Math.max(1, measuredAtDefault))));
    let measuredAtNew = measureTextWidthLocal(String(text || ""), newFont);
    while (newFont > 8 && measuredAtNew > availableForText) {
      newFont = Math.max(8, newFont - 1);
      measuredAtNew = measureTextWidthLocal(String(text || ""), newFont);
    }
    setFontSize(newFont);
    setWidthPx(Math.max(minW, Math.min(cap, measuredAtNew + horizPad)));
  }, [text, editing, style?.minWidth, style?.maxWidth]);

  const appliedStyle: React.CSSProperties = { ...style };
  if (fontSize) appliedStyle.fontSize = `${fontSize}px`;
  if (widthPx) appliedStyle.width = `${widthPx}px`;
  // ensure width accounts for padding/border so outer box matches calculated size
  appliedStyle.boxSizing = appliedStyle.boxSizing || "border-box";

  if (editing) {
    return (
      <input
        id={id}
        ref={ref as React.RefObject<HTMLInputElement>}
        autoFocus
        className={inputClassName}
        defaultValue={text}
        style={appliedStyle}
        onPointerDown={(e) => e.stopPropagation()}
        onBlur={(e) => onRename?.((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    );
  }

  return (
    <span
      id={id}
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={labelClassName}
      style={appliedStyle}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onRequestEdit?.();
      }}
      title={title}
    >
      {text}
    </span>
  );
}
