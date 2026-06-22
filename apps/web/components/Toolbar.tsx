"use client";

import React, { useState, useEffect, useRef } from "react";
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

export type StrokeColor =
  | "#000000"
  | "#ef4444"
  | "#22c55e"
  | "#3b82f6"
  | "#f59e0b";

export type BackgroundColor =
  | "#ffffff"
  | "#fce7f3" // Pink
  | "#dcfce7" // Green
  | "#dbeafe" // Blue
  | "#fef3c7"; // Yellow

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

export default function Toolbar({
  tool,
  setTool,
  strokeColor,
  setStrokeColor,
  backgroundColor,
  setBackgroundColor,
}: ToolbarProps) {
  const [showColors, setShowColors] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  // Auto-close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowColors(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm  flex justify-center">
      <div
        ref={popoverRef}
        className="relative flex flex-row items-center justify-around bg-white px-6 py-1.5 rounded-2xl shadow-lg border border-gray-100 h-12 w-full"
      >
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

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {/* Color Settings Button */}
        <button
          onClick={() => setShowColors(!showColors)}
          className="flex items-center gap-1 p-1.5 rounded-lg transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          title="Colors"
        >
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: strokeColor }}
          />
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: backgroundColor }}
          />
        </button>

        {/* Minimal & Compact Colors Popover */}
        {showColors && (
          <div className="absolute w-40 h-30 top-15 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10 flex flex-col gap-2.5 right-3.5">
            
            <div className="flex flex-col gap-1 justify-center items-center">
              <div className="text-[10px] font-medium text-gray-500">Stroke</div>
              <div className="flex items-center gap-1.5">
                {["#000000", "#ef4444", "#22c55e", "#3b82f6", "#f59e0b"].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setStrokeColor(c)}
                      className={`w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center transition-all ${
                        strokeColor === c
                          ? "ring-2 ring-indigo-500"
                          : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-40 h-30 items-center justify-center">
              <div className="text-[10px] font-medium text-gray-500">Background</div>
              <div className="flex items-center gap-1.5">
                {["#ffffff", "#fce7f3", "#dcfce7", "#dbeafe", "#fef3c7"].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setBackgroundColor(c)}
                      className={`w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center transition-all ${
                        backgroundColor === c
                          ? "ring-2 ring-indigo-500"
                          : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  )
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}