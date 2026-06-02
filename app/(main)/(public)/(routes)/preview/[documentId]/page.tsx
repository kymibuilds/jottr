"use client";
import React from "react";
import { DocumentView } from "@/components/document-view";
import { Id } from "@/convex/_generated/dataModel";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = React.use(params);
  return <DocumentView documentId={documentId} preview />;
};

export default DocumentIdPage;
