"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Clock, MapPin, Pill, Building2, Truck, AlertTriangle, CloudRain, CheckCircle, ExternalLink } from "lucide-react";

export default function AlertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="min-h-screen bg-bg text-text p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/monitor"
            className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Monitor</span>
          </Link>
          <span className="text-xs font-mono text-text-muted">
            Incident ID: <strong className="text-header">#ES-2026-1020-04</strong>
          </span>
        </div>

        {/* Primary Alert Header Banner */}
        <div className="bg-card border border-border rounded-card p-6 shadow-editorial space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                <h1 className="text-xl md:text-2xl font-serif font-bold text-header">
                  Fall Incident & Live Context Report
                </h1>
              </div>
              <p className="text-xs text-text-muted mt-1 font-mono">
                Detected at 11:42 PM IST • Verified after 3.2s on floor
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-warning-light text-warning text-xs font-mono font-bold rounded border border-warning/30">
                MEDIUM PRIORITY
              </span>
              <span className="px-3 py-1 bg-success-light text-success text-xs font-mono font-bold rounded border border-success/30">
                VOICE: "I'M OKAY"
              </span>
            </div>
          </div>

          {/* Claude Sonnet Synthesis Brief */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              Synthesized Family Advisory
            </h3>
            <p className="text-sm text-text leading-relaxed font-sans bg-bg p-4 rounded border border-border">
              Anita was detected falling at 11:42 PM in the bedroom. She pressed "I'm okay" on the verbal check, but pose metrics indicate a sharp 72° change in torso angle. 
              <strong> Crucial Context:</strong> Her active medication <em>Losartan 50mg</em> was subject to a CDSCO safety notice (Oct 14) for trace impurities causing sudden postural hypotension. 
              Apollo Hospital Indiranagar ER currently reports a <strong>12-minute wait</strong>, and RED.Health ambulance is on standby 8 minutes away.
            </p>
          </div>

          <div className="p-3 bg-section rounded border border-border/80 flex items-center justify-between text-xs font-mono">
            <span className="text-text-muted">Recommended Family Action:</span>
            <strong className="text-header">Call Anita directly; if dizziness persists, dispatch RED.Health (1800 121 911).</strong>
          </div>
        </div>

        {/* 4x TinyFish Live Context Audit Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-header">
            TinyFish Live-Context Verification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Apollo ER */}
            <div className="bg-card border border-border rounded-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-header flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-accent" />
                  <span>Apollo Indiranagar ER</span>
                </span>
                <span className="text-[11px] font-mono text-success font-semibold">12 Min Wait</span>
              </div>
              <p className="text-xs text-text-muted">
                1.8 km distance. Level-1 trauma and cardiac emergency triage ready.
              </p>
              <a
                href="https://www.apollohospitals.com/bangalore/indiranagar"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent hover:underline flex items-center gap-1 pt-1"
              >
                <span>Live Status Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. CDSCO Recall */}
            <div className="bg-card border border-border rounded-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warning flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>CDSCO Drug Recall Flag</span>
                </span>
                <span className="text-[11px] font-mono text-warning font-semibold">Class II Alert</span>
              </div>
              <p className="text-xs text-text-muted">
                Losartan 50mg (Batch LT-8842) recalled Oct 14 for trace nitrosamine impurity.
              </p>
              <a
                href="https://cdsco.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent hover:underline flex items-center gap-1 pt-1"
              >
                <span>CDSCO Advisory Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Ambulance */}
            <div className="bg-card border border-border rounded-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-header flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-accent" />
                  <span>Ambulance Standby</span>
                </span>
                <span className="text-[11px] font-mono text-success font-semibold">ETA 8 Min</span>
              </div>
              <p className="text-xs text-text-muted">
                RED.Health (StanPlus) ALS Unit • ₹1,800 standard dispatch tariff.
              </p>
              <span className="text-[11px] font-mono text-accent block">Contact: 1800 121 911</span>
            </div>

            {/* 4. Weather */}
            <div className="bg-card border border-border rounded-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-header flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-accent" />
                  <span>Weather Slip Factor</span>
                </span>
                <span className="text-[11px] font-mono text-warning font-semibold">High Slip Danger</span>
              </div>
              <p className="text-xs text-text-muted">
                22.4°C with evening precipitation. Veranda and bathroom tiles have reduced friction coefficient.
              </p>
              <span className="text-[11px] font-mono text-text-muted">Station: Indiranagar Met</span>
            </div>
          </div>
        </div>

        {/* Verifiable Edge Receipt */}
        <div className="bg-[#181816] border border-[#353430] rounded-card p-5 text-card space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#2d2d2a] pb-2">
            <span className="text-accent-light font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" />
              Edge Verifiability Proof
            </span>
            <span className="text-success font-semibold">1 : 303 RATIO</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center py-2">
            <div>
              <span className="text-zinc-500 block text-[10px]">VIDEO PROCESSED</span>
              <strong className="text-error text-sm">3,520,000 B</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">BYTES EMITTED</span>
              <strong className="text-success-light text-sm">11,264 B</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">VIDEO TO CLOUD</span>
              <strong className="text-card text-sm">0 BYTES</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">CHIP ARCHITECTURE</span>
              <strong className="text-accent-light text-sm">SiMa MLA</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
