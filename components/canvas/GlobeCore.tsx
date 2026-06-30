"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SafeCanvas } from "@/components/canvas/SafeCanvas";

const EARTH_MAP =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NORMAL =
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_SPECULAR =
  "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg";

function EarthMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorMap, normalMap, specularMap] = useTexture([
    EARTH_MAP,
    EARTH_NORMAL,
    EARTH_SPECULAR,
  ]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.92, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new THREE.Color("#333333")}
          shininess={12}
        />
      </mesh>

      <mesh scale={1.1}>
        <sphereGeometry args={[0.92, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-3, -1, -2]} intensity={0.25} color="#8b5cf6" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#22d3ee" />
      <EarthMesh />
    </>
  );
}

function GlobeFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full">
      <div
        className="absolute inset-0 animate-[spin_24s_linear_infinite] rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${EARTH_MAP})` }}
      />
      <div className="absolute inset-0 rounded-full shadow-[inset_-8px_-4px_16px_rgba(0,0,0,0.55)]" />
      <div className="absolute inset-0 rounded-full ring-1 ring-cyan-400/25" />
    </div>
  );
}

interface GlobeCoreProps {
  className?: string;
}

export function GlobeCore({ className }: GlobeCoreProps) {
  return (
    <SafeCanvas
      className={className}
      fallback={<GlobeFallback />}
      camera={{ position: [0, 0.15, 2.65], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <GlobeScene />
    </SafeCanvas>
  );
}
