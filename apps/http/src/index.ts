import express from "express";
import { auth } from "@repo/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();
const roomRouter=express.Router()

app.use(express.json());

app.use("/api/auth/", toNodeHandler(auth));

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

app.get("/me",async (req,res)=>{
    const session=await auth.api.getSession({headers:req.headers as any})
    res.json(session)
})
app.use("/rooms",roomRouter)