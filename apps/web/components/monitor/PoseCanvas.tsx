"use client";

import React, { useRef, useEffect, useState } from "react";
import { PoseFrame } from "@eldersteady/shared-types";
import { ShieldCheck, Video, VideoOff, RefreshCw, AlertTriangle } from "lucide-react";

interface PoseCanvasProps {
  currentPose: PoseFrame | null;
  connectionStatus: string;
  onSimulateFall: () => void;
  onResetPosture: () => void;
}

// 17 COCO Keypoint pairs for human skeleton bones
const SKELETON_PAIRS: [number, number][] = [
  // Face
  [0, 1], [0, 2], [1, 3], [2, 4],
  // Upper body
  [5, 6], // shoulders
  [5, 7], [7, 9], // left arm
  [6, 8], [8, 10], // right arm
  [5, 11], [6, 12], // torso sides
  // Pelvis & Legs
  [11, 12], // hips
  [11, 13], [13, 15], // left leg
  [12, 14], [14, 16], // right leg
];

export function PoseCanvas({
  currentPose,
  connectionStatus,
  onSimulateFall,
  onResetPosture,
}: PoseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamAvailable, setWebcamAvailable] = useState(false);

  // Initialize client webcam for local overlay display if toggled
  useEffect(() => {
    if (showWebcam) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setWebcamAvailable(true);
          }
        })
        .catch(() => {
          setWebcamAvailable(false);
        });
    } else {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [showWebcam]);

  // Render Skeleton onto 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (showWebcam && videoRef.current && webcamAvailable) {
      // Draw webcam feed underneath
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      // Dark tint for contrast
      ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
      ctx.fillRect(0, 0, width, height);
    } else {
      // Privacy-First Dark Room background (Zero video leaves the room)
      ctx.fillStyle = "#181816";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle calibration grid
      ctx.strokeStyle = "#262624";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw floor baseline
      ctx.strokeStyle = "#3f3e3a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.9);
      ctx.lineTo(width, height * 0.9);
      ctx.stroke();

      ctx.fillStyle = "#78766f";
      ctx.font = "10px monospace";
      ctx.fillText("FLOOR PLANE (0.00m)", 16, height * 0.9 - 6);
    }

    if (!currentPose || !currentPose.keypoints || currentPose.keypoints.length < 17) {
      ctx.fillStyle = "#cfcab8";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Awaiting pose telemetry stream (5 FPS)...", width / 2, height / 2);
      return;
    }

    const { keypoints, is_fallen } = currentPose;

    // Color: Green if standing upright, Red if fallen!
    const boneColor = is_fallen ? "#944e47" : "#418357";
    const jointColor = is_fallen ? "#d15c54" : "#5cb87a";
    const glowColor = is_fallen ? "rgba(148, 78, 71, 0.5)" : "rgba(65, 131, 87, 0.5)";

    // Draw Skeleton Bones (connecting lines)
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = boneColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 8;

    for (const [i, j] of SKELETON_PAIRS) {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];
      if (kp1 && kp2 && kp1[2] > 0.15 && kp2[2] > 0.15) {
        ctx.beginPath();
        ctx.moveTo(kp1[0] * width, kp1[1] * height);
        ctx.lineTo(kp2[0] * width, kp2[1] * height);
        ctx.stroke();
      }
    }

    // Draw 17 COCO Keypoints (circles)
    for (let i = 0; i < keypoints.length; i++) {
      const [x, y, conf] = keypoints[i];
      if (conf > 0.15) {
        const px = x * width;
        const py = y * height;

        ctx.beginPath();
        ctx.arc(px, py, i === 0 ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = jointColor;
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [currentPose, showWebcam, webcamAvailable]);

  const isFallen = currentPose?.is_fallen ?? false;

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-card overflow-hidden shadow-editorial">
      {/* Canvas Header / Controls */}
      <div className="px-4 py-3 bg-section border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
          <h2 className="text-sm font-semibold text-header uppercase tracking-wider font-mono">
            Edge Pose Stream • YOLOv8n-pose
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded bg-bg text-text-muted font-mono border border-border">
            {connectionStatus.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWebcam((prev) => !prev)}
            className="px-2.5 py-1 text-xs font-mono rounded-btn border border-border bg-bg text-text-muted hover:text-text flex items-center gap-1.5 transition-colors"
            title="Toggle client-side visual overlay (video remains strictly in your browser)"
          >
            {showWebcam ? <Video className="w-3.5 h-3.5 text-accent" /> : <VideoOff className="w-3.5 h-3.5" />}
            <span>{showWebcam ? "Webcam Overlay On" : "Privacy Mode (No Video)"}</span>
          </button>

          <button
            onClick={onSimulateFall}
            className="px-3 py-1 text-xs font-mono font-medium rounded-btn bg-error text-white hover:bg-error/90 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Fall</span>
          </button>

          <button
            onClick={onResetPosture}
            className="p-1 text-text-muted hover:text-text rounded-btn border border-border bg-bg transition-colors"
            title="Reset to upright standing"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 min-h-[380px] bg-[#181816] flex items-center justify-center">
        {/* Hidden Video element for webcam capture */}
        <video ref={videoRef} autoPlay playsInline muted className="hidden" />

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-contain max-h-[520px]"
        />

        {/* Live Kinematic Telemetry HUD */}
        <div className="absolute top-3 left-3 bg-header/80 backdrop-blur-md px-3 py-2 rounded text-card border border-border/30 font-mono text-xs space-y-1 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Posture:</span>
            <span className={isFallen ? "text-error font-bold" : "text-success-light font-bold"}>
              {isFallen ? "FALL DETECTED (HORIZONTAL)" : "STANDING (UPRIGHT)"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-300">
            <span>
              Torso Angle: <strong className="text-card">{currentPose?.hip_angle_deg ?? 85.0}°</strong>
            </span>
            <span>
              Height: <strong className="text-card">{currentPose?.person_height_m ?? 1.62}m</strong>
            </span>
          </div>
          {isFallen && (
            <div className="text-[11px] text-error-light pt-0.5 border-t border-border/30">
              Floor Duration: <strong className="text-white">{currentPose?.fall_duration_s ?? 0}s</strong> (threshold: &gt;3s)
            </div>
          )}
        </div>

        {/* Verifiable Privacy Guarantee Banner */}
        <div className="absolute bottom-3 left-3 right-3 bg-header/90 backdrop-blur-md px-3 py-1.5 rounded text-[11px] font-mono text-card border border-border/30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-zinc-300">
              Edge Ingestion: <strong className="text-card">SiMa Modalix MLA Target</strong>
            </span>
          </div>
          <span className="text-success-light">0 Bytes Video Uploaded</span>
        </div>
      </div>
    </div>
  );
}
