import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(3).max(50),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export enum ShapeType {
  RECTANGLE = "RECTANGLE",
  CIRCLE = "CIRCLE",
  LINE = "LINE",
}

export interface Point {
  x: number;
  y: number;
}

export interface BaseShape {
  id: string;
  type: ShapeType;
}

export interface RectangleShape extends BaseShape {
  type: ShapeType.RECTANGLE;
  start: Point;
  width: number;
  height: number;
}

export interface CircleShape extends BaseShape {
  type: ShapeType.CIRCLE;
  center: Point;
  radius: number;
}

export interface LineShape extends BaseShape {
  type: ShapeType.LINE;
  start: Point;
  end: Point;
}

export type Shape =
  | RectangleShape
  | CircleShape
  | LineShape;