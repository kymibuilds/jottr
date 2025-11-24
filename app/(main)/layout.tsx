"use client";

import { useConvexAuth } from "convex/react";
import { redirect, usePathname } from "next/navigation";
import Navigation from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";
import Navbar from "./_components/navbar";
import { MorphingSquare } from "@/components/molecule-ui/morphing-square";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const pathname = usePathname();

  const isPreviewRoute = pathname?.startsWith("/preview/");
  const isMainDocumentsPage = pathname?.endsWith("/documents");

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1F1F1F]">
        <MorphingSquare />
      </div>
    );
  }

  // Allow preview routes without authentication
  if (!isAuthenticated && !isPreviewRoute) {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      {!isPreviewRoute && <Navigation />}
      <main className="flex-1 h-full overflow-y-auto relative">
        {!isPreviewRoute && !isMainDocumentsPage && <Navbar />}
        {!isPreviewRoute && <SearchCommand />}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
