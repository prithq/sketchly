import {
  Shape,
  RectangleShape,
  CircleShape,
  LineShape,
  ArrowShape,
  TextShape,
} from "@repo/common/types";

export function isPointOnShape(
  x: number,
  y: number,
  shape: Shape
): boolean {
  switch (shape.type) {
    case "RECTANGLE":
      return isRectangleHit(x, y, shape);

    case "CIRCLE":
      return isCircleHit(x, y, shape);

    case "LINE":
      return isLineHit(x, y, shape);

    case "ARROW":
      return isLineHit(x, y, shape);

    case "TEXT":
      return isTextHit(x, y, shape);

    case "IMAGE":
      return(
        x >= shape.x &&
    x <= shape.x + shape.width &&
    y >= shape.y &&
    y <= shape.y + shape.height
      )

    default:
      return false;
  }
}


function isRectangleHit(
  x: number,
  y: number,
  shape: RectangleShape
) {
  const tolerance = 8;

  const left =
    Math.abs(x - shape.x) <= tolerance &&
    y >= shape.y - tolerance &&
    y <= shape.y + shape.height + tolerance;

  const right =
    Math.abs(
      x - (shape.x + shape.width)
    ) <= tolerance &&
    y >= shape.y - tolerance &&
    y <= shape.y + shape.height + tolerance;

  const top =
    Math.abs(y - shape.y) <= tolerance &&
    x >= shape.x - tolerance &&
    x <= shape.x + shape.width + tolerance;

  const bottom =
    Math.abs(
      y - (shape.y + shape.height)
    ) <= tolerance &&
    x >= shape.x - tolerance &&
    x <= shape.x + shape.width + tolerance;

  return left || right || top || bottom;
}


function isCircleHit(
  x: number,
  y: number,
  shape: CircleShape
) {
  const tolerance = 8;

  const centerX =
    shape.x + shape.width / 2;

  const centerY =
    shape.y + shape.height / 2;

  const radius =
    Math.max(
      Math.abs(shape.width),
      Math.abs(shape.height)
    ) / 2;

  const distance = Math.sqrt(
    (x - centerX) ** 2 +
      (y - centerY) ** 2
  );

  return (
    Math.abs(distance - radius) <
    tolerance
  );
}

function isLineHit(
  x: number,
  y: number,
  shape: LineShape | ArrowShape
) {
  const tolerance = 8;

  const A = x - shape.startX;
  const B = y - shape.startY;

  const C =
    shape.endX - shape.startX;

  const D =
    shape.endY - shape.startY;

  const dot = A * C + B * D;

  const lenSq =
    C * C + D * D;

  const param =
    lenSq !== 0 ? dot / lenSq : -1;

  let xx;
  let yy;

  if (param < 0) {
    xx = shape.startX;
    yy = shape.startY;
  } else if (param > 1) {
    xx = shape.endX;
    yy = shape.endY;
  } else {
    xx =
      shape.startX +
      param * C;

    yy =
      shape.startY +
      param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  const distance = Math.sqrt(
    dx * dx + dy * dy
  );

  return distance < tolerance;
}


function isTextHit(
  x: number,
  y: number,
  shape: TextShape
) {
  const width =
    shape.text.length * 12;

  const height = 24;

  return (
    x >= shape.x &&
    x <= shape.x + width &&
    y >= shape.y - height &&
    y <= shape.y
  );
}