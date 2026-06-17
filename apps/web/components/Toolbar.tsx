"use client";

import {
  MousePointer2,
  Square,
  Circle,
  Minus,
} from "lucide-react";

export default function Toolbar() {
  return (
    <div
      className="
        fixed
        top-6
        left-1/2
        -translate-x-1/2
        flex
        items-center
        gap-2
        rounded-xl
        border
        bg-white
        h-10
        shadow-lg
        w-100
      "
    >
        <div className="flex justify-around space-x-">
               <button className="p-2 rounded hover:bg-gray-100 text-black">
        <MousePointer2 size={20} />
      </button>

      <button className="p-2 rounded hover:bg-gray-100 text-black">
        <Square size={20} />
      </button>

      <button className="p-2 rounded hover:bg-gray-100 text-black">
        <Circle size={20} />
      </button>

      <button className="p-2 rounded hover:bg-gray-100 text-black">
        <Minus size={20} />
      </button>
        </div>
   
    </div>
  );
}