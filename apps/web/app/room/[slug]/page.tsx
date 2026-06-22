"use client"; 

import React from "react";
import Canvas from "@/components/Canvas";
import { authClient } from "@/lib/auth-client";
import Toolbar from "@/components/Toolbar";
import { useState, useEffect } from "react";
import { Tool } from "@repo/common/types";
import { UploadButton } from "@uploadthing/react";

export default function RoomPage({ params }: { params: { slug: string } }) {
  const [slug, setSlug] = useState<string>("");
  const [tool, setTool] = useState<Tool>("SELECT");
  const [strokeColor,setStrokeColor] = useState("#000000")
  const [backgroundColor,setBackgroundColor]=useState("ffffff")


  useEffect(() => {
    
    async function getParams() {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    async function getSession() {
      const session = await authClient.getSession();
      console.log(`this is session at frontend:`, session);
    }
    getSession();
  }, []);

  if (!slug) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white relative">
      
      <Toolbar
  tool={tool}
  setTool={setTool}
  strokeColor={strokeColor}
  setStrokeColor={setStrokeColor}
  backgroundColor={backgroundColor}
  setBackgroundColor={setBackgroundColor}
/>

<Canvas
  slug={slug}
  tool={tool}
  strokeColor={strokeColor}
  backgroundColor={backgroundColor}
/>



<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res:any) => {
    console.log(res);
  }}
/>
    </div>
  );
}