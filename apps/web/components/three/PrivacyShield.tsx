"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function PrivacyShield() {
  const shieldRef = useRef<THREE.Mesh>(null);
  const internalParticlesRef = useRef<THREE.Points>(null);
  const escapingDotsRef = useRef<THREE.Points>(null);

  // 1. Internal video pixel particles (stay strictly inside boundary radius R = 2.4)
  const internalCount = 200;
  const [internalPositions, internalVelocities] = useMemo(() => {
    const pos = new Float32Array(internalCount * 3);
    const vel = new Float32Array(internalCount * 3);
    for (let i = 0; i < internalCount; i++) {
      // Start near camera or room center
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = Math.random() * 2 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;

      vel[i * 3] = (Math.random() - 0.5) * 0.03;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
    }
    return [pos, vel];
  }, []);

  // 2. Escaping structured numbers (small green dots representing the 11 KB context)
  const escapeCount = 30;
  const [escapePositions] = useMemo(() => {
    const pos = new Float32Array(escapeCount * 3);
    for (let i = 0; i < escapeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 2.5 + Math.random() * 2.0; // Outside shield
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return [pos];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse shield boundary gently
    if (shieldRef.current) {
      shieldRef.current.rotation.y = t * 0.05;
    }

    // Animate internal video particles bouncing inside shield
    if (internalParticlesRef.current) {
      const geo = internalParticlesRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const p = posAttr.array as Float32Array;

      const radiusLimit = 2.4;
      for (let i = 0; i < internalCount; i++) {
        p[i * 3] += internalVelocities[i * 3];
        p[i * 3 + 1] += internalVelocities[i * 3 + 1];
        p[i * 3 + 2] += internalVelocities[i * 3 + 2];

        // Check distance from origin [0, 0.5, 0]
        const dx = p[i * 3];
        const dy = p[i * 3 + 1] - 0.5;
        const dz = p[i * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // If particle hits boundary, reverse velocity — "video stays in the room"
        if (dist > radiusLimit) {
          internalVelocities[i * 3] *= -1;
          internalVelocities[i * 3 + 1] *= -1;
          internalVelocities[i * 3 + 2] *= -1;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Animate escaping structured 11KB numbers flowing outward
    if (escapingDotsRef.current) {
      const geo = escapingDotsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const p = posAttr.array as Float32Array;

      for (let i = 0; i < escapeCount; i++) {
        p[i * 3 + 1] += 0.01; // float upward
        if (p[i * 3 + 1] > 4.5) {
          p[i * 3 + 1] = 0.5; // recycle
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      {/* Semi-transparent Physical Privacy Shield Enclosure */}
      <mesh ref={shieldRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#cfcab8"
          transparent
          opacity={0.16}
          roughness={0.1}
          metalness={0.1}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Internal Video Pixels (Stay inside the shield) */}
      <points ref={internalParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[internalPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#87702a"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Escaping Structured Coordinates (11 KB green points leaving the shield) */}
      <points ref={escapingDotsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[escapePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#418357"
          transparent
          opacity={0.9}
        />
      </points>
    </group>
  );
}
