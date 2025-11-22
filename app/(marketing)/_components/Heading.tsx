"use client";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <div
      className="
        max-w-4xl h-screen space-y-6 text-center
        dark:bg-transparent dark:text-inherit pt-40
      "
    >
      {/* YC Badge */}
      <div className="inline-flex items-center gap-2 text-sm md:text-base text-neutral-700 px-4 rounded-full py-2 border-2">
        <span>Not Backed by</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-orange-500 rounded font-bold text-white">
            Y
          </span>
          <span className="text-orange-500 font-semibold">Combinator</span>
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-600 bg-clip-text text-transparent">
        Quick Notes, Whenever Inspiration Strikes
      </h1>

      {/* Subheading */}
      <p className="text-base md:text-xl font-normal text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Never let a great idea slip away again. Capture thoughts instantly as
        you browse. Simple, fast note-taking that fits seamlessly into your
        workflow.
      </p>

      {/* CTA Buttons */}
      <div className="flex justify-center pt-4 gap-4 flex-wrap">
        <Button
          size="lg"
          variant="outline"
          className="rounded-xl px-10 text-lg font-light bg-transparent border-2 border-neutral-800/70 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
        >
          Extension
        </Button>

        {isLoading ? (
          <Button
            disabled
            size="lg"
            className="rounded-xl px-10 text-lg font-light"
          >
            <span className="animate-pulse">Loading...</span>
          </Button>
        ) : isAuthenticated ? (
          <Button
            onClick={() => router.push("/documents")}
            size="lg"
            className="group rounded-xl px-10 text-lg font-light"
          >
            Enter Workspace
            <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="group rounded-xl px-10 text-lg font-light"
            >
              Get Started
              <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

export default Heading;
