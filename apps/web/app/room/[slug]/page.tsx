// app/room/[slug]/page.tsx
import React from "react";
import Canvas from "@/components/Canvas";
import { authClient } from "@/lib/auth-client";
import Toolbar from "@/components/Toolbar";

export default async function RoomPage({
  params,
}: {
  params: { slug: string };
}) {

    const {slug}= await params
    const session = await authClient.getSession();
    console.log(`this is session at frontend:${session}`)

console.log(session);
  return (
    <div>
        <Toolbar />
      <Canvas slug={slug}/>
    </div>
  );
}