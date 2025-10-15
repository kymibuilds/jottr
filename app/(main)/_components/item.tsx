"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import {
  Archive,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  isCreate?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onclick: () => void;
  icon: LucideIcon;
}

export const Item = ({
  label,
  onclick,
  icon: Icon,
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  isCreate,
  level = 0,
  onExpand,
}: ItemProps) => {
  const { user } = useUser();
  const archive = useMutation(api.documents.archive);
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id });

    toast.promise(promise, {
      loading: "moving to Archived",
      success: "moved to Archived",
      error: "failed to move to Archived",
    });
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${documentId}`);
      }
    );
    toast.promise(promise, {
      loading: "creating a new note...",
      success: "new note created",
      error: "failed to create a new note",
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onclick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full flex items-center font-normal gap-2 rounded-sm cursor-pointer transition-colors duration-150",
        active
          ? "bg-primary/8 text-foreground"
          : "text-muted-foreground hover:bg-accent/20 dark:hover:bg-accent/30"
      )}
    >
      {/* Chevron for expandable items */}
      {!!id && (
        <div
          role="button"
          className="h-4 w-4 flex items-center justify-center rounded-sm hover:bg-accent"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {/* Icon container */}
      {documentIcon ? (
        <div className="shrink-0 h-[18px] w-[18px] flex items-center justify-center text-muted-foreground">
          {documentIcon}
        </div>
      ) : (
        <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
      )}

      {/* Label */}
      <span className="truncate flex-1">{label}</span>

      {/* Keyboard shortcuts */}
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {isCreate && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>O
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-4 w-4 ml-auto rounded hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4  rounded text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40"
              align="start"
              side="right"
              forceMount
            >
              {/* <DropdownMenuItem onClick={() => {}}>
                <Trash className="h-4 w-4 mr-2 rounded text-muted-foreground" />
                <p className="text-foreground text-sm">Delete note</p>
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2 rounded text-muted-foreground" />
                <p className="text-foreground text-sm">Archive note</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center gap-1 mx-2">
                <p className="text-[12px] text-muted-foreground">
                  Last edited by:
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {user?.fullName || "Unknown"}
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded  hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <PlusIcon className="h-4 w-4 text-muted-freground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
