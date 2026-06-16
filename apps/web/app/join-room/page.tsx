"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoomPage() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  async function handleJoin() {
    const res = await fetch(
      `http://localhost:3001/rooms/${slug}/join`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      alert("Room not found");
      return;
    }

    router.push(`/room/${slug}`);
  }

  return (
    <div>
      <input
        placeholder="Room Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <button onClick={handleJoin}>
        Join Room
      </button>
    </div>
  );
}