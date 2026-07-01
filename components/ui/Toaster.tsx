"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      expand
      closeButton
      richColors
      duration={4500}
      toastOptions={{
        classNames: {
          toast:
            "group !rounded-xl !border !border-border !bg-background/95 !text-foreground !shadow-[0_16px_48px_rgba(0,0,0,0.45)] !backdrop-blur-xl",
          title: "!font-display !text-sm !font-semibold",
          description: "!text-xs !text-muted",
          actionButton: "!bg-foreground !text-background",
          cancelButton: "!bg-surface !text-foreground",
          closeButton: "!border-border !bg-surface !text-muted hover:!text-foreground",
          success: "!border-emerald-500/35",
          error: "!border-red-500/35",
          warning: "!border-amber-500/35",
          info: "!border-accent/35",
          loading: "!border-accent/35",
        },
      }}
    />
  );
}
