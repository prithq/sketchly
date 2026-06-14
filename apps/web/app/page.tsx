"use client";

import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      {session
        ? session.user.email
        : "Not logged in"}
    </div>
  );
}