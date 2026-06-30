"use client";

import { Html, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SafeCanvas } from "@/components/canvas/SafeCanvas";
import { SkillOrbitFallback } from "@/components/canvas/SkillOrbitFallback";
import type { Skill } from "@/constants/skills";

const CAMERA_DISTANCE = 7.2;
const ICON_DISTANCE_FACTOR = 9;

function getOrbitLayout(count: number) {
  const radiusX = 2.15 + count * 0.11;
  const radiusZ = 0.55 + count * 0.04;

  const positions = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return [
      Math.cos(angle) * radiusX,
      0,
      Math.sin(angle) * radiusZ,
    ] as [number, number, number];
  });

  return { positions, radiusX, radiusZ };
}

function SkillOrb({
  skill,
  target,
  index,
  highlighted,
  onHover,
}: {
  skill: Skill;
  target: [number, number, number];
  index: number;
  highlighted: boolean;
  onHover: (name: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const position = useRef(new THREE.Vector3(...target));
  const [hovered, setHovered] = useState(false);
  const active = highlighted || hovered;
  const Icon = skill.icon;

  useEffect(() => {
    position.current.set(...target);
  }, [target]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const goal = new THREE.Vector3(...target);
    position.current.lerp(goal, 0.08);
    groupRef.current.position.copy(position.current);
    groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.1 + index) * 0.05;

    const dist = state.camera.position.distanceTo(groupRef.current.position);
    const depthComp = dist / CAMERA_DISTANCE;
    const hoverScale = active ? 1.1 : 1;
    groupRef.current.scale.setScalar(depthComp * hoverScale);
  });

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(skill.name);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <sphereGeometry args={[0.36, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={active ? 0.28 : 0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <Html
        center
        distanceFactor={ICON_DISTANCE_FACTOR}
        style={{ pointerEvents: "none" }}
        zIndexRange={[80, 0]}
      >
        <div className="flex flex-col items-center gap-1">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border bg-[#0a0a0a]/92 backdrop-blur-md"
            style={{
              borderColor: active ? `${skill.color}80` : "rgba(255,255,255,0.1)",
              boxShadow: active ? `0 0 18px ${skill.color}44` : "0 2px 12px rgba(0,0,0,0.35)",
              backgroundColor: `${skill.color}${active ? "1a" : "0d"}`,
            }}
          >
            <Icon size={16} style={{ color: skill.color }} />
          </div>
          {active && (
            <span className="whitespace-nowrap rounded border border-white/10 bg-black/85 px-1.5 py-px text-[9px] font-medium text-white">
              {skill.name}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

function OrbitScene({
  skills,
  highlighted,
  onHover,
}: {
  skills: Skill[];
  highlighted: string | null;
  onHover: (name: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const layout = useMemo(() => getOrbitLayout(skills.length), [skills.length]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      coreRef.current.rotation.z = state.clock.elapsedTime * 0.14;
    }
  });

  return (
    <>
      <color attach="background" args={["#080808"]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={1.1} color="#8b5cf6" />
      <pointLight position={[-4, -2, 2]} intensity={0.55} color="#22d3ee" />
      <Stars radius={40} depth={25} count={100} factor={2} saturation={0} fade speed={0.35} />

      <group ref={groupRef} position={[0, -0.15, 0]}>
        {skills.map((skill, i) => (
          <SkillOrb
            key={skill.name}
            skill={skill}
            target={layout.positions[i]}
            index={i}
            highlighted={highlighted === skill.name}
            onHover={onHover}
          />
        ))}

        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.22, 1]} />
          <meshPhysicalMaterial
            color="#22d3ee"
            metalness={0.9}
            roughness={0.12}
            emissive="#22d3ee"
            emissiveIntensity={0.4}
            transparent
            opacity={0.9}
          />
        </mesh>

        <group scale={[1, 1, layout.radiusZ / layout.radiusX]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[layout.radiusX, 0.008, 8, 96]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
          </mesh>
        </group>
      </group>
    </>
  );
}

interface SkillOrbitSceneProps {
  skills: Skill[];
  highlighted?: string | null;
  onHover?: (name: string | null) => void;
  className?: string;
}

export function SkillOrbitScene({
  skills,
  highlighted = null,
  onHover,
  className,
}: SkillOrbitSceneProps) {
  const handleHover = onHover ?? (() => {});

  return (
    <SafeCanvas
      className={className}
      fallback={<SkillOrbitFallback skills={skills} />}
      camera={{ position: [0, 0.4, CAMERA_DISTANCE], fov: 42 }}
      dpr={[1, 1.25]}
      frameloop="always"
    >
      <OrbitScene skills={skills} highlighted={highlighted} onHover={handleHover} />
    </SafeCanvas>
  );
}

export { SkillOrbitFallback } from "@/components/canvas/SkillOrbitFallback";
