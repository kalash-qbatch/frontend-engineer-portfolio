"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function StarField() {
  const ref = useRef<THREE.Points>(null);
  const count = 500;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Nebula() {
  return (
    <>
      <Float speed={0.5} floatIntensity={0.3}>
        <Sphere args={[3, 16, 16]} position={[-4, 2, -8]}>
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.03} />
        </Sphere>
      </Float>
      <Float speed={0.7} floatIntensity={0.4}>
        <Sphere args={[4, 16, 16]} position={[5, -1, -10]}>
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.03} />
        </Sphere>
      </Float>
    </>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <StarField />
      <Nebula />
    </>
  );
}

export function StarBackground() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1]} gl={{ antialias: false }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
