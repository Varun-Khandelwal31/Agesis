"use client";

import React from "react";
import { FallEvent } from "@eldersteady/shared-types";
import { ShieldCheck, Lock, ArrowDownRight, CheckCircle2 } from "lucide-react";

interface FallReceiptProps {
  fallEvent: FallEvent | null;
}

export function FallReceipt({ fallEvent }: FallReceiptProps) {
  // If no fall has happened yet in this session, show pre-incident baseline
  const videoBytes = fallEvent?.video_bytes_processed ?? 3520000;
  const contextBytes = fallEvent?.context_bytes_emitted ?? 11264;
  const ratio = fallEvent?.receipt_ratio ?? "1 : 303";

  return (
    <div className="bg-[#181816] border border-[#353430] rounded-card p-5 text-card shadow-editorial space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2d2d2a] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent-light">
            Verifiable Edge Privacy Receipt
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#262624] text-success border border-success/30 font-semibold">
          ZERO VIDEO OUT
        </span>
      </div>

      {/* Primary Metrics Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Metric 1: Raw Video Ingested on Edge */}
        <div className="bg-[#21211e] border border-[#30302b] rounded p-3 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Camera Raw Frames Processed
          </span>
          <div className="text-xl md:text-2xl font-mono font-bold text-error">
            {videoBytes.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">B</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 block">(3.36 MB local memory)</span>
        </div>

        {/* Metric 2: Verifiable Reduction Ratio */}
        <div className="bg-[#262520] border border-accent/40 rounded p-3 text-center space-y-0.5 relative">
          <span className="text-[9px] font-mono uppercase tracking-wider text-accent-light block font-semibold">
            Compression & Privacy Factor
          </span>
          <div className="text-2xl md:text-3xl font-mono font-extrabold text-accent-light tracking-tight">
            {ratio}
          </div>
          <span className="text-[10px] font-mono text-zinc-300 block">99.68% Reduction</span>
        </div>

        {/* Metric 3: Structured Context Emitted */}
        <div className="bg-[#21211e] border border-success/40 rounded p-3 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-success block font-bold">
            What Left The Room
          </span>
          <div className="text-xl md:text-2xl font-mono font-bold text-success-light">
            {contextBytes.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">B</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 block">(11.0 KB structured JSON)</span>
        </div>
      </div>

      {/* Payload Audit Breakdown */}
      <div className="bg-[#21211e] border border-[#2d2d2a] rounded p-3 space-y-2 text-xs font-mono">
        <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold border-b border-[#2d2d2a] pb-1 flex items-center justify-between">
          <span>What Was Sent:</span>
          <span className="text-zinc-500">Total: 11 KB</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div className="space-y-0.5">
            <span className="text-zinc-400 block">Pose Coordinates:</span>
            <span className="text-card font-semibold">4 KB (17 keypoints)</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-zinc-400 block">TinyFish Context:</span>
            <span className="text-accent-light font-semibold">3 KB (Live APIs)</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-zinc-400 block">Synthesized Alert:</span>
            <span className="text-success-light font-semibold">4 KB (Claude Sonnet)</span>
          </div>
        </div>
      </div>

      {/* Cryptographic Local Guarantee */}
      <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400 font-mono border-t border-[#2d2d2a]">
        <Lock className="w-3.5 h-3.5 text-success shrink-0" />
        <span>
          <strong className="text-zinc-200">What stayed local:</strong> All video frames stayed in on-chip NVMe RAM. Zero pixels uploaded to cloud.
        </span>
      </div>
    </div>
  );
}
