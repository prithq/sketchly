import {auth} from "@repo/auth"
import { Request,Response,NextFunction } from "express"

export async function requireAuth(
    req:Request,
    res:Response,
    next:NextFunction
){

    const session = await auth.api.getSession({headers:req.headers as any})

    if(!session){
        return res.status(401).json({
            message:"not allowed"
        })
    }

    (req as any).user=session.user
    next()


}