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
import { ShieldCheck, ArrowLeft, Activity, Bell } from "lucide-react";

const INITIAL_PROFILE: IParentProfile = {
  name: "Anita",
  age: 72,
  address: "Indiranagar, Bangalore",
  pincode: "560038",
  medications: ["Losartan 50mg", "Atorvastatin 10mg", "Metformin 500mg"],
  voiceStatus: "im_okay",
};

export default function MonitorPage() {
  const [profile, setProfile] = useState<IParentProfile>(INITIAL_PROFILE);
  const [currentPose, setCurrentPose] = useState<PoseFrame | null>(null);
  const [fallEvent, setFallEvent] = useState<FallEvent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");

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
      }
    } catch (err) {
      console.error("Enrichment fetch error:", err);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSimulateFall = () => {
    if (clientRef.current) {
      clientRef.current.triggerFallSimulation();
    }
  };

  const handleResetPosture = () => {
    if (clientRef.current) {
      clientRef.current.resetPosture();
    }
    setFallEvent(null);
    setHospitalEr(undefined);
    setDrugRecalls(undefined);
    setAmbulance(undefined);
    setWeather(undefined);
    setSynthesizedAlert(null);
  };

  const handleSendSMS = async (smsText: string) => {
    const res = await fetch("/api/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ smsText }),
    });
    return await res.json();
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b border-border bg-card px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </Link>
          <div className="h-4 w-[1px] bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-header tracking-tight">
              ElderSteady<span className="text-accent text-base">.private</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warning-light text-warning border border-warning/30 font-semibold">
              DEMO MODE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-muted bg-section px-3 py-1.5 rounded-card border border-border">
            <Activity className="w-3.5 h-3.5 text-success" />
            <span>Target: SiMa Modalix MLA (8ms / frame)</span>
          </div>

          <Link
            href="/alerts/demo"
            className="px-3 py-1.5 text-xs font-mono rounded-btn border border-border bg-card hover:bg-section transition-colors flex items-center gap-1.5 text-text-muted hover:text-text"
          >
            <Bell className="w-3.5 h-3.5 text-accent" />
            <span className="hidden md:inline">Alert History</span>
          </Link>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] w-full mx-auto">
        {/* Left Panel: 60% Width (Pose Canvas & Real-time Telemetry) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <PoseCanvas
            currentPose={currentPose}
            connectionStatus={connectionStatus}
            onSimulateFall={handleSimulateFall}
            onResetPosture={handleResetPosture}
          />

          {/* Privacy Receipt Panel (Prominently displayed) */}
          <FallReceipt fallEvent={fallEvent} />
        </section>

        {/* Right Panel: 40% Width (Parent Profile, TinyFish Enrichment, Synthesized Alert) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
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

          <FamilyAlertCard alert={synthesizedAlert} onSendSMS={handleSendSMS} />
        </section>
      </main>
    </div>
  );
}
