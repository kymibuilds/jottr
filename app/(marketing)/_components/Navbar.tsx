"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import Logo from "./logo"; // Assuming you might want a separate logo component later

function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  // Detect scroll position
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        // Stabilized Geometry: Fixed height h-16 in all states prevents vertical jitter.
        "z-50 fixed top-0 flex items-center w-full h-16 px-4 md:px-6",
        // Visual Padding Adjustment for thinner look when not scrolled
        !scrolled && "py-3", 
        // Base styling: Set to transparent when not scrolled
        "bg-transparent",
        "transition-all duration-300 ease-in-out",
        // Scrolled styling: Only apply appearance changes (no height change)
        scrolled &&
          "border-b shadow-sm border-border/50 backdrop-blur-md bg-background/90"
      )}
    >
      {/* Aesthetic Improvement: Keeping the bold logo but ensuring consistent spacing.
        Using 'tracking-tight' for a modern feel.
      */}
      <p className="font-extrabold text-2xl md:text-3xl tracking-tight text-foreground">
        jottr
      </p>

      {/* Auth/Action Buttons Group */}
      <div className="ml-auto flex items-center gap-x-2 md:gap-x-4">
        {isLoading && <Spinner size="lg" />}

        {!isAuthenticated && !isLoading && (
          <>
            {/* Custom Style: Ghost buttons scale slightly on hover for an interactive feel. */}
            <SignInButton mode="modal">
              <Button
                size="default"
                variant="ghost"
                className="text-base font-medium transition-all duration-150 border border-transparent hover:scale-[1.03]"
              >
                Log in
              </Button>
            </SignInButton>

            {/* Custom Style: Primary button has shadow and scales slightly. */}
            <SignInButton mode="modal">
              <Button
                size="default"
                className="hidden sm:inline-flex text-base font-medium transition-all duration-150 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                Get Jottr Free
              </Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            {/* Custom Style: Ghost button scales slightly on hover for an interactive feel. */}
            <Button size="default" variant="ghost" asChild>
              <Link href="/documents" className="text-base font-medium transition-all duration-150 border border-transparent hover:scale-[1.03]">
                Enter Jottr
              </Link>
            </Button>

            {/* User Profile Menu */}
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;