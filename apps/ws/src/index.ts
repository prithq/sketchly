import { WebSocketServer,WebSocket } from "ws";
import { prisma } from "@repo/db";




const rooms=new Map<string,Set<WebSocket>>()



const ws=new WebSocketServer({port:3002})

ws.on("connection", async (socket,req)=>{

    const url=new URL(req.url!,"http://localhost")
    const token=url.searchParams.get("token")
    const roomSlug=url.searchParams.get("roomSlug")
     console.log("TOKEN:", token);
  console.log("ROOM:", roomSlug);

    if (!token || !roomSlug) {
        console.log("Missing token or room");
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

    console.log("SESSION:", !!isValidated);

    const room = await prisma.room.findUnique({
     where: {
     slug: roomSlug!,
     },
    });
      console.log("ROOM FOUND:", !!room);

    if (!room || !isValidated) {
        console.log("Validation failed");
    socket.close();
     return;
}

    //we will check if there is new person in the room

    if(!rooms.has(room.slug)){
        rooms.set(room.slug,new Set())

    }

    rooms.get(room.slug)?.add(socket)




    const user=isValidated.user
   
  console.log(`${user.email} joined ${room.slug}`);


socket.on("message",async (data)=>{

        const roomSockets=rooms.get(room.slug)
        const message = JSON.parse(
         data.toString()
                );

    
    if (
  message.type === "RECTANGLE" ||
  message.type === "CIRCLE" ||
  message.type === "LINE" ||
  message.type === "ARROW" ||
  message.type === "TEXT" ||
  message.type === "IMAGE"
) {

  roomSockets?.forEach((client) => {
    if (client !== socket) {
      client.send(data.toString());
    }
  });

  await prisma.shape.create({
    data: {
      roomId: room.id,
      userId: user.id,
      shapeData: message.shape,
    },
  });

  return;
}

if(message.type==="DELETE_SHAPE"){


const dbShapes=await prisma.shape.findMany({
    where:{
        roomId:room.id

    }
})

const target=dbShapes.find((s)=>(s.shapeData as any).id===message.shapeId)

await prisma.shape.delete({
    where:{
        id:target!.id
    }
})



}

if(message.type==="MOVE_SHAPE"){
    const dbShapes=await prisma.shape.findMany({
        where:{
            roomId:room.id
        }
    })

    const target=dbShapes.find((s)=>(s.shapeData as any).id===message.shapeId)
    if (!target) return;

    const shapeData:any=target.shapeData
    shapeData.x=message.x
    shapeData.y=message.y                                 


    await prisma.shape.update({
  where: {
    id: target.id,
  },
  data: {
    shapeData,
  },
});
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