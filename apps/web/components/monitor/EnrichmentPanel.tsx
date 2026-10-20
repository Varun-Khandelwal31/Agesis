"use client";

import React from "react";
import { HospitalERResult, DrugRecallItem, AmbulanceService, WeatherSlipRisk } from "@eldersteady/shared-types";
import { Building2, AlertTriangle, Truck, CloudRain, CheckCircle, Loader2, ExternalLink } from "lucide-react";

interface EnrichmentPanelProps {
  isEnriching: boolean;
  hospitalEr?: HospitalERResult;
  drugRecalls?: DrugRecallItem[];
  ambulance?: AmbulanceService[];
  weather?: WeatherSlipRisk;
  latencies?: {
    hospital?: number;
    recalls?: number;
    ambulance?: number;
    weather?: number;
    total?: number;
  };
}

export function EnrichmentPanel({
  isEnriching,
  hospitalEr,
  drugRecalls,
  ambulance,
  weather,
  latencies,
}: EnrichmentPanelProps) {
  const topAmbulance = ambulance?.[0];
  const recalledMeds = drugRecalls?.filter((r) => r.recalled) ?? [];

  return (
    <div className="bg-card border border-border rounded-card p-4 shadow-editorial space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-header">
            TinyFish Live-Context Enrichment (Parallel 4x)
          </h3>
        </div>
        {latencies?.total && (
          <span className="text-[11px] font-mono text-success font-medium">
            ⚡ {latencies.total}ms total latency
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Card 1: Hospital ER Status */}
        <div className="bg-bg border border-border rounded p-3 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-header flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span>Hospital ER Queue</span>
            </span>
            {isEnriching && !hospitalEr ? (
              <Loader2 className="w-3 h-3 text-accent animate-spin" />
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-success-light text-success font-medium flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />
                {latencies?.hospital ? `${latencies.hospital}ms` : "Done"}
              </span>
            )}
          </div>

          <div className="text-xs">
            {hospitalEr ? (
              <div>
                <p className="font-semibold text-text">{hospitalEr.hospitalName}</p>
                <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
                  <span className="text-error font-bold text-sm">{hospitalEr.waitMinutes} min</span>
                  <span className="text-text-muted">wait ({hospitalEr.distanceKm} km away)</span>
                </div>
                {hospitalEr.isEstimated && (
                  <span className="text-[10px] text-text-muted italic block mt-0.5">
                    (Estimated from live census)
                  </span>
                )}
              </div>
            ) : (
              <span className="text-text-muted font-mono text-[11px]">Querying emergency wait times...</span>
            )}
          </div>

          {hospitalEr && (
            <a
              href={hospitalEr.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-accent hover:underline flex items-center gap-1 pt-1 border-t border-border/50"
            >
              <span>Source: Apollo ER Status</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Card 2: CDSCO Drug Recalls */}
        <div className="bg-bg border border-border rounded p-3 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-header flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              <span>CDSCO Recall Check</span>
            </span>
            {isEnriching && !drugRecalls ? (
              <Loader2 className="w-3 h-3 text-accent animate-spin" />
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-warning-light text-warning font-medium flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />
                {latencies?.recalls ? `${latencies.recalls}ms` : "Done"}
              </span>
            )}
          </div>

          <div className="text-xs">
            {drugRecalls ? (
              recalledMeds.length > 0 ? (
                <div>
                  <p className="font-bold text-error flex items-center gap-1">
                    ⚠️ {recalledMeds[0].medication}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                    CDSCO Batch Recall: {recalledMeds[0].reason}
                  </p>
                </div>
              ) : (
                <p className="text-success text-[11px] font-medium">
                  ✓ All parent prescriptions verified. No active recalls.
                </p>
              )
            ) : (
              <span className="text-text-muted font-mono text-[11px]">Searching CDSCO safety advisories...</span>
            )}
          </div>

          {drugRecalls && (
            <a
              href={drugRecalls[0]?.sourceUrl || "https://cdsco.gov.in"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-accent hover:underline flex items-center gap-1 pt-1 border-t border-border/50"
            >
              <span>Source: CDSCO Alerts Portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Card 3: Local Ambulance Dispatch */}
        <div className="bg-bg border border-border rounded p-3 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-header flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-accent" />
              <span>Ambulance Services</span>
            </span>
            {isEnriching && !ambulance ? (
              <Loader2 className="w-3 h-3 text-accent animate-spin" />
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-success-light text-success font-medium flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />
                {latencies?.ambulance ? `${latencies.ambulance}ms` : "Done"}
              </span>
            )}
          </div>

          <div className="text-xs">
            {topAmbulance ? (
              <div>
                <p className="font-semibold text-text">{topAmbulance.name}</p>
                <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
                  <span className="text-success font-bold text-sm">ETA {topAmbulance.etaMinutes}m</span>
                  <span className="text-text-muted">({topAmbulance.type} equip)</span>
                </div>
                <span className="text-[10px] font-mono text-accent block mt-0.5">
                  Direct: {topAmbulance.phone}
                </span>
              </div>
            ) : (
              <span className="text-text-muted font-mono text-[11px]">Locating closest 24/7 emergency response...</span>
            )}
          </div>

          {topAmbulance && (
            <a
              href={topAmbulance.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-accent hover:underline flex items-center gap-1 pt-1 border-t border-border/50"
            >
              <span>Source: Local Dispatch Registry</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Card 4: Weather & Slip Risk */}
        <div className="bg-bg border border-border rounded p-3 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-header flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-accent" />
              <span>Weather & Slip Risk</span>
            </span>
            {isEnriching && !weather ? (
              <Loader2 className="w-3 h-3 text-accent animate-spin" />
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-success-light text-success font-medium flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />
                {latencies?.weather ? `${latencies.weather}ms` : "Done"}
              </span>
            )}
          </div>

          <div className="text-xs">
            {weather ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-warning font-mono">
                    {weather.slipRiskLevel} Slip Danger
                  </span>
                  <span className="text-text-muted font-mono text-[11px]">({weather.temperatureC}°C)</span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                  {weather.summary}
                </p>
              </div>
            ) : (
              <span className="text-text-muted font-mono text-[11px]">Evaluating ambient moisture and friction...</span>
            )}
          </div>

          {weather && (
            <a
              href={weather.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-accent hover:underline flex items-center gap-1 pt-1 border-t border-border/50"
            >
              <span>Source: Meteorological Station</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
