import { WebSocketServer,WebSocket } from "ws";
import { prisma } from "@repo/db";



const rooms=new Map<string,Set<WebSocket>>()



const ws=new WebSocketServer({port:3002})

ws.on("connection", async (socket,req)=>{

    const url=new URL(req.url!,"http://localhost")
    const token=url.searchParams.get("token")
    const roomSlug=url.searchParams.get("roomSlug")

    if (!token || !roomSlug) {
    socket.close();
    return;
}

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
     slug: roomSlug!,
     },
    });

    if (!room || !isValidated) {
    socket.close();
     return;
}

    //we will check if there is new person in the room

    if(!rooms.has(room.slug)){
        rooms.set(room.slug,new Set())

    }

    rooms.get(room.slug)?.add(socket)




    const user=isValidated.user
    console.log(
  `${user.email} joined ${room.slug}`
);

    socket.on("message",(data)=>{

        const roomSockets=rooms.get(room.slug)

        roomSockets?.forEach((client)=>{
            if(client!==socket){
                client.send(JSON.parse(data.toString()))
            }
        })
    
    })


    await prisma.shape.create({
        data:{
            roomId:room.id,
            userId:user.id,
            shapeData:
        }
    })



    socket.on("close",()=>{
        const roomSockets=rooms.get(room.slug)

        roomSockets?.delete(socket)

        if(roomSockets?.size===0){
            rooms.delete(room.slug)
        }
    })
})

