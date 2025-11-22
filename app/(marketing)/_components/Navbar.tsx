"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useConvexAuth } from "convex/react";

function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      // transition + default background, then glassy when scrolled
      className={cn(
        // Reduced default horizontal padding from px-6 to px-4 for mobile space
        "z-50 fixed top-0 flex items-center w-full py-2 px-4 md:px-6 text-[#2f3437] transition-colors duration-300 ease-in-out",
        // default: opaque white
        !scrolled && "bg-white",
        // scrolled: glassmorphism
        scrolled &&
          "bg-white/30 backdrop-blur-md border-b border-neutral-200/30 shadow-sm"
      )}
      // inline fallback for browsers / Tailwind setups that don't include backdrop utilities
      style={{
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <p className="font-black text-3xl">jottr</p>

      <div className="md:ml-auto flex items-center gap-x-3">
        {isLoading && <Spinner />}

        {!isAuthenticated && !isLoading && (
          <>
            {/* 1. Log In Button: Reduced padding (px-4) for mobile */}
            <SignInButton mode="modal">
              <Button
                // Changed size from "lg" to "sm" to reduce vertical bulk on mobile
                size="sm"
                variant="outline"
                // Adjusted padding for mobile: px-4 on small screens, px-10 on medium screens
                className="rounded-xl px-4 md:px-10 text-base md:text-lg font-light bg-transparent border-2 border-neutral-800/70 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
              >
                Log in
              </Button>
            </SignInButton>

            {/* 2. Get Started Button: Hidden on small screens (mobile) using hidden sm:block */}
            <SignInButton mode="modal">
              <Button
                // Hidden by default, visible only on 'sm' screens and up
                className="hidden sm:block rounded-xl px-10 text-lg font-light bg-neutral-900 text-white hover:bg-neutral-800 transition-all"
                size="lg"
              >
                Get Started
              </Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button size="sm" className="rounded-xl px-6 py-3 font-medium" asChild>
              <Link href="/documents">Jottr</Link>
            </Button>

            <UserButton />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;