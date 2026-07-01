"use client";

import { Html, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { memo, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { SafeCanvas } from "@/components/canvas/SafeCanvas";
import type { Skill } from "@/constants/skills";
import { getSkillIconColor } from "@/constants/skills";
import { cn } from "@/lib/utils";

const EARTH_MAP =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NORMAL =
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_SPECULAR =
  "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg";

const GLOBE_RADIUS = 1;
const ORBIT_RADIUS = 1.45;
const ORBIT_TILT = 0.28;
const BASE_ORBIT_SPEED = 0.2;

const _worldPos = new THREE.Vector3();
const _earthCenter = new THREE.Vector3();
const _toPin = new THREE.Vector3();
const _toCamera = new THREE.Vector3();

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
  const angle = useRef({ value: (index / Math.max(total, 1)) * Math.PI * 2 });
  const scale = useRef({ value: 1 });
  const lastOpacity = useRef(1);
  const Icon = skill.icon;
  const iconColor = getSkillIconColor(skill.color);
  const [hovered, setHovered] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const lit = active || hovered;

  useEffect(() => {
    const target = (index / Math.max(total, 1)) * Math.PI * 2;
    gsap.to(angle.current, {
      value: target,
      duration: 0.75,
      ease: "power2.inOut",
      overwrite: true,
    });
  }, [index, total]);

  useEffect(() => {
    scale.current.value = 0;
    gsap.to(scale.current, {
      value: 1,
      duration: 0.5,
      delay: index * 0.04,
      ease: "back.out(1.6)",
      overwrite: true,
    });
  }, [skill.name, index]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const a = angle.current.value;
    groupRef.current.position.set(
      Math.cos(a) * ORBIT_RADIUS,
      0,
      Math.sin(a) * ORBIT_RADIUS
    );
    groupRef.current.scale.setScalar(scale.current.value);

    groupRef.current.getWorldPosition(_worldPos);
    earthRef.current?.getWorldPosition(_earthCenter);

    _toPin.copy(_worldPos).sub(_earthCenter);
    _toCamera.copy(state.camera.position).sub(_earthCenter);
    const facing = _toPin.dot(_toCamera);
    const next = THREE.MathUtils.clamp((facing + 0.02) / 0.35, 0, 1);

    if (Math.abs(lastOpacity.current - next) > 0.03) {
      lastOpacity.current = next;
      setOpacity(next);
    }
  });

  const show = opacity > 0.08;

  return (
    <group ref={groupRef}>
      <Html
        center
        distanceFactor={9}
        zIndexRange={[lit ? 50 : 20, 0]}
        style={{
          pointerEvents: show ? "auto" : "none",
          opacity,
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

function EarthMesh() {
  const [colorMap, normalMap, specularMap] = useTexture([
    EARTH_MAP,
    EARTH_NORMAL,
    EARTH_SPECULAR,
  ]);

  return (
    <group>
      <mesh renderOrder={2}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new THREE.Color("#555555")}
          shininess={20}
        />
      </mesh>

      <mesh scale={1.07}>
        <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#93c5fd"
          transparent
          opacity={0.11}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function GlobeContent({
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
      { value: BASE_ORBIT_SPEED * 2.4 },
      { value: BASE_ORBIT_SPEED, duration: 1.1, ease: "power3.out", overwrite: true }
    );
    gsap.fromTo(
      earthScale.current,
      { value: 0.88 },
      { value: 1, duration: 0.7, ease: "back.out(1.4)", overwrite: true }
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
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 3, 6]} intensity={1.65} color="#ffffff" />
      <directionalLight position={[-4, -1, -4]} intensity={0.3} color="#ddd6fe" />
      <pointLight position={[0, 0, 4]} intensity={0.45} color="#bfdbfe" />

      <group ref={earthRef}>
        <EarthMesh />
      </group>

      <group ref={orbitRef} rotation={[ORBIT_TILT, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ORBIT_RADIUS, 0.004, 8, 128]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.18} />
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
    </group>
  );
}

export function GlobeFallback({ skills, transitionKey }: { skills: Skill[]; transitionKey: string }) {
  const orbitSkills = skills.slice(0, 10);
  const orbitRadius = 76;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        key={transitionKey}
        className="relative z-10 h-28 w-28 animate-[globe-pop_0.7s_ease-out] rounded-full bg-cover bg-center shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        style={{ backgroundImage: `url(${EARTH_MAP})` }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[152px] w-[152px] rounded-full border border-sky-400/20" />
        <div
          key={`${transitionKey}-orbit`}
          className="absolute h-[152px] w-[152px] animate-[spin_22s_linear_infinite]"
        >
          {orbitSkills.map((skill, i) => {
            const Icon = skill.icon;
            const iconColor = getSkillIconColor(skill.color);
            const deg = (i / orbitSkills.length) * 360;
            return (
              <div
                key={skill.name}
                className="absolute left-1/2 top-1/2 origin-center"
                style={{ transform: `rotate(${deg}deg) translateY(-${orbitRadius}px)` }}
              >
                <div className="animate-[spin_22s_linear_infinite_reverse]">
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full border border-black/10 bg-white shadow-md animate-[orbit-pin-in_0.5s_ease-out_both]"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <Icon size={8} style={{ color: iconColor }} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
    <SafeCanvas
      className={className}
      fallback={<GlobeFallback skills={stableSkills} transitionKey={transitionKey} />}
      camera={{ position: [0, 0, 3.2], fov: 46 }}
      dpr={[1, 1.25]}
      frameloop="always"
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <GlobeContent
        skills={stableSkills}
        highlighted={highlighted}
        transitionKey={transitionKey}
        onHover={handleHover}
      />
    </SafeCanvas>
  );
}
