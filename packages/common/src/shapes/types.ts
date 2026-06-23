

export interface RectangleShape {
  id:string
  type: "RECTANGLE";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor:string
}


export interface TextShape {
  id:string
  type: "TEXT";
  x: number;
  y: number;
  text:string;
  strokeColor:string
}

export interface CircleShape {
  id:string
  type: "CIRCLE";
  x: number;
  y: number;
  width: number
  height:number
  strokeColor:string
}

export interface LineShape {
  id:string
  type: "LINE";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeColor:string
}

export interface ArrowShape {
  id:string
  type: "ARROW";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeColor: string;
}
export interface ImageShape {
  id: string;
  type: "IMAGE";
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: string;
}

export type Shape =
  | RectangleShape
  | CircleShape
  | LineShape | ArrowShape | TextShape | ImageShape

  export type Tool =
    | "SELECT"
    | "RECTANGLE"
    | "CIRCLE"
    | "LINE"
    | "ARROW"
    | "TEXT"
    | "IMAGE"
    | "ERASER";

