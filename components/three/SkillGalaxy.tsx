"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { SKILLS } from "@/constants/skills";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function SkillOrb({
  skill,
  position,
  index,
}: {
  skill: (typeof SKILLS)[0];
  position: [number, number, number];
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.15;
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.3 : 1}
    >
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshPhysicalMaterial
        color={skill.color}
        metalness={0.8}
        roughness={0.2}
        emissive={skill.color}
        emissiveIntensity={hovered ? 0.5 : 0.1}
        transparent
        opacity={0.85}
      />
      {hovered && (
        <Html center distanceFactor={6}>
          <div className="whitespace-nowrap rounded-lg border border-white/20 bg-black/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {skill.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function GalaxyContent() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const radius = 3;
  const skillsToShow = SKILLS.slice(0, 10);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#3B82F6" />
      <pointLight position={[0, -5, -5]} intensity={0.5} color="#8B5CF6" />

      {skillsToShow.map((skill, i) => {
        const angle = (i / skillsToShow.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.8) * 0.5;

        return (
          <SkillOrb
            key={skill.name}
            skill={skill}
            position={[x, y, z]}
            index={i}
          />
        );
      })}

      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color="#22D3EE"
          metalness={0.9}
          roughness={0.1}
          emissive="#22D3EE"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

export function SkillGalaxy() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="flex h-full items-center justify-center bg-surface">
        <p className="font-mono text-xs text-muted">3D preview</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden [&_canvas]:pointer-events-none">
      <Canvas camera={{ position: [0, 2, 7], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <GalaxyContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
