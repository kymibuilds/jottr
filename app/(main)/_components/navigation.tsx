"use client";
import {
  ChevronsLeftIcon,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./userItem";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import DocumentList from "./documentList";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import TrashBox from "./TrashBox";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

function Navigation() {
  const settings = useSettings();
  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [width, setWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("sidebarWidth")) || 240;
    }
    return 240;
  });
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarCollapsed") === "true";
    }
    return false;
  });
  const lastWidth = useRef(width); // store last non-collapsed width

  const resizerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const create = useMutation(api.documents.create);

  // Save width to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && width > 0) {
      localStorage.setItem("sidebarWidth", width.toString());
      lastWidth.current = width;
    }
  }, [width]);

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
    }
  }, [isCollapsed]);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [pathname, isMobile]);

  // Broadcast sidebar state whenever it changes
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("custom:sidebarState", { detail: isCollapsed })
    );
  }, [isCollapsed]);

  // Open sidebar when receiving the custom event from Navbar
  useEffect(() => {
    const handler = () => resetWidth();
    window.addEventListener("custom:openSidebar", handler as EventListener);
    return () => {
      window.removeEventListener(
        "custom:openSidebar",
        handler as EventListener
      );
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 250 && newWidth <= 600) {
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
    if (isCollapsed) {
      // expanding: restore last width
      setWidth(lastWidth.current);
    } else {
      // collapsing: save current width
      lastWidth.current = width;
      setWidth(0);
    }
    setIsCollapsed((prev) => !prev);
  };

  const resetWidth = () => {
    if (isMobile) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(false);
      setWidth(lastWidth.current);
    }
  };

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
        style={{
          width: isCollapsed ? 0 : width,
          transition: "width 0.1s ease", // smooth animation
        }}
      >
        <div className={`flex flex-col h-full ${isCollapsed ? "hidden" : ""}`}>
          {/* Header Section */}
          <div className="flex-shrink-0 border-b border-border/40">
            {/* Collapse button */}
            <div className="px-3 py-3 flex justify-end">
              <button
                className="h-4 w-4 text-muted-foreground rounded-sm hover:bg-accent cursor-pointer flex items-center justify-center transition-colors"
                onClick={toggleCollapse}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronsLeftIcon className="h-6 w-6" />
              </button>
            </div>

            {/* User section */}
            <div className="px-3 pb-3">
              <UserItem />
            </div>
          </div>

          {/* Main navigation section */}
          <div className="flex-shrink-0 px-3 py-3 border-b border-border/40">
            <nav className="space-y-1">
              <Item
                onclick={search.onOpen}
                label="Search"
                icon={Search}
                isSearch
              />
              <Item
                onclick={settings.onOpen}
                label="Settings"
                icon={Settings}
              />
              <Item
                onclick={handleCreate}
                label="New Page"
                icon={PlusCircle}
                isCreate
              />
            </nav>
          </div>

          {/* Documents section */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-1">
              <DocumentList />
              <Item onclick={handleCreate} icon={Plus} label="Add a page" />
            </div>
          </div>

          {/* Footer section */}
          <div className="flex-shrink-0 border-t border-border/40 px-3 py-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center gap-x-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-muted-foreground transition-colors">
                  <Trash className="h-4 w-4" />
                  <span>Trash</span>
                </button>
              </PopoverTrigger>

              <PopoverContent
                className="w-72 p-0"
                side={isMobile ? "bottom" : "right"}
                align="start"
              >
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-1">Trash</h4>
                  <TrashBox />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Resize handle */}
        {!isMobile && (
          <div
            ref={resizerRef}
            onMouseDown={handleMouseDown}
            className="absolute h-full w-1 right-0 top-0 cursor-ew-resize bg-transparent hover:bg-primary/20 transition-colors"
          />
        )}
      </aside>

      {/* Mobile menu button */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="fixed top-3 left-3 z-30 h-9 w-9 flex items-center justify-center rounded-md bg-secondary hover:bg-accent border border-border shadow-sm transition-colors"
          aria-label="Open sidebar"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      )}
    </>
  );
}

export default Navigation;