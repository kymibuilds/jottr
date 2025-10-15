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
          className="flex items-center gap-2 px-2 py-2 w-full rounded-md hover:bg-gray-200/20 dark:hover:bg-gray-700/50"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.imageUrl} />
          </Avatar>
          <span className="text-sm font-semibold truncate dark:text-white text-gray-900">
            {user?.fullName}&apos;s kitchen
          </span>
          <ChevronsLeftRight className="rotate-90 h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg"
        align="center"
        forceMount
        alignOffset={1}
      >
        <DropdownMenuLabel className="p-0 mb-1 text-sm dark:text-gray-300">
          Account
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.emailAddresses[0].emailAddress}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 border-gray-200 dark:border-gray-700" />

        <DropdownMenuItem className="px-2 py-1 text-sm gap-2 hover:bg-gray-200/20 dark:hover:bg-gray-700/50">
          <ChevronsLeftRight className="h-4 w-4" />
          Switch Kitchen
        </DropdownMenuItem>

        <DropdownMenuItem className="px-2 py-1 text-sm gap-2 hover:bg-gray-200/20 dark:hover:bg-gray-700/50">
          <SettingsIcon className="h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="px-2 py-1 text-sm gap-2 hover:bg-gray-200/20 dark:hover:bg-gray-700/50">
          <SignOutButton>
            <div className="flex items-center gap-2">
              <LogOutIcon className="h-4 w-4" />
              Logout
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserItem;
