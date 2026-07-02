"use client";

import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { SafeCanvas } from "@/components/canvas/SafeCanvas";
import { markHeroBlobReady } from "@/lib/hero-blob-ready";

interface HeroCursorState {
  x: number;
  y: number;
  active: boolean;
}

interface SceneProps {
  scrollRef: RefObject<number>;
  cursorRef: RefObject<HeroCursorState>;
  quality: "high" | "low";
}

function DistortBlob({
  scrollRef,
  cursorRef,
  quality,
}: {
  scrollRef: RefObject<number>;
  cursorRef: RefObject<HeroCursorState>;
  quality: "high" | "low";
}) {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const cursor = cursorRef.current;
    const targetX = cursor.active ? cursor.x : 0;
    const targetY = cursor.active ? cursor.y : 0;
    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, targetX, 0.07);
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, targetY, 0.07);

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      t * 0.12 + smooth.current.y * 0.2,
      0.05
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      t * 0.18 + smooth.current.x * 0.2,
      0.05
    );
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      0.6 + smooth.current.x * 0.55,
      0.07
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      0.1 + smooth.current.y * 0.4 + scrollRef.current * -2,
      0.08
    );
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={ref} scale={2.4} position={[0.6, 0.1, 0]}>
        <icosahedronGeometry args={[1, quality === "high" ? 20 : 12]} />
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

function CursorParticles({
  count,
  cursorRef,
}: {
  count: number;
  cursorRef: RefObject<HeroCursorState>;
}) {
  const ref = useRef<THREE.Points>(null);
  const smooth = useRef({ x: 0, y: 0 });

  const base = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    const cursor = cursorRef.current;
    const targetX = cursor.active ? cursor.x * 2 : 0;
    const targetY = cursor.active ? cursor.y * 2 : 0;
    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, targetX, 0.06);
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, targetY, 0.06);

    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += (smooth.current.x * 0.02 - arr[i3] * 0.01) * 0.15;
      arr[i3 + 1] += (smooth.current.y * 0.02 - arr[i3 + 1] * 0.01) * 0.15;
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

function BlobReadyNotifier() {
  const reported = useRef(false);

  useFrame(() => {
    if (reported.current) return;
    reported.current = true;
    markHeroBlobReady();
  });

  return null;
}

function SceneContent({ scrollRef, cursorRef, quality }: SceneProps) {
  const particleCount = quality === "high" ? 140 : 60;
  const starCount = quality === "high" ? 400 : 120;

  return (
    <>
      <color attach="background" args={["#080808"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#c4b5fd" />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[2, 1, 4]} intensity={1.5} color="#a78bfa" />
      <Stars radius={50} depth={30} count={starCount} factor={2} saturation={0} fade speed={0.3} />
      <DistortBlob scrollRef={scrollRef} cursorRef={cursorRef} quality={quality} />
      <CursorParticles count={particleCount} cursorRef={cursorRef} />
      <BlobReadyNotifier />
    </>
  );
}

export function HeroBlobFallback({
  cursorRef,
  mobile = false,
}: {
  cursorRef?: RefObject<HeroCursorState>;
  mobile?: boolean;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!cursorRef) return;
    const group = groupRef.current;
    if (!group) return;

    let frame = 0;
    const tick = () => {
      const cursor = cursorRef.current;
      const targetX = cursor.active ? cursor.x : 0;
      const targetY = cursor.active ? cursor.y : 0;
      smooth.current.x += (targetX - smooth.current.x) * 0.08;
      smooth.current.y += (targetY - smooth.current.y) * 0.08;
      const px = smooth.current.x * 56;
      const py = smooth.current.y * 40;
      group.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cursorRef]);

  const corePos = mobile ? "left-1/2 top-[30%]" : "left-[58%] top-[38%]";
  const coreSize = mobile ? "h-[52vmin] w-[52vmin]" : "h-[42vmin] w-[42vmin]";
  const glowPos = mobile ? "left-1/2 top-[30%]" : "left-[58%] top-[38%]";
  const glowSize = mobile ? "h-[68vmin] w-[68vmin]" : "h-[55vmin] w-[55vmin]";
  const accentPos = mobile ? "left-1/2 top-[34%]" : "left-[52%] top-[42%]";
  const accentSize = mobile ? "h-[36vmin] w-[36vmin]" : "h-[28vmin] w-[28vmin]";

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div ref={groupRef} className="absolute inset-0 will-change-transform">
        <div className={`hero-blob-core absolute ${corePos} ${coreSize}`}>
          <div
            className={
              mobile
                ? "hero-blob-sphere h-full w-full rounded-full bg-gradient-to-br from-violet-400/70 via-purple-500/50 to-indigo-800/30 shadow-[0_0_100px_rgba(139,92,246,0.65)]"
                : "hero-blob-sphere h-full w-full rounded-full bg-gradient-to-br from-violet-500/55 via-purple-600/35 to-indigo-900/25 shadow-[0_0_80px_rgba(139,92,246,0.45)]"
            }
          />
        </div>
        <div className={`absolute ${glowPos} ${glowSize} -translate-x-1/2 -translate-y-1/2`}>
          <div
            className={`h-full w-full animate-[blob-glow_5s_ease-in-out_infinite] rounded-full blur-[90px] ${mobile ? "bg-violet-500/45" : "bg-violet-600/30"}`}
          />
        </div>
        <div className={`absolute ${accentPos} ${accentSize} -translate-x-1/2 -translate-y-1/2`}>
          <div
            className={`h-full w-full animate-[blob-glow_7s_ease-in-out_infinite_0.8s] rounded-full blur-[50px] ${mobile ? "bg-violet-300/35" : "bg-violet-400/20"}`}
          />
        </div>
      </div>
      {!mobile && (
        <div className="absolute right-1/4 top-1/2 h-[30vmin] w-[30vmin] -translate-y-1/2">
          <div className="h-full w-full animate-[blob-glow_6s_ease-in-out_infinite_1.2s] rounded-full bg-blue-600/15 blur-[80px]" />
        </div>
      )}
    </div>
  );
}

export function HeroBlobScene({
  scrollRef,
  cursorRef,
  quality,
  onCanvasFailed,
}: {
  scrollRef: RefObject<number>;
  cursorRef: RefObject<HeroCursorState>;
  quality: "high" | "low";
  onCanvasFailed?: () => void;
}) {
  return (
    <SafeCanvas
      className="absolute inset-0 [&_canvas]:pointer-events-none"
      fallback={null}
      priority="hero"
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={quality === "high" ? [1, 1.15] : [1, 1]}
      frameloop="always"
      onCreated={(state) => {
        const context = state.gl.getContext();
        if (!context || context.isContextLost()) {
          onCanvasFailed?.();
        }
      }}
    >
      <SceneContent scrollRef={scrollRef} cursorRef={cursorRef} quality={quality} />
    </SafeCanvas>
  );
}
