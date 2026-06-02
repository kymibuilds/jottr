"use client";
import { useTheme } from "next-themes";
import React from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  preview?: boolean;
}

function Editor({ onChange, editable = true, initialContent, preview = false }: EditorProps) {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  
  const parsedContent: PartialBlock[] | undefined = React.useMemo(
    () =>
      initialContent
        ? (JSON.parse(initialContent) as PartialBlock[])
        : undefined,
    [initialContent]
  );

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file
    });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: parsedContent,
    uploadFile: handleUpload,
  });

  React.useEffect(() => {
    if (preview) return; // Don't track changes in preview mode
    
    const handleChange = () => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    };
    const unsubscribe = editor.onChange(handleChange);
    return unsubscribe;
  }, [editor, onChange, preview]);

  return (
    <div className="w-full h-full">
      <BlockNoteView
        editor={editor}
        editable={preview ? false : editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}

export default Editor;