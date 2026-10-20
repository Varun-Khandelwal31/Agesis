"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParentProps {
  isFallen?: boolean;
}

export function Parent({ isFallen = false }: ParentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentFallenRatio = useRef(0);

  useFrame(({ clock }, delta) => {
    // Smooth transition between standing (0) and fallen (1)
    const targetRatio = isFallen ? 1 : 0;
    currentFallenRatio.current = THREE.MathUtils.damp(
      currentFallenRatio.current,
      targetRatio,
      3,
      delta
    );

    const r = currentFallenRatio.current;
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Standing motion: gentle breathing & sway
      const sway = Math.sin(t * 1.5) * 0.04 * (1 - r);
      const breathe = Math.cos(t * 2) * 0.02 * (1 - r);

      // Interpolate position and rotation
      // Standing: pos [0.5, -0.15, 0.5], rot [0, 0, 0]
      // Fallen: pos [0.5, -0.85, 0.5], rot [Math.PI / 2 - 0.2, 0.4, -0.6]
      groupRef.current.position.y = -0.15 * (1 - r) + -0.85 * r + breathe;
      groupRef.current.position.x = 0.5 + sway;
      groupRef.current.position.z = 0.5;

      groupRef.current.rotation.x = (Math.PI / 2 - 0.2) * r;
      groupRef.current.rotation.z = -0.5 * r;
      groupRef.current.rotation.y = sway * 0.5 * (1 - r) + 0.3 * r;
    }
  });

  const jointMat = new THREE.MeshStandardMaterial({
    color: isFallen ? "#944e47" : "#418357",
    roughness: 0.4,
  });

  const boneMat = new THREE.MeshStandardMaterial({
    color: isFallen ? "#c4675e" : "#87702a",
    roughness: 0.6,
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#e6dfcc" roughness={0.7} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.28, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.1, 12]} />
        <primitive object={boneMat} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.98, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.5, 12]} />
        <primitive object={boneMat} />
      </mesh>

      {/* Left Shoulder Joint */}
      <mesh position={[-0.2, 1.2, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <primitive object={jointMat} />
      </mesh>
      {/* Right Shoulder Joint */}
      <mesh position={[0.2, 1.2, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <primitive object={jointMat} />
      </mesh>

      {/* Left Upper Arm */}
      <mesh position={[-0.25, 1.0, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 12]} />
        <primitive object={boneMat} />
      </mesh>
      {/* Right Upper Arm */}
      <mesh position={[0.25, 1.0, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 12]} />
        <primitive object={boneMat} />
      </mesh>

      {/* Left Elbow */}
      <mesh position={[-0.28, 0.82, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <primitive object={jointMat} />
      </mesh>
      {/* Right Elbow */}
      <mesh position={[0.28, 0.82, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <primitive object={jointMat} />
      </mesh>

      {/* Left Forearm */}
      <mesh position={[-0.26, 0.65, 0.05]} rotation={[-0.3, 0, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
        <primitive object={boneMat} />
      </mesh>
      {/* Right Forearm */}
      <mesh position={[0.26, 0.65, 0.05]} rotation={[-0.3, 0, -0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
        <primitive object={boneMat} />
      </mesh>

      {/* Pelvis/Hips */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <primitive object={jointMat} />
      </mesh>

      {/* Left Upper Leg */}
      <mesh position={[-0.12, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.035, 0.42, 12]} />
        <primitive object={boneMat} />
      </mesh>
      {/* Right Upper Leg */}
      <mesh position={[0.12, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.035, 0.42, 12]} />
        <primitive object={boneMat} />
      </mesh>

      {/* Left Knee */}
      <mesh position={[-0.12, 0.28, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <primitive object={jointMat} />
      </mesh>
      {/* Right Knee */}
      <mesh position={[0.12, 0.28, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <primitive object={jointMat} />
      </mesh>

      {/* Left Lower Leg */}
      <mesh position={[-0.12, 0.08, 0]}>
        <cylinderGeometry args={[0.035, 0.03, 0.38, 12]} />
        <primitive object={boneMat} />
      </mesh>
      {/* Right Lower Leg */}
      <mesh position={[0.12, 0.08, 0]}>
        <cylinderGeometry args={[0.035, 0.03, 0.38, 12]} />
        <primitive object={boneMat} />
      </mesh>

      {/* Left Ankle */}
      <mesh position={[-0.12, -0.12, 0.04]}>
        <boxGeometry args={[0.07, 0.04, 0.12]} />
        <primitive object={boneMat} />
      </mesh>
      {/* Right Ankle */}
      <mesh position={[0.12, -0.12, 0.04]}>
        <boxGeometry args={[0.07, 0.04, 0.12]} />
        <primitive object={boneMat} />
      </mesh>
    </group>
  );
}
