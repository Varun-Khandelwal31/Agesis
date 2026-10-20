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
  Heart,
  PhoneCall,
  Clock,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";

export default function LandingPage() {
  const [fallenIn3D, setFallenIn3D] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/20">
      {/* Editorial Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border/80 h-16 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif font-black text-xl text-header tracking-tight">
            Agesis<span className="text-accent text-lg">.ai</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-section text-text-muted border border-border">
            + TinyFish Live Context
          </span>
        </div>


        <div className="flex items-center gap-4">
          <Link
            href="#use-case"
            className="text-xs font-mono text-text-muted hover:text-text transition-colors hidden md:inline"
          >
            How Families Use It
          </Link>
          <Link
            href="#how-it-works"
            className="text-xs font-mono text-text-muted hover:text-text transition-colors hidden md:inline"
          >
            Zero-Video Edge Privacy
          </Link>
          <Link
            href="#tinyfish-enrichment"
            className="text-xs font-mono text-text-muted hover:text-text transition-colors hidden md:inline"
          >
            TinyFish Live Context
          </Link>
          <Link
            href="/monitor"
            className="px-4 py-2 text-xs font-mono font-medium rounded-btn bg-accent hover:bg-accent-hover text-bg transition-all shadow-editorial flex items-center gap-2"
          >
            <span>Launch Live App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 min-h-[90vh]">
        {/* Left Copy: Emotional, Clear Use Case, Founder-grade */}
        <div className="w-full lg:w-1/2 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-section border border-border text-xs font-mono text-header">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Built For Elderly Parents Living Alone</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-header tracking-tight leading-[1.12]">
            She refuses a camera in her bedroom.{" "}
            <span className="italic font-normal text-accent">Now she doesn't need one.</span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted leading-relaxed font-sans max-w-xl">
            Standard cameras upload live bedroom video to cloud servers—so parents cover them with towels. 
            <strong> Agesis runs pose detection entirely on-device with zero video upload.</strong> When mom falls, 
            <strong> TinyFish</strong> immediately checks live ER wait times, recalls her specific medicine, 
            and finds the closest ambulance before calling you.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/monitor"
              className="px-6 py-3 rounded-btn bg-accent hover:bg-accent-hover text-bg font-mono text-sm font-semibold transition-all shadow-editorial flex items-center gap-2.5"
            >
              <span>Test Interactive Demo (Webcam or Simulation)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setFallenIn3D((prev) => !prev)}
              className="px-5 py-3 rounded-btn bg-card hover:bg-section text-header border border-border font-mono text-xs transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-accent" />
              <span>{fallenIn3D ? "Reset 3D Figure" : "Simulate Fall in 3D Scene"}</span>
            </button>
          </div>

          {/* Real-world Value Bar */}
          <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">For Mom</span>
              <strong className="text-header text-sm">100% Privacy</strong>
              <span className="text-zinc-500 block text-[10px]">Zero video out</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">For You</span>
              <strong className="text-success text-sm">Live Context</strong>
              <span className="text-zinc-500 block text-[10px]">ER + Meds + EMS</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Response Time</span>
              <strong className="text-accent text-sm">8 Min ETA</strong>
              <span className="text-zinc-500 block text-[10px]">RED.Health</span>
            </div>
          </div>
        </div>

        {/* Right: 3D Scene Canvas Container */}
        <div className="w-full lg:w-1/2 h-[480px] lg:h-[580px] rounded-card border border-border overflow-hidden shadow-editorial relative bg-[#181816]">
          <Scene forcedFallen={fallenIn3D} />
        </div>
      </section>

      {/* Section: The Real World Use Case */}
      <section id="use-case" className="py-20 px-6 md:px-12 bg-section border-y border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
              Real-World Everyday Workflow
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-header">
              How You and Your Family Actually Use It
            </h2>
            <p className="text-sm md:text-base text-text-muted">
              Here is what happens during a regular day and when an emergency strikes 800 miles away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Scenario A: Normal Day */}
            <div className="bg-card border border-border rounded-card p-6 space-y-4 shadow-editorial">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono uppercase font-bold text-success flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Everyday Peace of Mind
                </span>
                <span className="text-[11px] font-mono text-text-muted">Normal Routine</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-header">
                Mom lives with dignity. You check in without intruding.
              </h3>
              <p className="text-xs text-text-muted leading-relaxed font-sans">
                You open your phone at work in Mumbai. You don't see a creepy camera video of your 72-year-old mother changing clothes in Bangalore. 
                Instead, you see: <em>"Anita woke up at 7:15 AM. Moving normally in bedroom and kitchen. Posture upright (86°)."</em>
              </p>
              <div className="p-3 bg-bg rounded border border-border text-xs font-mono text-header">
                Status: <strong className="text-success font-semibold">Normal Movement</strong> • Zero bytes uploaded to cloud.
              </div>
            </div>

            {/* Scenario B: 11:42 PM Emergency */}
            <div className="bg-card border border-border rounded-card p-6 space-y-4 shadow-editorial">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono uppercase font-bold text-error flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Emergency At 11:42 PM
                </span>
                <span className="text-[11px] font-mono text-error font-semibold">Action in Seconds</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-header">
                When she falls, you get answers—not blind panic.
              </h3>
              <p className="text-xs text-text-muted leading-relaxed font-sans">
                Standard cameras send you a terrifying "Motion detected" ping. Agesis runs verbal verification, 
                and TinyFish searches the web in 300ms to enrich the alert:

              </p>
              <ul className="text-xs text-text-muted space-y-1.5 font-sans">
                <li className="flex items-center gap-2">
                  <span className="text-error font-bold">⚠️ Root Cause:</span> Her medicine (Losartan 50mg) was recalled by CDSCO 6 days ago for fainting risk.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success font-bold">🏥 Closest ER:</span> Apollo Indiranagar has only a 12-minute wait (1.8 km away).
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">🚑 Emergency:</span> RED.Health ambulance ETA is 8 minutes (1800 121 911).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: TinyFish Live-Context Layer */}
      <section id="tinyfish-enrichment" className="py-20 px-6 md:px-12 bg-bg">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
              The Breakthrough Integration
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-header">
              Why TinyFish Makes This A Real Product
            </h2>
            <p className="text-sm md:text-base text-text-muted">
              Without TinyFish, you get a generic fall alert. With TinyFish, you get an automated emergency dispatcher in your pocket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-success-light text-success flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">Hospital ER Wait</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                TinyFish extracts live emergency triage wait times from Apollo & Fortis hospitals, preventing you from driving to an overwhelmed ER.
              </p>
              <span className="text-[11px] font-mono text-accent block">Apollo: 12 min wait</span>
            </div>

            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-warning-light text-warning flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">CDSCO Drug Recalls</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Scans Indian government drug regulatory advisories for your parent's exact medication batch (flags blood pressure drops).
              </p>
              <span className="text-[11px] font-mono text-warning block">Losartan 50mg alert</span>
            </div>

            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-success-light text-success flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">Ambulance Dispatch</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Queries local 24/7 ALS/BLS ambulances within the pincode, providing direct dispatch telephone numbers and live ETAs.
              </p>
              <span className="text-[11px] font-mono text-success block">RED.Health: 8 min ETA</span>
            </div>

            <div className="bg-card border border-border rounded-card p-5 space-y-3 shadow-editorial">
              <div className="w-9 h-9 rounded bg-accent-light text-accent flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif font-bold text-header">Slip Risk & Weather</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Checks ambient precipitation and floor friction to inform emergency services whether the fall was a wet slip or a medical collapse.
              </p>
              <span className="text-[11px] font-mono text-accent block">Tile moisture analyzed</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 px-6 md:px-12 bg-section border-t border-border">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <h3 className="text-3xl font-serif font-bold text-header">
            Try the Live Application Now
          </h3>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            Switch between the private room sensor and your caregiver mobile phone view. Test with your webcam or run the 1-click incident simulation.
          </p>

          <div>
            <Link
              href="/monitor"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn bg-accent hover:bg-accent-hover text-bg font-mono font-semibold transition-all shadow-editorial text-sm"
            >
              <span>Launch Live Monitor & Family Dispatch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-[11px] font-mono text-zinc-500 pt-6">
            Inspired by the ElderSteady-Private concept by Aayush Dixit. Original implementation with TinyFish live-context enrichment layer.
          </p>
        </div>
      </footer>
    </div>
  );
}
