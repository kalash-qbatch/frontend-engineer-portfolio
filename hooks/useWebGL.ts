"use client";

import { useEffect, useState } from "react";
import { isWebGLAvailable } from "@/lib/webgl";
import { useDeviceCapability } from "./useDeviceCapability";

/** True only when WebGL is available and device can handle 3D */
export function useWebGL() {
  const { prefersSimple3D } = useDeviceCapability();
  const [webglOk, setWebglOk] = useState(false);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  return !prefersSimple3D && webglOk;
}
