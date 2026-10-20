"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CameraDevice() {
  const ledRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (ledRef.current) {
      // Gentle pulsing green LED indicating edge inference active at 5 FPS
      const intensity = 0.8 + Math.sin(clock.getElapsedTime() * 4) * 0.5;
      ledRef.current.emissiveIntensity = intensity;
    }
  });

  return (
    // Mounted high on the corner/wall overlooking the room
    <group position={[-3.8, 1.8, -3.8]} rotation={[0.4, 0.8, 0]}>
      {/* Wall Mount Bracket */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial color="#504933" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Main ElderSteady Enclosure */}
      <mesh castShadow position={[0, 0, 0.1]}>
        <boxGeometry args={[0.3, 0.2, 0.25]} />
        <meshStandardMaterial color="#1a1a18" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Front Optical Bezel */}
      <mesh position={[0, 0, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.04, 32]} />
        <meshStandardMaterial color="#2d2d2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lens Glass */}
      <mesh position={[0, 0, 0.255]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 32]} />
        <meshStandardMaterial color="#0c121e" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Edge Processing LED (Pulsing Green = SiMa Modalix Edge ML Active) */}
      <mesh position={[0.1, 0.06, 0.23]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial
          ref={ledRef}
          color="#418357"
          emissive="#418357"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Device Ray Field (Subtle wireframe cone indicating local field of view) */}
      <mesh position={[0, 0, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.5, 3.0, 16, 1, true]} />
        <meshBasicMaterial
          color="#418357"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}
