"use client";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";

function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <div
      className="
        max-w-4xl min-h-screen pt-40 md:pt-48 pb-10 
        flex flex-col items-center text-center space-y-8
      "
    >
      {/* Module 1: YC Badge - Now with Glassmorphism effect */}
      <div className="inline-flex items-center gap-2 text-sm md:text-base text-foreground/70 px-4 rounded-full py-2 border border-border transition-all duration-300
        bg-background/60 backdrop-blur-sm"> {/* Added glassmorphism classes */}
        <span>Not Backed by</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-orange-500 rounded font-bold text-white">
            Y
          </span>
          <span className="text-orange-500 font-semibold">Combinator</span>
        </span>
      </div>

      {/* Module 2: Main Heading - Gradient reverted to original (more contrast) */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-3xl">
        <span className="bg-gradient-to-b from-foreground to-neutral-500 dark:to-neutral-400 bg-clip-text text-transparent"> 
          The simplest place to jot your thoughts.
        </span>
      </h1>

      {/* Module 3: Subheading */}
      <p className="text-lg md:text-xl font-normal text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Capture, organize, and recall your thoughts instantly. Simple, fast note-taking that fits seamlessly into your digital life.
      </p>

      {/* Module 4: CTA Buttons */}
      <div className="pt-8">
        {isLoading ? (
          <Button
            disabled
            size="lg"
            className="rounded-xl px-10 text-lg font-medium transition-all duration-150 shadow-md"
          >
            <Spinner size="lg" className="mr-2" />
            Loading Jottr...
          </Button>
        ) : isAuthenticated ? (
          <Button
            onClick={() => router.push("/documents")}
            size="lg"
            // Applying custom primary button styles
            className="group rounded-xl px-10 text-lg font-medium transition-all duration-150 shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            Enter Workspace
            <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button
              size="lg"
              // Applying custom primary button styles
              className="group rounded-xl px-10 text-lg font-medium transition-all duration-150 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              Get Jottr Free
              <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

export default Heading;