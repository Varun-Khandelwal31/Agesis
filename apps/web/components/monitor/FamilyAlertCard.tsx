"use client";

import React, { useState } from "react";
import { SynthesizedAlert } from "@eldersteady/shared-types";
import { Send, CheckCircle2, MessageSquare, AlertCircle, ShieldAlert, Sparkles, Loader2 } from "lucide-react";

interface FamilyAlertCardProps {
  alert: SynthesizedAlert | null;
  onSendSMS: (smsText: string) => Promise<any>;
}

export function FamilyAlertCard({ alert, onSendSMS }: FamilyAlertCardProps) {
  const [sending, setSending] = useState(false);
  const [sentResult, setSentResult] = useState<{
    status: "sent" | "simulated" | "failed";
    messageId?: string;
    recipient?: string;
  } | null>(null);

  if (!alert) {
    return (
      <div className="bg-card border border-border border-dashed rounded-card p-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-section mx-auto flex items-center justify-center text-text-muted">
          <MessageSquare className="w-5 h-5 text-accent" />
        </div>
        <h4 className="text-sm font-semibold text-text font-serif">Family Alert Synthesizer</h4>
        <p className="text-xs text-text-muted max-w-xs mx-auto">
          When a fall is verified, Claude Sonnet 4 synthesizes pose telemetry and 4x TinyFish context into a calm, actionable family SMS.
        </p>
      </div>
    );
  }

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await onSendSMS(alert.smsText);
      setSentResult({
        status: res.status || "sent",
        messageId: res.messageId,
        recipient: res.recipient,
      });
    } catch {
      setSentResult({ status: "failed" });
    } finally {
      setSending(false);
    }
  };

  const isHighPriority = alert.priority === "high";

  return (
    <div className="bg-card border border-border rounded-card p-5 shadow-editorial space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-header">
            Synthesized Family Incident Alert
          </h3>
        </div>
        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
            isHighPriority
              ? "bg-error-light text-error border-error/30"
              : "bg-warning-light text-warning border-warning/30"
          }`}
        >
          {alert.priority} Priority
        </span>
      </div>

      {/* Structured Context Card */}
      <div className="bg-bg border border-border rounded p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>Incident: {new Date(alert.fallTimestamp).toLocaleTimeString()}</span>
          <span>Voice: {alert.parentProfile.voiceStatus === "im_okay" ? "Mom: 'I'm okay'" : "Unresponsive"}</span>
        </div>
        <p className="text-text leading-relaxed font-sans">{alert.contextCard}</p>
      </div>

      {/* Recommended Action */}
      <div className="bg-section border border-border/80 rounded p-3 space-y-1">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          Recommended Action:
        </span>
        <p className="text-xs text-text font-medium leading-normal">{alert.recommendedAction}</p>
      </div>

      {/* SMS Body Preview (< 180 Characters) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider font-semibold">
            Family SMS Dispatch Preview ({alert.smsText.length}/180 chars):
          </label>
          <span className="text-[10px] font-mono text-accent">GSM 7-bit Safe</span>
        </div>
        <div className="p-3 bg-header text-card rounded font-mono text-xs border border-header/40 leading-relaxed relative">
          "{alert.smsText}"
        </div>
      </div>

      {/* Send SMS Action */}
      <div className="pt-1 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-text-muted">
          Recipient: <strong className="text-text">{process.env.FAMILY_PHONE || "+91 98765 43210"}</strong>
        </div>

        {sentResult ? (
          <div className="flex items-center gap-2 text-xs font-mono text-success bg-success-light px-3 py-1.5 rounded border border-success/40">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {sentResult.status === "sent" ? "SMS Dispatched via Twilio" : "Simulated Delivery (Demo)"}
            </span>
          </div>
        ) : (
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-bg text-xs font-mono font-medium rounded-btn transition-colors shadow-editorial flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{sending ? "Dispatching..." : "Send SMS to Family"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
