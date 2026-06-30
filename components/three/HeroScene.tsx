"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function FloatingCode({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshPhysicalMaterial
          color="#3B82F6"
          metalness={0.9}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function GlassOrb({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere args={[0.4, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function Particles({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#22D3EE" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.3, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.2 + 0.5, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function HeroSceneContent() {
  return (
    <>
      <color attach="background" args={["#080808"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#3B82F6" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#8B5CF6" />
      <spotLight position={[0, 8, 0]} intensity={0.8} angle={0.3} penumbra={1} color="#22D3EE" />

      <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />

      <FloatingCode position={[-2, 1, -1]} />
      <FloatingCode position={[2.5, -0.5, -2]} />
      <FloatingCode position={[0, 2, -3]} />
      <FloatingCode position={[-3, -1.5, -1.5]} />

      <GlassOrb position={[1.5, 1.5, -1]} color="#3B82F6" />
      <GlassOrb position={[-1.5, -1, -2]} color="#8B5CF6" />
      <GlassOrb position={[0, -2, -1]} color="#22D3EE" />

      <Particles count={150} />
      <CameraController />
    </>
  );
}

export function HeroScene() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-[#050505] to-[#050505]" />
    );
  }

  return (
    <div className="absolute inset-0 [&_canvas]:pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <HeroSceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
