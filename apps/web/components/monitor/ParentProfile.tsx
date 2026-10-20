"use client";

import React from "react";
import { ParentProfile as IParentProfile } from "@eldersteady/shared-types";
import { User, MapPin, Pill, CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react";

interface ParentProfileProps {
  profile: IParentProfile;
  onVoiceStatusChange: (status: "im_okay" | "needs_help" | "no_response") => void;
}

export function ParentProfile({ profile, onVoiceStatusChange }: ParentProfileProps) {
  return (
    <div className="bg-card border border-border rounded-card p-4 shadow-editorial space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent-light text-header flex items-center justify-center font-serif font-bold text-sm">
            {profile.name[0]}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text font-serif leading-none">
              {profile.name}, {profile.age} yrs
            </h3>
            <span className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5 font-sans">
              <MapPin className="w-3 h-3 text-accent" />
              {profile.address} ({profile.pincode})
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg border border-border text-text-muted">
          DEMO PROFILE
        </span>
      </div>

      {/* Medications */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-header">
          <Pill className="w-3.5 h-3.5 text-accent" />
          <span>Active Medications (TinyFish Monitored):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {profile.medications.map((med, idx) => {
            const isLosartan = med.toLowerCase().includes("losartan");
            return (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded border font-mono ${
                  isLosartan
                    ? "bg-warning-light text-warning border-warning/40 font-semibold"
                    : "bg-bg text-text-muted border-border"
                }`}
                title={isLosartan ? "Subject to CDSCO safety recall alert" : undefined}
              >
                {med} {isLosartan && "⚠️"}
              </span>
            );
          })}
        </div>
      </div>

      {/* Voice Check Simulator (Anti-feature compliant) */}
      <div className="pt-2 border-t border-border space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-header flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>Simulated Voice Response:</span>
          </label>
          <span className="text-[10px] text-text-muted">Interactive Demo</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onVoiceStatusChange("im_okay")}
            className={`py-1.5 px-2 rounded-btn text-xs font-mono font-medium border flex items-center justify-center gap-1 transition-all ${
              profile.voiceStatus === "im_okay"
                ? "bg-success text-white border-success shadow-sm"
                : "bg-bg text-text-muted hover:text-text border-border"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>"I'm okay"</span>
          </button>

          <button
            type="button"
            onClick={() => onVoiceStatusChange("needs_help")}
            className={`py-1.5 px-2 rounded-btn text-xs font-mono font-medium border flex items-center justify-center gap-1 transition-all ${
              profile.voiceStatus === "needs_help"
                ? "bg-error text-white border-error shadow-sm"
                : "bg-bg text-text-muted hover:text-text border-border"
            }`}
          >
            <AlertOctagon className="w-3 h-3" />
            <span>"Need Help"</span>
          </button>

          <button
            type="button"
            onClick={() => onVoiceStatusChange("no_response")}
            className={`py-1.5 px-2 rounded-btn text-xs font-mono font-medium border flex items-center justify-center gap-1 transition-all ${
              profile.voiceStatus === "no_response"
                ? "bg-header text-white border-header shadow-sm"
                : "bg-bg text-text-muted hover:text-text border-border"
            }`}
          >
            <span>No Answer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
