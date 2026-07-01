"use client";

import { Html, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { memo, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { SafeCanvas } from "@/components/canvas/SafeCanvas";
import type { Skill } from "@/constants/skills";
import { getSkillIconColor } from "@/constants/skills";
import { EARTH_MAP } from "@/constants/images";
import { cn } from "@/lib/utils";

const GLOBE_RADIUS = 1;
const ORBIT_RADIUS = 1.45;
const ORBIT_TILT = 0.28;
const BASE_ORBIT_SPEED = 0.2;

const EARTH_GEOMETRY = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
const ATMOSPHERE_GEOMETRY = new THREE.SphereGeometry(GLOBE_RADIUS, 24, 24);
const ORBIT_GEOMETRY = new THREE.TorusGeometry(ORBIT_RADIUS, 0.004, 6, 64);

const _worldPos = new THREE.Vector3();
const _earthCenter = new THREE.Vector3();
const _toPin = new THREE.Vector3();
const _toCamera = new THREE.Vector3();

function getOrbitAngle(index: number, total: number) {
  return (index / Math.max(total, 1)) * Math.PI * 2;
}

const OrbitSkillPin = memo(function OrbitSkillPin({
  skill,
  index,
  total,
  active,
  earthRef,
  onHover,
}: {
  skill: Skill;
  index: number;
  total: number;
  active: boolean;
  earthRef: RefObject<THREE.Group | null>;
  onHover: (name: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scale = useRef({ value: 1 });
  const lastBehind = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [behind, setBehind] = useState(false);
  const Icon = skill.icon;
  const iconColor = getSkillIconColor(skill.color);
  const lit = active || hovered;
  const angle = getOrbitAngle(index, total);

  useEffect(() => {
    scale.current.value = 0;
    gsap.to(scale.current, {
      value: 1,
      duration: 0.45,
      delay: index * 0.03,
      ease: "back.out(1.5)",
      overwrite: true,
    });
  }, [skill.name, index]);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.scale.setScalar(scale.current.value);

    groupRef.current.getWorldPosition(_worldPos);
    earthRef.current?.getWorldPosition(_earthCenter);
    _toPin.copy(_worldPos).sub(_earthCenter);
    _toCamera.copy(state.camera.position).sub(_earthCenter);
    const isBehind = _toPin.dot(_toCamera) < 0.05;

    if (lastBehind.current !== isBehind) {
      lastBehind.current = isBehind;
      setBehind(isBehind);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[
        Math.cos(angle) * ORBIT_RADIUS,
        0,
        Math.sin(angle) * ORBIT_RADIUS,
      ]}
    >
      <Html
        center
        distanceFactor={9}
        zIndexRange={[lit ? 40 : 10, 0]}
        style={{
          opacity: behind ? 0 : 1,
          pointerEvents: behind ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <button
          type="button"
          className={cn(
            "flex items-center justify-center rounded-full border border-black/10 bg-white transition-all duration-300",
            lit ? "h-5 w-5" : "h-4 w-4"
          )}
          style={{
            boxShadow: lit
              ? `0 4px 14px rgba(0,0,0,0.28), 0 0 0 1.5px ${skill.color}66`
              : "0 2px 8px rgba(0,0,0,0.22)",
          }}
          onMouseEnter={() => {
            setHovered(true);
            onHover(skill.name);
          }}
          onMouseLeave={() => {
            setHovered(false);
            onHover(null);
          }}
          aria-label={skill.name}
        >
          <Icon size={lit ? 9 : 8} style={{ color: iconColor }} />
        </button>
      </Html>
    </group>
  );
});

const EarthMesh = memo(function EarthMesh() {
  const colorMap = useTexture(EARTH_MAP);

  return (
    <group>
      <mesh geometry={EARTH_GEOMETRY} renderOrder={10}>
        <meshPhongMaterial map={colorMap} shininess={12} specular="#333333" />
      </mesh>
      <mesh geometry={ATMOSPHERE_GEOMETRY} scale={1.06} renderOrder={9}>
        <meshBasicMaterial
          color="#93c5fd"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

function GlobeRig({
  skills,
  highlighted,
  transitionKey,
  onHover,
}: {
  skills: Skill[];
  highlighted: string | null;
  transitionKey: string;
  onHover: (name: string | null) => void;
}) {
  const earthRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const orbitSpeed = useRef({ value: BASE_ORBIT_SPEED });
  const earthScale = useRef({ value: 1 });

  useEffect(() => {
    gsap.fromTo(
      orbitSpeed.current,
      { value: BASE_ORBIT_SPEED * 2 },
      { value: BASE_ORBIT_SPEED, duration: 0.9, ease: "power3.out", overwrite: true }
    );
    gsap.fromTo(
      earthScale.current,
      { value: 0.9 },
      { value: 1, duration: 0.55, ease: "back.out(1.3)", overwrite: true }
    );
  }, [transitionKey]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.13;
      earthRef.current.scale.setScalar(earthScale.current.value);
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * orbitSpeed.current.value;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 3, 6]} intensity={1.5} />
      <directionalLight position={[-4, -1, -4]} intensity={0.25} color="#ddd6fe" />

      <group ref={orbitRef} rotation={[ORBIT_TILT, 0, 0]}>
        <mesh geometry={ORBIT_GEOMETRY} rotation={[Math.PI / 2, 0, 0]} renderOrder={0}>
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.16} depthWrite={false} />
        </mesh>

        {skills.map((skill, i) => (
          <OrbitSkillPin
            key={skill.name}
            skill={skill}
            index={i}
            total={skills.length}
            active={highlighted === skill.name}
            earthRef={earthRef}
            onHover={onHover}
          />
        ))}
      </group>

      <group ref={earthRef}>
        <EarthMesh />
      </group>
    </group>
  );
}

export function GlobeFallback({ skills, transitionKey }: { skills: Skill[]; transitionKey: string }) {
  const orbitRadius = 76;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="pointer-events-none absolute h-[152px] w-[152px] rounded-full border border-sky-400/20" />
      <div
        key={`${transitionKey}-orbit`}
        className="absolute z-0 h-[152px] w-[152px] animate-[spin_22s_linear_infinite]"
      >
        {skills.map((skill, i) => {
          const Icon = skill.icon;
          const iconColor = getSkillIconColor(skill.color);
          const deg = (i / Math.max(skills.length, 1)) * 360;

          return (
            <div
              key={skill.name}
              className="absolute left-1/2 top-1/2 origin-center"
              style={{ transform: `rotate(${deg}deg) translateY(-${orbitRadius}px)` }}
            >
              <div className="animate-[spin_22s_linear_infinite_reverse]">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-black/10 bg-white shadow-md animate-[orbit-pin-in_0.5s_ease-out_both]"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <Icon size={9} style={{ color: iconColor }} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        key={transitionKey}
        className="relative z-10 h-28 w-28 animate-[globe-pop_0.7s_ease-out] rounded-full bg-cover bg-center shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-black/30"
        style={{ backgroundImage: `url(${EARTH_MAP})` }}
      />
    </div>
  );
}

interface SkillGlobeSceneProps {
  skills: Skill[];
  highlighted?: string | null;
  transitionKey?: string;
  onHover?: (name: string | null) => void;
  className?: string;
}

export function SkillGlobeScene({
  skills,
  highlighted = null,
  transitionKey = "all",
  onHover,
  className,
}: SkillGlobeSceneProps) {
  const handleHover = onHover ?? (() => {});
  const stableSkills = useMemo(() => skills, [skills]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <SafeCanvas
        className="h-full w-full"
        fallback={
          <GlobeFallback skills={stableSkills} transitionKey={transitionKey} />
        }
        camera={{ position: [0, 0, 3.2], fov: 46 }}
        dpr={[1, 1.15]}
        frameloop="always"
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent" }}
      >
        <GlobeRig
          skills={stableSkills}
          highlighted={highlighted}
          transitionKey={transitionKey}
          onHover={handleHover}
        />
      </SafeCanvas>
    </div>
  );
}
