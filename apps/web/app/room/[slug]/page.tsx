// app/room/[slug]/page.tsx
import React from "react";
import Canvas from "../../../components/Canvas";
export default function RoomPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div>
      <Canvas/>
    </div>
  );
}