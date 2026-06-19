

export interface RectangleShape {
  type: "RECTANGLE";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleShape {
  type: "CIRCLE";
  x: number;
  y: number;
  width: number
  height:number
}

export interface LineShape {
  type: "LINE";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}


export type Shape =
  | RectangleShape
  | CircleShape
  | LineShape;

  export type Tool =
    | "SELECT"
    | "RECTANGLE"
    | "CIRCLE"
    | "LINE"
    | "ARROW"
    | "TEXT"
    | "IMAGE"
    | "ERASER";

