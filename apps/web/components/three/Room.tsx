"use client";

import React from "react";

export function Room() {
  return (
    <group position={[0, -1, 0]}>
      {/* Floor */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[8, 0.1, 8]} />
        <meshStandardMaterial color="#1c1c1a" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh receiveShadow position={[0, 2, -4]}>
        <boxGeometry args={[8, 4, 0.1]} />
        <meshStandardMaterial color="#eeedec" roughness={0.9} />
      </mesh>

      {/* Left Wall */}
      <mesh receiveShadow position={[-4, 2, 0]}>
        <boxGeometry args={[0.1, 4, 8]} />
        <meshStandardMaterial color="#f2f1f0" roughness={0.9} />
      </mesh>

      {/* Right Wall (partial for open view) */}
      <mesh receiveShadow position={[4, 2, -2]}>
        <boxGeometry args={[0.1, 4, 4]} />
        <meshStandardMaterial color="#f2f1f0" roughness={0.9} />
      </mesh>

      {/* Bed Base (Elderly Room Furniture) */}
      <mesh position={[-2.2, 0.3, -2.5]}>
        <boxGeometry args={[2.2, 0.6, 2.6]} />
        <meshStandardMaterial color="#504933" roughness={0.7} />
      </mesh>

      {/* Mattress & Warm Duvet */}
      <mesh position={[-2.2, 0.7, -2.5]}>
        <boxGeometry args={[2.0, 0.25, 2.4]} />
        <meshStandardMaterial color="#cfcab8" roughness={0.95} />
      </mesh>

      {/* Pillow */}
      <mesh position={[-2.2, 0.9, -3.2]}>
        <boxGeometry args={[1.2, 0.15, 0.6]} />
        <meshStandardMaterial color="#f8f7f4" roughness={0.9} />
      </mesh>

      {/* Nightstand */}
      <mesh position={[-0.8, 0.35, -3.2]}>
        <boxGeometry args={[0.6, 0.7, 0.6]} />
        <meshStandardMaterial color="#87702a" roughness={0.6} />
      </mesh>

      {/* Warm Lamp on Nightstand */}
      <mesh position={[-0.8, 0.8, -3.2]}>
        <cylinderGeometry args={[0.15, 0.22, 0.3, 16]} />
        <meshStandardMaterial color="#fdf6e2" emissive="#fdf6e2" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[-0.8, 0.9, -3.2]} intensity={2.5} color="#ffe8bd" distance={4} />

      {/* Soft Rug */}
      <mesh position={[0.5, 0.01, 0.5]}>
        <boxGeometry args={[3.2, 0.02, 2.5]} />
        <meshStandardMaterial color="#353430" roughness={0.9} />
      </mesh>
    </group>
  );
}
