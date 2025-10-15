"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Title from "./Title";
import Banner from "./Banner";

function Navbar() {
  const params = useParams();
  const documentId = params?.documentId as Id<"documents"> | undefined;

  const document = useQuery(
    api.documents.getById,
    documentId ? { documentId } : "skip"
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => setIsCollapsed(e.detail);
    window.addEventListener("custom:sidebarState", handler as EventListener);
    return () =>
      window.removeEventListener(
        "custom:sidebarState",
        handler as EventListener
      );
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-20 bg-background dark:bg-[#1f1f1f] px-1 py-2 h-10 flex items-center gap-x-4">
        {/* Always show Menu button if sidebar is collapsed */}
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("custom:openSidebar"))
            }
            className="h-5 w-5 text-muted-foreground cursor-pointer"
          />
        )}

        {/* Document-dependent title */}
        {documentId ? (
          <div className="flex items-center justify-between w-full">
            {document === undefined ? (
              <Title.Skeleton />
            ) : (
              <Title initialData={document} />
            )}
          </div>
        ) : (
          <div className="flex-1" /> // placeholder to keep spacing consistent
        )}

        {/* Banner only for archived documents */}
      </nav>
      {document?.isArchived && <Banner documentId={document._id} />}
    </>
  );
}

export default Navbar;
