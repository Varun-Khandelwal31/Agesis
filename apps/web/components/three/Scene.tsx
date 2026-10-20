"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { Room } from "./Room";
import { CameraDevice } from "./Camera";
import { Parent } from "./Parent";
import { PrivacyShield } from "./PrivacyShield";
import { EnrichmentParticles } from "./EnrichmentParticles";

interface SceneProps {
  forcedFallen?: boolean;
}

export function Scene({ forcedFallen = false }: SceneProps) {
  const [interactiveFallen, setInteractiveFallen] = useState(forcedFallen);
  const isFallen = forcedFallen || interactiveFallen;

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [3.5, 2.2, 5.0], fov: 45 }}
        className="w-full h-full bg-[#181816]"
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#1c1c1a"]} />

          {/* Warm Dim Lighting (Mom's Bedroom at Evening) */}
          <ambientLight intensity={0.4} color="#f4eade" />
          <directionalLight
            position={[5, 7, 4]}
            intensity={1.2}
            color="#fff3e0"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-4, 3, -3]} intensity={0.3} color="#9ec0ff" />

          {/* 3D Scene Geometry */}
          <Room />
          <CameraDevice />
          <Parent isFallen={isFallen} />
          <PrivacyShield />
          <EnrichmentParticles active={true} />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.4}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={Math.PI / 6}
          />
        </Suspense>
      </Canvas>

      {/* Floating 3D Scene Controls & Privacy Badge */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto bg-header/85 backdrop-blur-md px-3.5 py-2 rounded-card text-xs text-card border border-border/30 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-zinc-200">
            Shield Status: <strong className="text-success-light">Active (Zero Video Out)</strong>
          </span>
          <span className="text-zinc-400">|</span>
          <span className="text-accent-light font-mono text-[11px]">SiMa MLA Edge Sim</span>
        </div>

        <button
          onClick={() => setInteractiveFallen((prev) => !prev)}
          className="pointer-events-auto px-4 py-2 text-xs font-mono font-medium rounded-btn bg-accent hover:bg-accent-hover text-bg transition-colors shadow-editorial flex items-center gap-2"
        >
          <span>{isFallen ? "↺ Reset Parent Figure" : "⚡ Simulate Fall in 3D"}</span>
        </button>
      </div>
    </div>
  );
}
