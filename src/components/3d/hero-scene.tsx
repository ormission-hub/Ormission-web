"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GraduationCap() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} position={[0, 0, 0]}>
        {/* Cap base (mortarboard) */}
        <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1.8, 0.08, 1.8]} />
          <meshStandardMaterial color="#2563EB" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Cap crown */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.45, 6]} />
          <meshStandardMaterial color="#1D4ED8" roughness={0.5} metalness={0.05} />
        </mesh>

        {/* Button on top */}
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#E9A23B" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Tassel string */}
        <mesh position={[0.6, 0.1, 0.6]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
          <meshStandardMaterial color="#E9A23B" roughness={0.6} />
        </mesh>

        {/* Tassel end */}
        <mesh position={[0.6, -0.2, 0.6]}>
          <cylinderGeometry args={[0.04, 0.01, 0.15, 8]} />
          <meshStandardMaterial color="#E9A23B" roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingBook({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.7, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Spine */}
      <mesh position={[position[0] - 0.27, position[1], position[2]]}>
        <boxGeometry args={[0.04, 0.7, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.5], fov: 40 }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      <pointLight position={[0, 2, 2]} intensity={0.5} color="#DBEAFE" />

      <GraduationCap />

      <FloatingBook position={[-1.8, -0.5, -0.5]} color="#0F766E" />
      <FloatingBook position={[1.6, 0.8, -1]} color="#2563EB" />
      <FloatingBook position={[2, -0.7, 0.3]} color="#64748B" />
    </Canvas>
  );
}
