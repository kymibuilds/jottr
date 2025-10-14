"use client";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import {
  SearchIcon,
  RotateCcwIcon,
  Trash2Icon,
  RotateCcw,
  DeleteIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function TrashBox() {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored successfully!",
      error: "Failed to restore document.",
    });
  };

  const onRemove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Deleting permanently...",
      success: "Document deleted permanently.",
      error: "Failed to delete document.",
    });
    if (params.documentId === documentId) router.push("/documents");
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-[10px]">
      <div className="flex items-center gap-x-1 p-2">
        <SearchIcon className="h-4 w-4" />
        <Input
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Search Trash"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No Documents Found
        </p>

        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded w-full hover:bg-primary/5 flex items-center text-primary justify-between px-2 py-1"
          >
            <span className="truncate">{document.title}</span>
            <div className="flex items-center gap-x-2">
              <div onClick={(e) => onRestore(e, document._id)}>
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </div>
              <div onClick={(e) => onRemove(e, document._id)}>
                <Trash2Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrashBox;
