"use client";

import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsLeftRight, LogOutIcon, SettingsIcon } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/clerk-react";

function UserItem() {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.fullName}&apos;s kitchen
            </span>
          </div>
          <ChevronsLeftRight
            className="rotate-90 ml-2"
            strokeWidth="2"
            size="16"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="center"
        forceMount
        alignOffset={1}
      >
        <DropdownMenuLabel className="py-0">
          Account
          <p className="text-sm text-black/40">
            {user?.emailAddresses[0].emailAddress}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ChevronsLeftRight className="mr-2 h-4 w-4" />
          Switch Kitchen
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SignOutButton>
            <div>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <p>Logout</p>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserItem;
