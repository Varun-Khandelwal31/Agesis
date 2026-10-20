"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface EnrichmentParticlesProps {
  active?: boolean;
}

const NODES = [
  {
    id: "hospital",
    name: "Apollo ER",
    position: [3.2, 1.8, 1.0] as [number, number, number],
    label: "ER Wait: 12m",
    color: "#418357",
  },
  {
    id: "cdsco",
    name: "CDSCO Recalls",
    position: [2.5, 2.5, -2.5] as [number, number, number],
    label: "Losartan Advisory",
    color: "#a28751",
  },
  {
    id: "ambulance",
    name: "Ambulance EMS",
    position: [-2.2, 2.6, 2.8] as [number, number, number],
    label: "ETA: 8 min",
    color: "#418357",
  },
  {
    id: "weather",
    name: "Slip-Risk Weather",
    position: [-3.0, 1.5, -1.0] as [number, number, number],
    label: "Rain Damp: High Risk",
    color: "#87702a",
  },
];

export function EnrichmentParticles({ active = true }: EnrichmentParticlesProps) {
  return (
    <group>
      {/* 4 Floating Target Nodes */}
      {NODES.map((node) => (
        <group key={node.id} position={node.position}>
          {/* Glowing Orb */}
          <mesh>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>

          {/* Orbiting Halo Ring */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <ringGeometry args={[0.26, 0.3, 32]} />
            <meshBasicMaterial color={node.color} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>

          {/* Elegant Floating HTML Tag */}
          <Html position={[0, 0.4, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
            <div className="bg-header/90 backdrop-blur-md text-card px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap shadow-editorial border border-border/40">
              <span className="font-semibold text-accent-light block">{node.name}</span>
              <span className="text-[10px] text-zinc-300">{node.label}</span>
            </div>
          </Html>
        </group>
      ))}

      {/* Stream lines from shield to nodes using Drei Line */}
      <group>
        {NODES.map((node) => {
          const origin: [number, number, number] = [0, 0.5, 0];
          return (
            <Line
              key={`line-${node.id}`}
              points={[origin, node.position]}
              color="#87702a"
              transparent
              opacity={0.4}
              lineWidth={1.5}
            />
          );
        })}
      </group>
    </group>
  );
}

