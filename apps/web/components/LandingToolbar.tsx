"use client";

import { useState } from "react";
import { Scan, Type, Pencil, MessageSquare } from "lucide-react";

export type LandingTool = "SELECT" | "TEXT" | "DRAW" | "COMMENT";

export function LandingToolbar() {
  const [activeTool, setActiveTool] = useState<LandingTool>("SELECT");

  const tools = [
    { id: "SELECT" as LandingTool, icon: Scan, label: "Select (V)" },
    { id: "TEXT" as LandingTool, icon: Type, label: "Text (T)" },
    { id: "DRAW" as LandingTool, icon: Pencil, label: "Draw (D)" },
    { id: "COMMENT" as LandingTool, icon: MessageSquare, label: "Comment (C)" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-short">
      <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`group relative p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-slate-100 text-indigo-600 scale-[1.05]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:scale-[1.02]"
              }`}
              aria-label={tool.label}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
              
              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 scale-0 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white transition-all group-hover:scale-100 shadow-sm whitespace-nowrap">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
