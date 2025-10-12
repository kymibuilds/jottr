"use client";
import { ChevronsLeftIcon, MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./userItem";

function Navigation() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [width, setWidth] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  // Initialize collapse state based on mobile
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  // Auto-collapse on mobile when pathname changes
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 100 && newWidth <= 600) {
        setWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleCollapse}
        />
      )}
      <aside
        className={`group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col transition-all duration-300 ${
          isMobile ? "fixed left-0 top-0 z-50" : ""
        }`}
        style={{ width: isCollapsed ? 0 : width }}
      >
        <div
          className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition cursor-pointer"
          role="button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeftIcon className="h-6 w-6" />
        </div>
        <div className={`${isCollapsed ? "hidden" : ""}`}>
          <div>
            <UserItem />
          </div>
          <div className="mt-4">
            <p>Documents</p>
          </div>
        </div>
        {!isMobile && (
          <div
            ref={resizerRef}
            onMouseDown={handleMouseDown}
            className="absolute h-full w-1 bg-primary/10 right-0 top-0 cursor-ew-resize opacity-0 group-hover/sidebar:opacity-100 transition"
          />
        )}
      </aside>
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="fixed top-3 left-2 z-30 h-8 w-8 flex items-center justify-center text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600/10 transition"
          aria-label="Open sidebar"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
}

export default Navigation;