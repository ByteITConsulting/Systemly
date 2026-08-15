"use client";

import React from "react";
import ICON_MAP from "@/lib/iconMap";

interface IconProps {
  typeId?: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export default function Icon({ typeId, className, size = 28, style }: IconProps) {
  const C = ICON_MAP[typeId || ""] || ICON_MAP["_fallback"];
  return <C className={className} size={size} style={style} />;
}
