import { Shape } from "@repo/common/types";
import { drawShape } from "@repo/common/drawShape";

export function redraw(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shape[]
) {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  shapes.forEach((shape) => {
    drawShape(ctx, shape);
  });
}