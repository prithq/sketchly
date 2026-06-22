import { Shape } from "./types";

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  strokeColor:string
) {
  const headLength = 15;

  const angle = Math.atan2(
    toY - fromY,
    toX - fromX
  );

  ctx.beginPath();

  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);

  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );

  ctx.moveTo(toX, toY);

  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.strokeStyle=strokeColor

  ctx.stroke();
}

export function drawShape(ctx:CanvasRenderingContext2D,shape:Shape){

    

    switch (shape.type) {
      
        case "RECTANGLE":
 ctx.lineWidth = 2;
 ctx.strokeStyle=shape.strokeColor
        ctx.strokeRect(
            shape.x,shape.y,shape.width,shape.height
        )
            
            break;

        case "LINE":
ctx.strokeStyle=shape.strokeColor
            ctx.beginPath()
            ctx.moveTo(shape.startX,shape.startY)
            ctx.lineTo(shape.endX,shape.endY)
            ctx.lineWidth = 2;
            ctx.strokeStyle=shape.strokeColor
            ctx.stroke()


        break


        case "CIRCLE":
        ctx.beginPath()
        ctx.strokeStyle=shape.strokeColor
        ctx.ellipse(
            shape.x+shape.width/2,
            shape.y+shape.height/2,
            Math.abs(shape.width/2),
            Math.abs(shape.height/2),
            0,
            0,
            Math.PI*2
        )
        
         ctx.lineWidth = 2;
        ctx.stroke()


    

        break

case "ARROW":
ctx.strokeStyle=shape.strokeColor
  drawArrow(

    ctx,
    shape.startX,
    shape.startY,
    shape.endX,
    shape.endY,
    shape.strokeColor
  );
  break;

        
case "TEXT":
  
  ctx.fillStyle = shape.strokeColor;
  ctx.font = "20px Arial";
  ctx.fillText(
    shape.text,
    shape.x,
    shape.y
  );
  break;
        default:
            break;
    }
}