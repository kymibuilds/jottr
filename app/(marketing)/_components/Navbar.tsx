"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import React from "react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();
  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full py-4 px-6 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Log in</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Nuta free</Button>
            </SignInButton>
          </>
        )}
          {isAuthenticated && !isLoading && (
            <>
              <Button variant="default" size={"sm"} asChild>
                <Link href={"/documents"}>
                  Enter Nuta
                </Link>
              </Button>
              <UserButton afterSignOutUrl="/"/>
            </>
          )}
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
