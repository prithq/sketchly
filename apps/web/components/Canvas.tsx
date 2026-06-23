"use client";

import { useEffect, useRef,useState } from "react";
import { Shape} from "@repo/common/types";
import {drawShape} from "@repo/common/drawShape"
import {Tool} from "@repo/common/types"
import { isPointOnShape } from "@/lib/isPointOnShape";

export default function Canvas({ slug,tool,backgroundColor,strokeColor }: { slug: string ,tool:Tool,backgroundColor:string,strokeColor:string}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const clicked = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const shapes = useRef<Shape[]>([]);
  const imageInputRef =
  useRef<HTMLInputElement>(null);

const pendingImageRef =
  useRef<string | null>(null);

  const selectedShapeId =
  useRef<string | null>(null);

const dragging =
  useRef(false);

const dragOffsetX =
  useRef(0);

const dragOffsetY =
  useRef(0);

useEffect(() => {
  const canvas = canvasRef.current;

  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}, []);


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

     if (message.type === "DELETE_SHAPE") {
    const deleteId = message.shapeId;

    shapes.current = shapes.current.filter(
      (s)=>s.id !== deleteId
    );

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    redraw(ctx, canvas);

    return;
  }



  if (message.type === "MOVE_SHAPE") {

  const shape =
    shapes.current.find(
      (s) => s.id === message.shapeId
    );

  if (shape) {
    if (
      shape.type === "TEXT" ||
      shape.type === "IMAGE"
    ) {
      shape.x = message.x;
      shape.y = message.y;
    }
  }

  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  if (!canvas || !ctx) return;

  redraw(ctx, canvas);
}
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


    ctx.strokeStyle="black"


    const handleMouseDown=(e:MouseEvent)=>{
      if (
  tool === "IMAGE" &&
  !pendingImageRef.current
) {
  imageInputRef.current?.click();
  return;
}

    if(tool==="SELECT"){
      const rect=canvas.getBoundingClientRect()
      const mouseX=e.clientX-rect.left
      const mouseY=e.clientY-rect.top

      for(let i=shapes.current.length-1;i>=0;i--){
        const shape=shapes.current[i]
        if(!shape)return
          if (
    shape.type === "IMAGE" &&
    mouseX >= shape.x &&
    mouseX <= shape.x + shape.width &&
    mouseY >= shape.y &&
    mouseY <= shape.y + shape.height
  ) {
    selectedShapeId.current =
      shape.id;

    dragging.current = true;

    dragOffsetX.current =
      mouseX - shape.x;

    dragOffsetY.current =
      mouseY - shape.y;

    return;
  }

      if (
    shape.type === "TEXT" &&
    mouseX >= shape.x &&
    mouseX <=
      shape.x +
        shape.text.length * 12 &&
    mouseY >= shape.y - 24 &&
    mouseY <= shape.y
  ) {
    selectedShapeId.current =
      shape.id;

    dragging.current = true;

    dragOffsetX.current =
      mouseX - shape.x;

    dragOffsetY.current =
      mouseY - shape.y;

    return;
  }
}
  
      }

    

      if(tool==="TEXT"){

        const text= prompt("Enter Text: ")

        if(!text)return

        const rect = canvas.getBoundingClientRect();

        const shape:Shape={
          id:crypto.randomUUID(),
          type:"TEXT",
          x:e.clientX-rect.left,
          y:e.clientY - rect.top,
          text,
          strokeColor
        }

        shapes.current.push(shape)

        wsRef.current?.send(
          JSON.stringify({
            type:"TEXT",
            shape
          })
        )

        redraw(ctx,canvas)



      }

      if(tool==="ERASER"){
        const rect=canvas.getBoundingClientRect()
        const x=e.clientX-rect.left
        const y=e.clientY-rect.top

        for(let i=shapes.current.length-1;i>=0;i--){
          const shape=shapes.current[i]
          if(!shape) continue;

          if(isPointOnShape(x,y,shape)){
            const deleteId=shape.id

            shapes.current=shapes.current.filter(s=>s.id!==deleteId)

            redraw(ctx,canvas)

             wsRef.current?.send(
              JSON.stringify({
                type:
                  "DELETE_SHAPE",
                shapeId:
                  deleteId,
              })
            );
            break;
          }

        }
        return
      }
if (
  tool === "IMAGE" &&
  pendingImageRef.current
) {
   const rect = canvas.getBoundingClientRect();
    const x = e.clientX-rect.left;
 const y = e.clientY-rect.top;
  const shape: Shape = {
    id: crypto.randomUUID(),
    type: "IMAGE",
    x,
    y,
    width: 300,
    height: 200,
    imageData:
      pendingImageRef.current,
  };

  shapes.current.push(shape);

  wsRef.current?.send(
    JSON.stringify({
      type: "IMAGE",
      shape,
    })
  );

  redraw(ctx, canvas);

  pendingImageRef.current = null;

  return;
}

      const rect = canvas.getBoundingClientRect();


  clicked.current = true;
  startX.current = e.clientX-rect.left;
  startY.current = e.clientY-rect.top;

  

    }

    const handleMouseUp=(e:MouseEvent)=>{


      if(tool === "SELECT"){
      dragging.current = false;

      const shape=shapes.current.find((s)=>s.id===selectedShapeId.current)

      if (
        shape &&
        (shape.type === "TEXT" || shape.type === "IMAGE")
      ) {
        wsRef.current?.send(
          JSON.stringify({
            type:"MOVE_SHAPE",
            shapeId:shape.id,
            x:shape.x,
            y:shape.y
          })
        )
      }
     return;
}

      if(tool==="RECTANGLE"){

        if(!clicked.current)
          return

        clicked.current=false

        const width=e.clientX-startX.current
        const height=e.clientY-startY.current

        const shape: Shape = {
          id:crypto.randomUUID(),
          type: "RECTANGLE",
          x: startX.current,
          y: startY.current,
          width,
          height,strokeColor
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
          id:crypto.randomUUID(),
          type:"CIRCLE",
          x:startX.current,
          y:startY.current,
          width,
          height,strokeColor
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
          id:crypto.randomUUID(),
          type:"LINE",
          startX:startX.current,
          startY:startY.current,
          endX,
          endY,strokeColor
        }

        shapes.current.push(shape)

        wsRef.current?.send(JSON.stringify({
          type:"LINE",
          shape
        }))

        redraw(ctx,canvas)

      }

      if(tool==="ARROW"){

        if(!clicked.current)return

        clicked.current=false

         const shape: Shape = {
          id:crypto.randomUUID(),
     type: "ARROW",
     startX: startX.current,
     startY: startY.current,
     endX: e.clientX,
     endY: e.clientY,
     strokeColor,
  };


  shapes.current.push(shape)

  wsRef.current?.send(JSON.stringify({
    type:"ARROW",
    shape
  }))

  redraw(ctx,canvas)


      }

    }

    const handleMouseMove=(e:MouseEvent)=>{

      if(tool==="SELECT" && dragging.current){

          const rect =
        canvas.getBoundingClientRect();

        const mouseX =
        e.clientX - rect.left;

        const mouseY =
        e.clientY - rect.top;

        const shape =
        shapes.current.find(
          (s) =>
            s.id ===
            selectedShapeId.current
        );

        if (!shape) return;

        if (
        shape.type === "TEXT" ||
        shape.type === "IMAGE"
        ) {
        shape.x =
          mouseX - dragOffsetX.current;

        shape.y =
          mouseY - dragOffsetY.current;
        }

        redraw(ctx, canvas);

        return;


      }

      if(tool==="RECTANGLE"){

        if(!clicked.current)return

        const width=e.clientX-startX.current
        const height=e.clientY-startY.current
        

        const shape: Shape = {
          id:crypto.randomUUID(),
          type: "RECTANGLE",
          x: startX.current,
          y: startY.current,
          width,
          height,strokeColor
        };
       redraw(ctx,canvas)
        ctx.strokeStyle=strokeColor
      ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)


      }

      


      if(tool==="CIRCLE"){

          if(!clicked.current){

          return
        }
        

        const width=e.clientX-startX.current
        const height=e.clientY-startY.current

        
        const shape:Shape={
          id:crypto.randomUUID(),
          type:"CIRCLE",
          x:startX.current,
          y:startY.current,
          width,
          height,strokeColor
        }

        redraw(ctx,canvas)
        ctx.beginPath()
        ctx.ellipse(
          startX.current+width/2,
          startY.current+height/2,
          Math.abs(width/2),
          Math.abs(height/2),0,0,Math.PI*2
        )
         ctx.strokeStyle=strokeColor
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
          id:crypto.randomUUID(),
          type:"LINE",
          startX:startX.current,
          startY:startY.current,
          endX,
          endY,
          strokeColor
        }

         ctx.strokeStyle=strokeColor
        redraw(ctx,canvas)
        drawShape(ctx,shape)

        

      }


      if(tool==="ARROW"){

  if(!clicked.current) return;

  const shape: Shape = {
    id:crypto.randomUUID(),
    type: "ARROW",
    startX: startX.current,
    startY: startY.current,
    endX: e.clientX,
    endY: e.clientY,
    strokeColor,
  };

  redraw(ctx, canvas);

  drawShape(ctx, shape);
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
   



  },[tool,strokeColor])

  return (
    <>
    
    <input
  ref={imageInputRef}
  type="file"
  accept="image/*"
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      pendingImageRef.current =
        reader.result as string;
    };

    reader.readAsDataURL(file);
  }}
/>
    <canvas
      ref={canvasRef}
      className="w-screen h-screen" style={{backgroundColor:backgroundColor}}
    />
    </>
  );
}