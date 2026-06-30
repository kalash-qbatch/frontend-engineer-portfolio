"use client";

import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { SafeCanvas } from "@/components/canvas/SafeCanvas";

interface SceneProps {
  scrollRef: RefObject<number>;
  quality: "high" | "low";
}

function DistortBlob({ scrollRef }: { scrollRef: RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, t * 0.12 + mouse.current.y * 0.25, 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, t * 0.18 + mouse.current.x * 0.25, 0.05);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, 0.6 + mouse.current.x * 0.15, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.1 + scrollRef.current * -2, 0.08);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={ref} scale={2.4} position={[0.6, 0.1, 0]}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#5b21b6"
          emissiveIntensity={0.55}
          metalness={0.85}
          roughness={0.12}
          distort={0.45}
          speed={2}
          transparent
          opacity={0.95}
        />
      </mesh>
    </Float>
  );
}

function CursorParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const base = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 4;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += (mouse.current.x * 0.02 - arr[i3] * 0.01) * 0.15;
      arr[i3 + 1] += (mouse.current.y * 0.02 - arr[i3 + 1] * 0.01) * 0.15;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a78bfa"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent({ scrollRef, quality }: SceneProps) {
  const particleCount = quality === "high" ? 200 : 80;
  const starCount = quality === "high" ? 600 : 200;

  return (
    <>
      <color attach="background" args={["#080808"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#c4b5fd" />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[2, 1, 4]} intensity={1.5} color="#a78bfa" />
      <Stars radius={50} depth={30} count={starCount} factor={2} saturation={0} fade speed={0.3} />
      <DistortBlob scrollRef={scrollRef} />
      <CursorParticles count={particleCount} />
    </>
  );
}

export function HeroBlobFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-blob-core absolute left-[58%] top-[38%] h-[42vmin] w-[42vmin]">
        <div className="hero-blob-sphere h-full w-full rounded-full bg-gradient-to-br from-violet-500/55 via-purple-600/35 to-indigo-900/25 shadow-[0_0_80px_rgba(139,92,246,0.45)]" />
      </div>
      <div className="absolute left-[58%] top-[38%] h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2">
        <div className="h-full w-full animate-[blob-glow_5s_ease-in-out_infinite] rounded-full bg-violet-600/30 blur-[90px]" />
      </div>
      <div className="absolute left-[52%] top-[42%] h-[28vmin] w-[28vmin] -translate-x-1/2 -translate-y-1/2">
        <div className="h-full w-full animate-[blob-glow_7s_ease-in-out_infinite_0.8s] rounded-full bg-violet-400/20 blur-[50px]" />
      </div>
      <div className="absolute right-1/4 top-1/2 h-[30vmin] w-[30vmin] -translate-y-1/2">
        <div className="h-full w-full animate-[blob-glow_6s_ease-in-out_infinite_1.2s] rounded-full bg-blue-600/15 blur-[80px]" />
      </div>
    </div>
  );
}

export function HeroBlobScene({
  scrollRef,
  quality,
}: {
  scrollRef: RefObject<number>;
  quality: "high" | "low";
}) {
  return (
    <SafeCanvas
      className="absolute inset-0 [&_canvas]:pointer-events-none"
      fallback={null}
      priority="hero"
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.25]}
      frameloop="always"
    >
      <SceneContent scrollRef={scrollRef} quality={quality} />
    </SafeCanvas>
  );
}
