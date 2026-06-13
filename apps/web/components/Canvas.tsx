"use client";
import React, { useState } from "react";
import { useRef,useEffect } from "react";
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

import {Shape} from "@repo/common"

export default function Canvas(){

    const canvasRef=useRef<HTMLCanvasElement>(null)
   
    const clicked=useRef(false)
    const startX=useRef(0)
    const startY=useRef(0)
    
    const shapes=useRef<Shape[]>([])

    type Tool="rectangle"
    const[tool,setTool]=useState<Tool>("rectangle")

    

    useEffect(()=>{



        if(canvasRef.current){
            const canvas=canvasRef.current
            const ctx=canvas.getContext("2d")
            if(ctx)
            ctx.strokeStyle="rgb(255, 255, 255)"

            canvas.width = window.innerWidth; 
            canvas.height = window.innerHeight;

            function redraw(){
                ctx?.clearRect(0,0,canvas.width,canvas.height)
                shapes.current.forEach((shape)=>{
                    ctx?.strokeRect(
                        shape.x,
                        shape.y,
                        shape.width,
                        shape.height
                    )
                })
            }

            if(!ctx)return

            canvas.addEventListener("mousedown",(e)=>{

                
                clicked.current=true
                startX.current=e.clientX
                startY.current=e.clientY
                

            })

            canvas.addEventListener("mouseup",async(e)=>{
                clicked.current=false
                 const width=e.clientX-startX.current
                 const height=e.clientY-startY.current
                      
                
                shapes.current.push({

                     x: startX.current,
                     y: startY.current,
                     width,
                     height,
                 })

                 ctx.clearRect(0,0,canvas.width,canvas.height)

                 redraw()

                
            })

            canvas.addEventListener("mousemove",(e)=>{
                if(!clicked.current)
                    return

               
               
                const width=e.clientX-startX.current
                const height=e.clientY-startY.current
                ctx.clearRect(0,0,canvas.width,canvas.height)
                 redraw()
                ctx.strokeStyle="white"
                ctx.strokeRect(startX.current,startY.current,width,height)
            })

        }
    },[canvasRef])

    return(
        <canvas ref={canvasRef} className="w-screen h-screen " />
    )

    
}