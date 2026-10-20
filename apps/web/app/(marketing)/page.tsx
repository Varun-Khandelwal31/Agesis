"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scene } from "@/components/three/Scene";
import {
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
  Activity,
  Building2,
  AlertTriangle,
  Truck,
  CloudRain,
  Lock,
  ChevronRight,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const [fallenIn3D, setFallenIn3D] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/20">
      {/* Editorial Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/85 backdrop-blur-md border-b border-border/80 h-16 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif font-black text-xl text-header tracking-tight">
            ElderSteady<span className="text-accent text-lg">.private</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-section text-text-muted border border-border">
            + TinyFish Live Context
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="#how-it-works"
            className="text-xs font-mono text-text-muted hover:text-text transition-colors hidden md:inline"
          >
            Edge Architecture
          </Link>
          <Link
            href="#tinyfish-enrichment"
            className="text-xs font-mono text-text-muted hover:text-text transition-colors hidden md:inline"
          >
            Live Context
          </Link>
          <Link
            href="#receipt"
            className="text-xs font-mono text-text-muted hover:text-text transition-colors hidden md:inline"
          >
            1:303 Verifiability
          </Link>
          <Link
            href="/monitor"
            className="px-4 py-2 text-xs font-mono font-medium rounded-btn bg-header hover:bg-header/90 text-card transition-all shadow-editorial flex items-center gap-2"
          >
            <span>Try Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent-light" />
          </Link>
        </div>
      </nav>

      {/* Hero Section with Full Interactive 3D Scene */}
      <section className="relative pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 min-h-[90vh]">
        {/* Left Copy: Editorial, Calm, Authoritative */}
        <div className="w-full lg:w-1/2 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-section border border-border text-xs font-mono text-header">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Zero Video Leaves The Room • SiMa Modalix MLA Target</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-header tracking-tight leading-[1.12]">
            Privacy-first elderly fall detection.{" "}
            <span className="italic font-normal text-accent">Live context</span> when it matters.
          </h1>

          <p className="text-base sm:text-lg text-text-muted leading-relaxed font-sans max-w-xl">
            A private edge AI camera running pose detection on-device. When a fall occurs,
            <strong> TinyFish</strong> orchestrates parallel web queries to enrich the family alert
            with live hospital ER wait times, CDSCO drug recalls, and local ambulance dispatch.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/monitor"
              className="px-6 py-3 rounded-btn bg-accent hover:bg-accent-hover text-bg font-mono text-sm font-semibold transition-all shadow-editorial flex items-center gap-2.5"
            >
              <span>Launch Live Monitor (Webcam)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setFallenIn3D((prev) => !prev)}
              className="px-5 py-3 rounded-btn bg-card hover:bg-section text-header border border-border font-mono text-xs transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-accent" />
              <span>{fallenIn3D ? "Reset 3D Pose" : "Simulate Fall in 3D Scene"}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Input</span>
              <strong className="text-text text-sm">3.36 MB Video</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Output</span>
              <strong className="text-success text-sm">11 KB JSON</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Ratio</span>
              <strong className="text-accent text-sm">1 : 303</strong>
            </div>
          </div>
        </div>

        {/* Right: 3D Scene Canvas Container */}
        <div className="w-full lg:w-1/2 h-[480px] lg:h-[580px] rounded-card border border-border overflow-hidden shadow-editorial relative bg-[#181816]">
          <Scene forcedFallen={fallenIn3D} />
        </div>
      </section>

      {/* Section: The Edge Architecture & Verifiability */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 bg-section border-y border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
              Edge AI Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-header">
              The camera does math. Not surveillance.
            </h2>
            <p className="text-sm md:text-base text-text-muted">
              Standard elderly cameras upload high-definition video of your parent's bedroom to cloud servers.
              ElderSteady processes everything locally, converting pixels into 17 skeletal joint coordinates in 8ms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-card p-6 space-y-3 shadow-editorial">
              <div className="w-10 h-10 rounded-full bg-accent-light text-header flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-serif font-bold text-header">Local YOLOv8n-pose</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Raw webcam frames (640x480 at 5 FPS) are passed directly into a local lightweight YOLO model. 
                Joint locations and torso angles are computed in memory. The raw frame is immediately discarded.
              </p>
            </div>

            <div className="bg-card border border-border rounded-card p-6 space-y-3 shadow-editorial">
              <div className="w-10 h-10 rounded-full bg-accent-light text-header flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-serif font-bold text-header">Kinematic Fall Logic</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                A sliding temporal window monitors torso inclination and floor proximity. When hip angle shifts &gt;60° 
                and vertical height stays below 0.5m for &gt;3s, a verifiable fall event is registered.
              </p>
            </div>

            <div className="bg-card border border-border rounded-card p-6 space-y-3 shadow-editorial">
              <div className="w-10 h-10 rounded-full bg-accent-light text-header flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-serif font-bold text-header">SiMa Modalix MLA Target</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                While the demo runs locally on CPU/laptop, production targets the SiMa Modalix MLA chip. 
                Consumes &lt;5W power with board-local NVMe storage and zero external internet video streaming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: TinyFish Live-Context Layer */}
      <section id="tinyfish-enrichment" className="py-20 px-6 md:px-12 bg-bg">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
              The Original Contribution
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-header">
              TinyFish Live-Context Enrichment
            </h2>
            <p className="text-sm md:text-base text-text-muted">
              A fall alert that just says "Mom fell" causes panic. ElderSteady uses TinyFish to pull 
              actionable intelligence across 4 parallel vectors before alerting family members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Vector 1 */}
            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-success-light text-success flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">Hospital ER Wait</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Searches and extracts current triage wait times from nearby emergency departments (Apollo, Fortis, Manipal).
              </p>
              <div className="pt-2 font-mono text-[11px] text-accent border-t border-border">
                TinyFish Search + Fetch
              </div>
            </div>

            {/* Vector 2 */}
            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-warning-light text-warning flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">CDSCO Drug Recalls</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Audits mom's prescriptions against recent Central Drugs Standard Control Organisation safety recalls and batch advisories.
              </p>
              <div className="pt-2 font-mono text-[11px] text-accent border-t border-border">
                TinyFish Search API
              </div>
            </div>

            {/* Vector 3 */}
            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-success-light text-success flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">Ambulance Dispatch</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Queries 24/7 ALS/BLS providers within 5km, calculating live response ETA and direct emergency dispatch phone numbers.
              </p>
              <div className="pt-2 font-mono text-[11px] text-accent border-t border-border">
                TinyFish Search API
              </div>
            </div>

            {/* Vector 4 */}
            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-accent-light text-accent flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">Slip Risk & Weather</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Extracts precipitation and ambient temperature to evaluate floor dampness risk and hypothermia factors.
              </p>
              <div className="pt-2 font-mono text-[11px] text-accent border-t border-border">
                TinyFish Fetch API
              </div>
            </div>
          </div>

          {/* Claude Sonnet Synthesis Flow Highlight */}
          <div className="bg-header text-card rounded-card p-6 md:p-8 space-y-4 shadow-editorial">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/30 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-light" />
                <h3 className="font-serif font-bold text-lg text-card">
                  Synthesized via Claude Sonnet 4
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-300">
                180 Character SMS Constraint
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2 text-xs text-zinc-300 font-sans leading-relaxed">
                <p>
                  Rather than overwhelming family members with raw telemetry or disconnected links, 
                  Claude Sonnet digests the 4x TinyFish context and verbal check status into a concise, 
                  calm alert that guides clear next steps without creating panic.
                </p>
                <div className="flex items-center gap-2 text-accent-light pt-2 font-mono text-[11px]">
                  <Check className="w-4 h-4 text-success" />
                  <span>Cites specific recall batch and emergency phone numbers</span>
                </div>
              </div>

              <div className="p-4 bg-[#1f1f1d] rounded border border-border/30 font-mono text-xs text-zinc-200 space-y-2">
                <span className="text-[10px] text-zinc-400 block uppercase">Sample Output SMS:</span>
                <p className="text-accent-light font-medium">
                  "Fall detected at 11:42 PM. Mom said 'I'm okay.' Context: Losartan recalled by CDSCO Oct 14. Apollo Indiranagar ER wait: 12m. Call mom first: 1800-121-911."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Verifiable Receipt & Privacy Proof */}
      <section id="receipt" className="py-20 px-6 md:px-12 bg-section border-t border-border">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
              Verifiable Math
            </span>
            <h2 className="text-3xl font-serif font-bold text-header">
              The 1 : 303 Privacy Proof
            </h2>
            <p className="text-sm text-text-muted max-w-xl mx-auto">
              Every fall alert includes a cryptographic receipt comparing local uncompressed video memory 
              against the lightweight structured numbers that leave the room.
            </p>
          </div>

          <div className="bg-[#181816] text-card rounded-card p-6 md:p-8 border border-[#353430] space-y-6 shadow-editorial font-mono">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400 uppercase">Input Video Buffer</span>
                <div className="text-3xl font-bold text-error">3,520,000 B</div>
                <span className="text-xs text-zinc-500">(3.36 MB local memory)</span>
              </div>
              <div className="space-y-1 border-y md:border-y-0 md:border-x border-[#2d2d2a] py-3 md:py-0">
                <span className="text-xs text-accent-light uppercase font-bold">Reduction Ratio</span>
                <div className="text-4xl font-extrabold text-accent-light">1 : 303</div>
                <span className="text-xs text-zinc-400">99.68% Bandwidth Reduced</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-success uppercase font-bold">What Left The Room</span>
                <div className="text-3xl font-bold text-success-light">11,264 B</div>
                <span className="text-xs text-zinc-500">(11 KB structured JSON)</span>
              </div>
            </div>

            <div className="p-4 bg-[#21211e] rounded border border-[#2d2d2a] flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-success" />
                <span>Zero pixels, zero audio recordings, zero biometric embeddings uploaded.</span>
              </span>
              <span className="text-success font-semibold">VERIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer & Required Credits */}
      <footer className="py-16 px-6 md:px-12 bg-bg border-t border-border">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-serif font-bold text-header">
                Ready to test fall detection?
              </h3>
              <p className="text-xs md:text-sm text-text-muted">
                Run the live webcam monitor or test instant pose simulation in your browser.
              </p>
            </div>

            <Link
              href="/monitor"
              className="px-6 py-3 rounded-btn bg-accent hover:bg-accent-hover text-bg font-mono text-sm font-semibold transition-all shadow-editorial flex items-center gap-2"
            >
              <span>Launch Live Monitor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Inspiration Credit (Strictly Required) */}
          <div className="space-y-3 text-xs text-text-muted font-sans leading-relaxed">
            <p className="font-semibold text-header">
              Attribution & Originality Notice:
            </p>
            <p>
              Inspired by the ElderSteady-Private concept by <strong>Aayush Dixit</strong> (
              <a
                href="https://github.com/aayushdixit27/eldersteady-private"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-2"
              >
                github.com/aayushdixit27/eldersteady-private
              </a>
              ). This is an original build that extends the concept with TinyFish live-context enrichment. 
              All code in this repository is 100% original.
            </p>
            <p className="text-[11px] font-mono text-zinc-500 pt-2">
              ElderSteady-Private • Powered by TinyFish SDK, YOLOv8n-pose, Next.js 16, React Three Fiber & Claude Sonnet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
