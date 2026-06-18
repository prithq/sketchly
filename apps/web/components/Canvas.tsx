"use client";

import { useEffect, useRef,useState } from "react";
import { Shape } from "@repo/common/types";
import Toolbar from "@/components/Toolbar";
import {drawShape} from "@repo/common/drawShape"



export default function Canvas({ slug }: { slug: string }) {

  const [tool,setTool]=useState<"SELECT"|"RECTANGLE"|"CIRCLE"|"LINE">("CIRCLE")
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const clicked = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const shapes = useRef<Shape[]>([]);


  useEffect(() => {

  async function loadShapes() {
    const res = await fetch(
      `http://localhost:3001/rooms/${slug}/shapes`
    );

    const data = await res.json();
    console.log(data)

    shapes.current = data.map(
      (shape: any) => shape.shapeData.shape
    );

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    redraw(ctx, canvas);
  }

  loadShapes();
}, [slug]);

  function redraw(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.current.forEach((shape) => {
     drawShape(ctx,shape)
    });
  }

  // WebSocket

  useEffect(() => {


    const token = localStorage.getItem("token");

    const ws = new WebSocket(
      `ws://localhost:3002?token=${token}&roomSlug=${slug}`
    );

    ws.onopen = () => {
      console.log("Connected");
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

     if(message.shape){
  shapes.current.push(message.shape);

  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  if (!canvas || !ctx) return;

  redraw(ctx, canvas);
}
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [slug]);

  // Canvas

  useEffect(()=>{

    const canvas=canvasRef.current
    if(!canvas)return
    const ctx=canvas.getContext("2d")
    if(!ctx)return

  
    canvas.width=window.innerWidth
    canvas.height=window.innerHeight

    ctx.strokeStyle="black"


    const handleMouseDown=(e:MouseEvent)=>{

      
  clicked.current = true;
  startX.current = e.clientX;
  startY.current = e.clientY;

    }

    const handleMouseUp=(e:MouseEvent)=>{

      if(tool==="RECTANGLE"){

        if(!clicked.current)
          return

        clicked.current=false

        const width=e.clientX-startX.current
        const height=e.clientY-startY.current

        const shape: Shape = {
          type: "RECTANGLE",
          x: startX.current,
          y: startY.current,
          width,
          height,
        };

        shapes.current.push(shape)

        
        wsRef.current?.send(
          JSON.stringify({
            type: "RECTANGLE",
            shape,
          })
        );
        
        redraw(ctx,canvas)

      }


      if(tool==="CIRCLE"){

        if(!clicked.current){

          return
        }
        clicked.current=false

        const width=e.clientX-startX.current
        const height=e.clientY-startY.current

        
        const shape:Shape={
          type:"CIRCLE",
          x:startX.current,
          y:startY.current,
          width,
          height
        }
        shapes.current.push(shape)

        wsRef.current?.send(JSON.stringify({
          type:"CIRCLE",
          shape
        }))

        redraw(ctx,canvas)
      }


      if(tool==="LINE"){

        if(!clicked.current){
          return
        }

        clicked.current=false

        const endX=e.clientX
        const endY=e.clientY

        const shape:Shape={
          type:"LINE",
          startX:startX.current,
          startY:startY.current,
          endX,
          endY
        }

        shapes.current.push(shape)

        wsRef.current?.send(JSON.stringify({
          type:"LINE",
          shape
        }))

        redraw(ctx,canvas)

      }






    }

    const handleMouseMove=(e:MouseEvent)=>{

      if(tool==="RECTANGLE"){

        if(!clicked.current)return

        const width=e.clientX-startX.current
        const height=e.clientY-startY.current
        

        const shape: Shape = {
          type: "RECTANGLE",
          x: startX.current,
          y: startY.current,
          width,
          height,
        };
       redraw(ctx,canvas)
       
      ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)


      }

      


      if(tool==="CIRCLE"){

          if(!clicked.current){

          return
        }
        

        const width=e.clientX-startX.current
        const height=e.clientY-startY.current

        
        const shape:Shape={
          type:"CIRCLE",
          x:startX.current,
          y:startY.current,
          width,
          height
        }

        redraw(ctx,canvas)
        ctx.beginPath()
        ctx.ellipse(
          startX.current+width/2,
          startY.current+height/2,
          Math.abs(width/2),
          Math.abs(height/2),0,0,Math.PI*2
        )

        ctx.stroke()



        

      }


      if(tool==="LINE"){

         if(!clicked.current){
          return
        }

        clicked.current=true

        const endX=e.clientX
        const endY=e.clientY

        const shape:Shape={
          type:"LINE",
          startX:startX.current,
          startY:startY.current,
          endX,
          endY
        }
        redraw(ctx,canvas)
        drawShape(ctx,shape)

        

      }






    }


    canvas.addEventListener("mousedown",handleMouseDown)
    canvas.addEventListener("mouseup",handleMouseUp)
    canvas.addEventListener("mousemove",handleMouseMove)


    return () => {
      canvas.removeEventListener(
        "mousedown",
        handleMouseDown
      );
      canvas.removeEventListener(
        "mouseup",
        handleMouseUp
      );
      canvas.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
   



  },[tool])

  return (
    <>
    
    <Toolbar tool={tool} setTool={setTool} />
    <canvas
      ref={canvasRef}
      className="w-screen h-screen"
    />
    </>
  );
}