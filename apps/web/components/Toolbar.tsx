"use client";

import {
  MousePointer2,
  Square,
  Circle,
  Minus,
} from "lucide-react";



type Tool= |"SELECT"|"RECTANGLE"|"CIRCLE"|"LINE"

interface ToolbarProps{
    tool:Tool;
    setTool:(tool:Tool)=>void
}

  const baseButton =
    "p-2 rounded-md transition-colors";

  const activeButton =
    "bg-violet-100 text-violet-700";

  const inactiveButton =
    "text-black hover:bg-gray-100";



export default function Toolbar({tool,setTool}:ToolbarProps) {
  return (
    
    <div className="fixed
    top-6
    left-1/2
    -translate-x-1/2
    flex
    items-center
    gap-2
    rounded-xl
    border
    border-gray-200
    bg-white
    px-3
    py-2
    shadow-sm">

    
        <div className="flex items-center justify-around bg-white border border-gray-100 rounded py-3.5 shadow-sm w-100 h-12">
            <div>
               <button onClick={()=>setTool("SELECT")}className="p-2 rounded hover:bg-gray-100 text-black items-center justify-center flex">
        <MousePointer2 size={20} />
      </button>

            </div>

            <div className="">
      <button  onClick={()=>setTool("RECTANGLE")}className=" text-black p-2 rounded flex items-center justify-center">
        <Square size={20} />

      </button>
            </div>
<div>


      <button onClick={()=>setTool("CIRCLE")} className="p-2 rounded hover:bg-gray-100 text-black items-center justify-center flex">
        <Circle size={20} />
      </button>
</div>
<div>

      <button onClick={()=>setTool("LINE")} className="p-2 rounded hover:bg-gray-100 text-black flex items-center justify-center">
        <Minus size={20} />
      </button>
</div>
        </div>
        </div>
   
  );
}