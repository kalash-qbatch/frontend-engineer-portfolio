"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { SITE } from "@/constants/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function ParticleLogo() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const r = 1.5 + Math.random() * 0.5;
      const x = Math.cos(t) * r + (Math.random() - 0.5) * 0.3;
      const y = Math.sin(t) * r * 0.6 + (Math.random() - 0.5) * 0.3;
      const z = (Math.random() - 0.5) * 0.5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }

    return { positions: pos, originalPositions: orig };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] =
        originalPositions[i3 + 1] +
        Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.05;
    }
    posAttr.needsUpdate = true;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#22D3EE"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function EndingSceneContent() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 3]} intensity={1} color="#3B82F6" />
      <ParticleLogo />
    </>
  );
}

export function EndingScene() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent">
          {SITE.initials}
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto h-[300px] w-full max-w-lg">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <EndingSceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
