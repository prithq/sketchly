import { WebSocketServer } from "ws";
import { prisma } from "@repo/db";
const ws=new WebSocketServer({port:3002})

ws.on("connection", async (socket,req)=>{

    const url=new URL(req.url!,"http://localhost")
    const token=url.searchParams.get("token")
    const roomSluug=url.searchParams.get("roomSlug")

    const isValidated =await prisma.session.findFirst({
        where:{
            token:token!
        },
        include:{
            user:true
        }
    })

 

    const room = await prisma.room.findUnique({
     where: {
     slug: roomSluug!,
     },
    });

    if (!room || !isValidated) {
    socket.close();
     return;
}
    const user=isValidated.user

    socket.on("message",(data)=>{

        socket.send("")
    
    })
})

