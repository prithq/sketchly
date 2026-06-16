"use client";

import { useEffect, useRef } from "react";
import { Shape } from "@repo/common";

export default function Canvas({ slug }: { slug: string }) {
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
      if (shape.type === "RECTANGLE") {
        ctx.strokeRect(
          shape.x,
          shape.y,
          shape.width,
          shape.height
        );
      }
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

      if (message.type === "RECTANGLE") {
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
  useEffect(() => {





    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.strokeStyle = "white";

    const handleMouseDown = (e: MouseEvent) => {
      clicked.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!clicked.current) return;

      clicked.current = false;

      const width = e.clientX - startX.current;
      const height = e.clientY - startY.current;

      const shape = {
        type: "RECTANGLE" as const,
        x: startX.current,
        y: startY.current,
        width,
        height,
      };

      shapes.current.push(shape);

      wsRef.current?.send(
        JSON.stringify({
          type: "RECTANGLE",
          shape,
        })
      );

      redraw(ctx, canvas);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!clicked.current) return;

      const width = e.clientX - startX.current;
      const height = e.clientY - startY.current;

      redraw(ctx, canvas);

      ctx.strokeRect(
        startX.current,
        startY.current,
        width,
        height
      );
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-screen h-screen bg-slate-950"
    />
  );
}