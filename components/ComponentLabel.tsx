"use client";

import React from "react";

interface ComponentLabelProps {
  id?: string;
  text: string;
  category?: string;
  editing?: boolean;
  labelClassName?: string;
  inputClassName?: string;
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
  onRequestEdit,
  onRename,
  title,
}: ComponentLabelProps) {
  if (editing) {
    return (
      <input
        id={id}
        autoFocus
        className={inputClassName}
        defaultValue={text}
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
      className={labelClassName}
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
