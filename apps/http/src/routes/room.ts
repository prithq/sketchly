import { Router } from "express";

import { prisma } from "@repo/db";

import { requireAuth } from "../middleware/auth";

import { createRoomSchema } from "@repo/common";
import { string } from "zod";

const roomRouter: Router = Router();

roomRouter.post("/create",requireAuth,async (req,res)=>{

    const user=(req as any).user

    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.name
    });
  }
  
  
  roomRouter.get("/:slug/shapes",async(req,res)=>{
  
  const room=await prisma.room.findUnique({
    where:{
      slug:req.params.slug!
  
    },
    include:{
      shapes:true
    }
  })
  
  if(!room){
    return res.status(404).json({
      message:"NO ROOM EXISTS"
    })
  }
  
    
  res.json(room.shapes)
  })
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
    
  // Ensure slug is a string (req.params can be string | string[] | undefined)
  const rawSlug = req.params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) {
    return res.status(400).json({ message: "Missing slug" });
  }

  const room = await prisma.room.findUnique({
    where: {
      slug,
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




export default roomRouter