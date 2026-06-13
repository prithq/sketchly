import { Router } from "express";

import { prisma } from "@repo/db";

import { requireAuth } from "../middleware/auth";

import { createRoomSchema } from "@repo/common";

const roomRouter: Router = Router();

roomRouter.post("/create",requireAuth,async (req,res)=>{

    const user=(req as any).user

    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.name
    });
  }

    const createRoom= await prisma.room.create({
       
        data:{
                slug:crypto.randomUUID(),
                ownerId:user.id,
                name:parsed.data.name

        }
    })

    if(!createRoom){
        return res.json({
            message:"Room not created"
        })
    }


    return res.status(201).json({

        roomId: createRoom.id,
        slug: createRoom.slug,
    });

})

roomRouter.get("/:slug",async (req,res)=>{

    const slug=req.params.slug

    const room=await prisma.room.findUnique({
        where:{
            slug:slug
        }
    })

    if(!room){
        return res.status(404).json({
            message:"invalid room"
        })
    }

    return res.json(room)
})

roomRouter.post("/:slug/join", requireAuth, async (req, res) => {
    
   const {slug}=req.body
  const room = await prisma.room.findUnique({
    where: {
      slug: slug
    },
  });

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  return res.json({
    success: true,
    room,
  });
});


roomRouter.get("/:slug/shapes",async(req,res)=>{

const room=await prisma.room.findUnique({
  where:{
    slug:req.params.slug!

  }
})

if(!room){
  return res.status(404).json({
    message:"NO ROOM EXISTS"
  })
}

const shapes=await prisma.shape.findMany({
  where:{
    roomId:room.id
  },
  orderBy:{
    createdAt:"asc"
  }
})
res.json(shapes)
})



export default roomRouter