"use client";


import { useState } from "react";
import { authClient } from "@/lib/auth-client"


export default function SignupPage(){
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

   async function handleSignup() {
    try{

        await authClient.signUp.email({name,email,password})
        alert("Signup successful!");
    }catch(err){
        console.error()
        return
    }

 
    
}


    return(
        <div className="flex flex-col gap 4 p-10">
            <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>

            <button onClick={handleSignup}>Sign Up</button>
        </div>
    )
}