"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Add this import
import { Analytics } from "@vercel/analytics/next"

function Documents() {
  const { user } = useUser();
  const router = useRouter(); // Add this line
  const create = useMutation(api.documents.create);
  
  const onCreate = () => {
    const promise = create({ title: "Untitled" })
      .then((documentId) => {
        // Navigate to the new document after creation
        router.push(`/documents/${documentId}`);
      });
    
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };
  
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
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 align-middle" /> Create a note
      </Button>
      <Analytics/>
    </div>
  );
}
export default Documents;