"use client";

import { memo } from "react";

export const ProjectsAmbientFallback = memo(function ProjectsAmbientFallback() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/4 -left-1/4 h-[55%] w-[45%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.14),transparent_70%)] blur-2xl" />
      <div className="absolute top-1/3 -right-1/4 h-[50%] w-[40%] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1),transparent_70%)] blur-2xl" />
    </div>
  );
});
