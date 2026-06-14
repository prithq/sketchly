"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signinhandler() {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      console.log(result);
      if(!result)return
      if(!result.data)return
      if(!result.data.token)return
      localStorage.setItem("token",result.data.token)


      alert("Signin successful");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button onClick={signinhandler}>
        Sign In
      </button>
    </div>
  );
}