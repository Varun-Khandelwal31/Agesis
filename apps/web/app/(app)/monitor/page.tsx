"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  PoseFrame,
  FallEvent,
  ParentProfile as IParentProfile,
  HospitalERResult,
  DrugRecallItem,
  AmbulanceService,
  WeatherSlipRisk,
  SynthesizedAlert,
} from "@eldersteady/shared-types";
import { PoseStreamClient, ConnectionStatus } from "@/lib/pose-stream";
import { PoseCanvas } from "@/components/monitor/PoseCanvas";
import { ParentProfile } from "@/components/monitor/ParentProfile";
import { EnrichmentPanel } from "@/components/monitor/EnrichmentPanel";
import { FallReceipt } from "@/components/monitor/FallReceipt";
import { FamilyAlertCard } from "@/components/monitor/FamilyAlertCard";
import {
  ShieldCheck,
  ArrowLeft,
  Activity,
  PhoneCall,
  Truck,
  Building2,
  Share2,
  Play,
  RotateCcw,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Clock,
  Sparkles,
} from "lucide-react";

const INITIAL_PROFILE: IParentProfile = {
  name: "Anita",
  age: 72,
  address: "12th Main, Indiranagar, Bangalore",
  pincode: "560038",
  medications: ["Losartan 50mg", "Atorvastatin 10mg", "Metformin 500mg"],
  voiceStatus: "im_okay",
};

export default function MonitorPage() {
  const [profile, setProfile] = useState<IParentProfile>(INITIAL_PROFILE);
  const [currentPose, setCurrentPose] = useState<PoseFrame | null>(null);
  const [fallEvent, setFallEvent] = useState<FallEvent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");

  // View mode: "room" (The Sensor in Mom's Room) vs "family" (Caregiver Mobile Phone View)
  const [activeTab, setActiveTab] = useState<"room" | "family">("room");

  // Interactive Guided Walkthrough State
  const [walkthroughStep, setWalkthroughStep] = useState<number>(1);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // TinyFish Enrichment State
  const [isEnriching, setIsEnriching] = useState(false);
  const [hospitalEr, setHospitalEr] = useState<HospitalERResult | undefined>();
  const [drugRecalls, setDrugRecalls] = useState<DrugRecallItem[] | undefined>();
  const [ambulance, setAmbulance] = useState<AmbulanceService[] | undefined>();
  const [weather, setWeather] = useState<WeatherSlipRisk | undefined>();
  const [latencies, setLatencies] = useState<{
    hospital?: number;
    recalls?: number;
    ambulance?: number;
    weather?: number;
    total?: number;
  }>({});

  const [synthesizedAlert, setSynthesizedAlert] = useState<SynthesizedAlert | null>(null);

  const clientRef = useRef<PoseStreamClient | null>(null);

  // Initialize WebSocket connection to Python backend
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/pose";
    const client = new PoseStreamClient(wsUrl);
    clientRef.current = client;

    client.connect({
      onPose: (pose) => {
        setCurrentPose(pose);
      },
      onFall: (event) => {
        setFallEvent(event);
        setWalkthroughStep(3);
        handleTriggerEnrichment(event);
      },
      onStatusChange: (status) => {
        setConnectionStatus(status);
      },
    });

    return () => {
      client.disconnect();
    };
  }, []);

  // Trigger TinyFish 4x Enrichment API
  const handleTriggerEnrichment = async (event: FallEvent) => {
    setIsEnriching(true);
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentProfile: profile,
          fallEvent: event,
          voiceStatus: profile.voiceStatus,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHospitalEr(data.enrichment.hospitalEr.data);
        setDrugRecalls(data.enrichment.drugRecalls.data);
        setAmbulance(data.enrichment.ambulance.data);
        setWeather(data.enrichment.weather.data);
        setLatencies({
          hospital: data.enrichment.hospitalEr.latencyMs,
          recalls: data.enrichment.drugRecalls.latencyMs,
          ambulance: data.enrichment.ambulance.latencyMs,
          weather: data.enrichment.weather.latencyMs,
          total: data.enrichment.totalLatencyMs,
        });

        setSynthesizedAlert({
          id: data.alertId,
          fallTimestamp: event.timestamp,
          smsText: data.synthesis.sms_text,
          contextCard: data.synthesis.context_card,
          recommendedAction: data.synthesis.recommended_action,
          priority: data.synthesis.priority,
          parentProfile: profile,
          fallEvent: event,
          enrichment: {
            hospitalEr: data.enrichment.hospitalEr.data,
            drugRecalls: data.enrichment.drugRecalls.data,
            ambulance: data.enrichment.ambulance.data,
            weather: data.enrichment.weather.data,
          },
        });
        setWalkthroughStep(4);
      }
    } catch (err) {
      console.error("Enrichment fetch error:", err);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSimulateFall = () => {
    setWalkthroughStep(2);
    if (clientRef.current) {
      clientRef.current.triggerFallSimulation();
    }
  };

  const handleResetPosture = () => {
    setWalkthroughStep(1);
    if (clientRef.current) {
      clientRef.current.resetPosture();
    }
    setFallEvent(null);
    setHospitalEr(undefined);
    setDrugRecalls(undefined);
    setAmbulance(undefined);
    setWeather(undefined);
    setSynthesizedAlert(null);
    setActionFeedback(null);
  };

  const handleSendSMS = async (smsText: string) => {
    const res = await fetch("/api/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ smsText }),
    });
    return await res.json();
  };

  const handleAction = (type: string, detail: string) => {
    setActionFeedback(`✓ Action Triggered: ${detail}`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Product Overview</span>
          </Link>
          <div className="h-4 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-lg text-header tracking-tight">
              Agesis<span className="text-accent text-base">.ai</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success-light text-success border border-success/30 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Camera Privacy Shield: ACTIVE</span>
            </span>

          </div>
        </div>

        {/* View Perspective Switcher */}
        <div className="flex items-center gap-3">
          <div className="bg-section p-1 rounded-card border border-border flex items-center gap-1">
            <button
              onClick={() => setActiveTab("room")}
              className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "room"
                  ? "bg-card text-header font-semibold shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>1. Mom's Room (Edge Sensor)</span>
            </button>

            <button
              onClick={() => setActiveTab("family")}
              className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "family"
                  ? "bg-card text-header font-semibold shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-accent" />
              <span>2. Family Phone (You)</span>
              {fallEvent && <span className="w-2 h-2 rounded-full bg-error animate-ping" />}
            </button>
          </div>
        </div>
      </header>

      {/* Guided Walkthrough Storyboard Bar */}
      <div className="bg-section border-b border-border px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-header tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Interactive Use Case Walkthrough:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div
              className={`px-3 py-1 rounded border flex items-center gap-1.5 ${
                walkthroughStep === 1
                  ? "bg-card border-accent text-header font-bold shadow-sm"
                  : "bg-bg border-border text-text-muted"
              }`}
            >
              <span>1. Mom at Home</span>
            </div>

            <span className="text-zinc-400">→</span>

            <div
              className={`px-3 py-1 rounded border flex items-center gap-1.5 ${
                walkthroughStep === 2
                  ? "bg-error-light border-error text-error font-bold shadow-sm animate-pulse"
                  : walkthroughStep > 2
                  ? "bg-card border-border text-text-muted"
                  : "bg-bg border-border text-text-muted"
              }`}
            >
              <span>2. Sudden Fall Event</span>
            </div>

            <span className="text-zinc-400">→</span>

            <div
              className={`px-3 py-1 rounded border flex items-center gap-1.5 ${
                walkthroughStep === 3
                  ? "bg-warning-light border-warning text-warning font-bold shadow-sm"
                  : walkthroughStep > 3
                  ? "bg-card border-border text-text-muted"
                  : "bg-bg border-border text-text-muted"
              }`}
            >
              <span>3. TinyFish Web Agent</span>
            </div>

            <span className="text-zinc-400">→</span>

            <div
              className={`px-3 py-1 rounded border flex items-center gap-1.5 ${
                walkthroughStep === 4
                  ? "bg-success-light border-success text-success font-bold shadow-sm"
                  : "bg-bg border-border text-text-muted"
              }`}
            >
              <span>4. Family Dispatch Action</span>
            </div>

            <button
              onClick={fallEvent ? handleResetPosture : handleSimulateFall}
              className="ml-2 px-3 py-1 rounded bg-accent hover:bg-accent-hover text-bg font-mono font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
              {fallEvent ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Fall Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionFeedback && (
        <div className="bg-success text-white text-center py-2 px-4 text-xs font-mono font-medium animate-fadeIn">
          {actionFeedback}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* TAB 1: MOM'S ROOM SENSOR VIEW */}
        {activeTab === "room" && (
          <div className="space-y-6">
            {/* Top Explainer Banner */}
            <div className="bg-card border border-border rounded-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-editorial">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-header font-serif flex items-center gap-2">
                  <Eye className="w-4 h-4 text-accent" />
                  <span>Device Installed in Anita's Bedroom (Indiranagar, Bangalore)</span>
                </h2>
                <p className="text-xs text-text-muted max-w-3xl">
                  <strong>How mom experiences it:</strong> No creepy webcam streaming her bedroom. The device's local ML chip translates pixels into 17 stick-figure coordinates in 8ms. When she is standing or walking, you only see a calm status: <em>"Anita is moving normally in the room."</em>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSimulateFall}
                  className="px-4 py-2 bg-error hover:bg-error/90 text-white text-xs font-mono font-semibold rounded-btn transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Test Fall Trigger (3s Floor Wait)</span>
                </button>
              </div>
            </div>

            {/* Split Screen: Pose Canvas + Immediate Context */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Pose Canvas */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <PoseCanvas
                  currentPose={currentPose}
                  connectionStatus={connectionStatus}
                  onSimulateFall={handleSimulateFall}
                  onResetPosture={handleResetPosture}
                />

                {/* The Verifiable Receipt */}
                <FallReceipt fallEvent={fallEvent} />
              </div>

              {/* Right 5 cols: Mom's Profile & Live Context */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <ParentProfile
                  profile={profile}
                  onVoiceStatusChange={(voiceStatus) => {
                    setProfile((prev) => ({ ...prev, voiceStatus }));
                  }}
                />

                <EnrichmentPanel
                  isEnriching={isEnriching}
                  hospitalEr={hospitalEr}
                  drugRecalls={drugRecalls}
                  ambulance={ambulance}
                  weather={weather}
                  latencies={latencies}
                />

                <div className="bg-header text-card rounded-card p-4 space-y-3 font-mono text-xs shadow-editorial">
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <span className="font-bold text-accent-light uppercase">Why TinyFish Matters Here:</span>
                    <span className="text-[10px] text-zinc-300">Live Web Search</span>
                  </div>
                  <p className="text-zinc-200 text-xs font-sans leading-relaxed">
                    Most elderly monitors just say "Fall detected". That leaves family panicking. TinyFish immediately cross-checked <strong>Anita's medication (Losartan)</strong> and found a recent <strong>CDSCO recall</strong> for batch impurities causing sudden dizziness—plus found <strong>Apollo ER with only a 12 min wait</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab("family")}
                    className="w-full py-2 bg-accent hover:bg-accent-hover text-bg font-mono font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Caregiver Emergency Phone Dashboard →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAREGIVER MOBILE PHONE VIEW (WHAT YOU RECEIVE) */}
        {activeTab === "family" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Caregiver Mobile Header */}
            <div className="bg-card border border-border rounded-card p-5 shadow-editorial space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-serif font-black text-lg">
                    A
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-header">
                      Anita Dixit's Family Caregiver Portal
                    </h2>
                    <p className="text-xs text-text-muted font-mono">
                      Location: Indiranagar, Bangalore • Monitored via Agesis Edge
                    </p>

                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-bg border border-border text-text-muted">
                    Your Phone: +91 98765 43210
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${fallEvent ? "bg-error animate-ping" : "bg-success"}`} />
                  <span className="font-semibold text-text">
                    Current Status: {fallEvent ? "FALL INCIDENT ACTIVE" : "Mom is resting safely"}
                  </span>
                </div>
                <span className="text-text-muted font-mono">Last Check-in: Just now</span>
              </div>
            </div>

            {/* Synthesized Alert Card */}
            <FamilyAlertCard alert={synthesizedAlert} onSendSMS={handleSendSMS} />

            {/* Real Emergency Action Buttons */}
            <div className="bg-card border border-border rounded-card p-6 shadow-editorial space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-header">
                One-Touch Family Action Center (Live Emergency Dispatch)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Action 1: Call Mom */}
                <button
                  onClick={() => handleAction("call_mom", "Connecting direct call to Anita's phone...")}
                  className="p-4 bg-section hover:bg-card border border-border rounded-card text-left space-y-1 transition-all group shadow-sm hover:border-accent"
                >
                  <div className="w-8 h-8 rounded bg-accent-light text-header flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4 text-accent" />
                  </div>
                  <strong className="text-xs text-header block font-serif">Call Mom First</strong>
                  <span className="text-[11px] text-text-muted block">Direct line to bedside phone</span>
                </button>

                {/* Action 2: Dispatch Ambulance */}
                <button
                  onClick={() => handleAction("dispatch_ambulance", "Dispatching RED.Health Ambulance (ETA 8 mins) to 12th Main Indiranagar...")}
                  className="p-4 bg-section hover:bg-card border border-border rounded-card text-left space-y-1 transition-all group shadow-sm hover:border-success"
                >
                  <div className="w-8 h-8 rounded bg-success-light text-success flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Truck className="w-4 h-4" />
                  </div>
                  <strong className="text-xs text-header block font-serif">Dispatch Ambulance</strong>
                  <span className="text-[11px] text-success block font-mono font-medium">RED.Health (8 min ETA)</span>
                </button>

                {/* Action 3: Book ER Triage */}
                <button
                  onClick={() => handleAction("reserve_er", "Notifying Apollo Hospital Indiranagar Emergency Room (12 min wait)...")}
                  className="p-4 bg-section hover:bg-card border border-border rounded-card text-left space-y-1 transition-all group shadow-sm hover:border-accent"
                >
                  <div className="w-8 h-8 rounded bg-accent-light text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <strong className="text-xs text-header block font-serif">Reserve Apollo ER</strong>
                  <span className="text-[11px] text-text-muted block font-mono">12m triage queue</span>
                </button>

                {/* Action 4: Share to WhatsApp */}
                <button
                  onClick={() => handleAction("whatsapp", "Incident brief and map link copied to clipboard for Family WhatsApp Group.")}
                  className="p-4 bg-section hover:bg-card border border-border rounded-card text-left space-y-1 transition-all group shadow-sm hover:border-header"
                >
                  <div className="w-8 h-8 rounded bg-section text-header flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Share2 className="w-4 h-4 text-header" />
                  </div>
                  <strong className="text-xs text-header block font-serif">Family WhatsApp</strong>
                  <span className="text-[11px] text-text-muted block">Share incident card to group</span>
                </button>
              </div>
            </div>

            {/* Anita's Live Medication Cabinet Audit */}
            <div className="bg-card border border-border rounded-card p-6 shadow-editorial space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-header">
                    Anita's Medication Cabinet (TinyFish Monitored Daily)
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Automatically checked against Central Drugs Standard Control Organisation (CDSCO) safety notices.
                  </p>
                </div>
                <span className="text-xs font-mono text-warning font-semibold bg-warning-light px-2.5 py-1 rounded border border-warning/30">
                  1 Recall Warning
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-warning-light/50 border border-warning/40 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-header font-mono">Losartan 50mg</strong>
                    <span className="text-[10px] font-bold text-error bg-error-light px-1.5 py-0.2 rounded">RECALLED</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-snug">
                    CDSCO advisory (Oct 14) for Batch LT-8842: trace impurities causing sudden orthostatic hypotension (blood pressure drop upon standing).
                  </p>
                  <span className="text-[10px] text-accent block font-mono">Action: Consult Dr. Rao for substitute</span>
                </div>

                <div className="p-3 bg-bg border border-border rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-header font-mono">Atorvastatin 10mg</strong>
                    <span className="text-[10px] font-bold text-success bg-success-light px-1.5 py-0.2 rounded">SAFE</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-snug">
                    Cholesterol control. Batch verified compliant with no active regulatory advisories.
                  </p>
                </div>

                <div className="p-3 bg-bg border border-border rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-header font-mono">Metformin 500mg</strong>
                    <span className="text-[10px] font-bold text-success bg-success-light px-1.5 py-0.2 rounded">SAFE</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-snug">
                    Blood sugar management. Batch verified compliant with no active regulatory advisories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
