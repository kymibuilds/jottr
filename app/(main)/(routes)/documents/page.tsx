"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Documents() {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 overflow-hidden">
      <Image
        src="/workspace/empty.png"
        alt="image"
        width={200}
        height={200}
        quality={40}
        className="block"
      />
      <h2 className="text-lg font-medium m-0">
        welcome to {user?.firstName}&apos;s place
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" /> Create a Note
      </Button>
    </div>
  );
}

export default Documents;
