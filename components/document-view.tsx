"use client";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery } from "convex/react";
import { notFound } from "next/navigation";
import Cover from "@/components/cover";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface DocumentViewProps {
  documentId: Id<"documents">;
  preview?: boolean;
}

export const DocumentView = ({
  documentId,
  preview = false,
}: DocumentViewProps) => {
  const document = useQuery(api.documents.getById, { documentId });
  const update = useMutation(api.documents.update);

  const onChange = useCallback(
    (content: string) => {
      update({ id: documentId, content });
    },
    [documentId, update]
  );

  if (document === undefined) {
    return (
      <div className="pb-40">
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto p-4 rounded-md">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (document === null) {
    notFound();
  }

  return (
    <div className="pb-40">
      <Cover preview={preview} url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto p-4 rounded-md">
        <Toolbar preview={preview} initialData={document} />
        <Editor
          editable={!preview}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  );
};
