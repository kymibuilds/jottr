"use client";
import {
  ChevronsLeftIcon,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./userItem";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import DocumentList from "./documentList";

function Navigation() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [width, setWidth] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const create = useMutation(api.documents.create);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [pathname, isMobile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 250 && newWidth <= 600) setWidth(newWidth);
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const handleCreate = () => {
    const promise = create({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created",
      error: "Failed to create note",
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleCollapse}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col ${
          isMobile
            ? "fixed left-0 top-0 z-50 border-r border-border"
            : "border-r border-border"
        }`}
        style={{ width: isCollapsed ? 0 : width }}
      >
        <div className={`flex flex-col h-full ${isCollapsed ? "hidden" : ""}`}>
          {/* Collapse button */}
          <div className="px-3 pt-2 pb-1 flex justify-end">
            <div
              className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-accent cursor-pointer flex items-center justify-center"
              role="button"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </div>
          </div>

          {/* Main navigation section */}
          <div className="px-3 py-2 relative">
            <UserItem />

            {/* Navigation items */}
            <div className="mt-1 space-y-0.5">
              <Item onclick={() => {}} label="Search" icon={Search} isSearch />
              <Item onclick={() => {}} label="Settings" icon={Settings} />
              <Item
                onclick={handleCreate}
                label="New Page"
                icon={PlusCircle}
                isCreate
              />
            </div>
          </div>

          {/* Documents section */}
          <div className="flex-1 px-3 py-2 overflow-y-auto">
            <div className="space-y-0.5">
              <DocumentList />
            </div>
          </div>
        </div>

        {/* Resize handle */}
        {!isMobile && (
          <div
            ref={resizerRef}
            onMouseDown={handleMouseDown}
            className="absolute h-full w-1 right-0 top-0 cursor-ew-resize bg-transparent hover:bg-primary/20"
          />
        )}
      </aside>

      {/* Mobile menu button */}
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="fixed top-3 left-2 z-30 h-8 w-8 flex items-center justify-center rounded-sm bg-secondary hover:bg-accent border border-border"
          aria-label="Open sidebar"
        >
          <MenuIcon className="h-4 w-4" />
        </button>
      )}
    </>
  );
}

export default Navigation;
