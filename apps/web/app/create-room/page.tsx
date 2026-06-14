"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function CreateRoomPage(){



    const [name,setName]=useState("")
    const router=useRouter()

    async function handleCreate(){
       const res= await fetch("http://localhost:3001/rooms/create",
            {
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name})
            }
        )


        const data=await res.json()
        router.push(`/room/${data.slug}`)
    }

    return(
        <div>
            <input type="text" placeholder="Room Name" onChange={(e)=>setName(e.target.value)}  />
            <button onClick={handleCreate}>Create Room</button>
        </div>
    )


    


}