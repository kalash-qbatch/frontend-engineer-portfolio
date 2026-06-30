"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Suspense, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { WebGLRenderer } from "three";
import {
  acquireWebGLContext,
  registerWebGLEviction,
  releaseWebGLContext,
  unregisterWebGLEviction,
} from "@/lib/webgl";

interface SafeCanvasProps extends CanvasProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  priority?: "hero" | "default";
}

export function SafeCanvas({
  children,
  fallback = null,
  className,
  priority = "default",
  gl,
  onCreated,
  ...props
}: SafeCanvasProps) {
  const ownerId = useId();
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const lostHandlerRef = useRef<((event: Event) => void) | null>(null);
  const [failed, setFailed] = useState(false);
  const [canRender, setCanRender] = useState(false);

  useLayoutEffect(() => {
    if (failed) return;

    const evict = () => {
      setFailed(true);
      setCanRender(false);
    };

    registerWebGLEviction(ownerId, evict);

    const acquired = acquireWebGLContext(ownerId, priority);
    if (!acquired) {
      setFailed(true);
      unregisterWebGLEviction(ownerId);
      return;
    }

    setCanRender(true);

    return () => {
      unregisterWebGLEviction(ownerId);

      const renderer = rendererRef.current;
      const canvas = renderer?.domElement;
      const lostHandler = lostHandlerRef.current;

      if (canvas && lostHandler) {
        canvas.removeEventListener("webglcontextlost", lostHandler);
      }

      if (renderer) {
        renderer.forceContextLoss();
        renderer.dispose();
        rendererRef.current = null;
      }

      lostHandlerRef.current = null;
      releaseWebGLContext(ownerId);
      setCanRender(false);
    };
  }, [ownerId, failed, priority]);

  if (failed || !canRender) return <>{fallback}</>;

  return (
    <div className={className}>
      <Canvas
        {...props}
        gl={{
          powerPreference: "default",
          antialias: false,
          alpha: true,
          stencil: false,
          depth: true,
          ...gl,
        }}
        onCreated={(state) => {
          const context = state.gl.getContext();
          if (!context || context.isContextLost()) {
            setFailed(true);
            releaseWebGLContext(ownerId);
            state.gl.dispose();
            return;
          }

          rendererRef.current = state.gl;

          const onCanvasLost = (event: Event) => {
            event.preventDefault();
            setFailed(true);
            releaseWebGLContext(ownerId);
          };

          lostHandlerRef.current = onCanvasLost;
          state.gl.domElement.addEventListener("webglcontextlost", onCanvasLost);

          onCreated?.(state);
        }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
