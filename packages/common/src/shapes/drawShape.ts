import { Shape } from "./types";

export function drawShape(ctx:CanvasRenderingContext2D,shape:Shape,strokeColor:string){


    switch (shape.type) {
        case "RECTANGLE":
 ctx.strokeStyle=shape.strokeColor
 ctx.lineWidth = 2;
        ctx.strokeRect(
            shape.x,shape.y,shape.width,shape.height
        )
            
            break;

        case "LINE":

            ctx.beginPath()
            ctx.moveTo(shape.startX,shape.startY)
            ctx.lineTo(shape.endX,shape.endY)
            ctx.lineWidth = 2;
            ctx.strokeStyle=shape.strokeColor
            ctx.stroke()


        break


        case "CIRCLE":
        ctx.beginPath()
        ctx.ellipse(
            shape.x+shape.width/2,
            shape.y+shape.height/2,
            Math.abs(shape.width/2),
            Math.abs(shape.height/2),
            0,
            0,
            Math.PI*2
        )
         ctx.strokeStyle=shape.strokeColor
         ctx.lineWidth = 2;
        ctx.stroke()

        break
    
        default:
            break;
    }
}