import { Shape } from "./types";

export function drawShape(ctx:CanvasRenderingContext2D,shape:Shape){


    switch (shape.type) {
        case "RECTANGLE":

        ctx.strokeRect(
            shape.x,shape.y,shape.width,shape.height
        )
            
            break;

        case "LINE":

            ctx.beginPath()
            ctx.moveTo(shape.startX,shape.startY)
            ctx.lineTo(shape.endX,shape.endY)
            ctx.stroke()


        break


        case "CIRCLE":

        ctx.arc(shape.x,shape.y,shape.radius,0,Math.PI*2)
        ctx.stroke()

        break
    
        default:
            break;
    }
}