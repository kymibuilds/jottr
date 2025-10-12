"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";

function Documents() {
  const { user } = useUser();
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/workspace/empty.png"
        alt="image"
        width={300}
        height={300}
        quality={40}
        className=""
      />
      <h2 className="text-lg font-medium">
        welcome to {user?.firstName}&apos;s workspace
      </h2>
      <Button className="flex items-center justify-center gap-2"> <PlusCircle className="h-4 w-4 align-middle"/> Create a note</Button>
    </div>
  );
}

export default Documents;
