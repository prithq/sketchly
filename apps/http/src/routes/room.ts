import { Router } from "express";

import { prisma } from "@repo/db";

import { requireAuth } from "../middleware/auth";
import { CreateRoomInput } from "@repo/common";
import { createRoomSchema } from "@repo/common";
const router=Router()

router.post("/",requireAuth,async (req,res)=>{

    const user=(req as any).user

    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
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