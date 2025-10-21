"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { isValidElement } from "react";

interface IconPickerProps {
  onchange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

function IconPicker({ onchange, children, asChild }: IconPickerProps) {
  const { resolvedTheme } = useTheme();

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  const currentTheme =
    (resolvedTheme && themeMap[resolvedTheme as keyof typeof themeMap]) ||
    Theme.LIGHT;

  if (!isValidElement(children)) {
    console.error("IconPicker expects a single valid React element as a child.");
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-[400px] border-none shadow-lg">
        <EmojiPicker
          height={500}
          width={400}
          theme={currentTheme}
          onEmojiClick={(data) => onchange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default IconPicker;
