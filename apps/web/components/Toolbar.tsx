"use client";

import React from "react";
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Type,
  Image as ImageIcon,
  Eraser,
} from "lucide-react";

export type Tool =
  | "SELECT"
  | "RECTANGLE"
  | "CIRCLE"
  | "LINE"
  | "ARROW"
  | "TEXT"
  | "IMAGE"
  | "ERASER";

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
}

export default function Toolbar({ tool, setTool }: ToolbarProps) {
  const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
    { id: "SELECT", icon: MousePointer2, label: "Select" },
    { id: "RECTANGLE", icon: Square, label: "Rectangle" },
    { id: "CIRCLE", icon: Circle, label: "Circle" },
    { id: "ARROW", icon: ArrowRight, label: "Arrow" },
    { id: "LINE", icon: Minus, label: "Line" },
    { id: "TEXT", icon: Type, label: "Text" },
    { id: "IMAGE", icon: ImageIcon, label: "Image" },
    { id: "ERASER", icon: Eraser, label: "Eraser" },
  ];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl flex justify-center">
     
      <div className="flex flex-row items-center justify-around bg-white px-6 py-1.5 rounded-2xl shadow-lg border border-gray-100 h-12 w-full">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${
                tool === t.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
            title={t.label}
          >
            <t.icon size={16} strokeWidth={2} />
          </button>
        ))}
      </div>

      <div className="mt-2 text-[10px] text-gray-400 font-medium tracking-wider inline">
       //
      </div>
    </div>
  );
}