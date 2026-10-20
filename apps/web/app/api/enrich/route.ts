import { NextResponse } from "next/server";
import { ParentProfile, FallEvent } from "@eldersteady/shared-types";
import { orchestrateTinyFishEnrichment } from "@/lib/enrichment/orchestrator";
import { synthesizeFamilyAlert } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parentProfile: ParentProfile = body.parentProfile || {
      name: process.env.PARENT_NAME || "Anita",
      age: Number(process.env.PARENT_AGE) || 72,
      address: process.env.PARENT_ADDRESS || "Indiranagar, Bangalore",
      pincode: process.env.PARENT_PINCODE || "560038",
      medications: (process.env.PARENT_MEDICATIONS || "Losartan 50mg,Atorvastatin 10mg,Metformin 500mg").split(","),
      voiceStatus: body.voiceStatus || "im_okay",
    };

    const fallEvent: FallEvent = body.fallEvent || {
      type: "fall_event",
      timestamp: new Date().toISOString(),
      hip_angle_at_impact: 18.2,
      duration_on_floor_s: 3.2,
      video_bytes_processed: 3520000,
      context_bytes_emitted: 11264,
      receipt_ratio: "1 : 303",
    };

    // 1. Run 4 TinyFish fetches in parallel
    const enrichmentResult = await orchestrateTinyFishEnrichment(parentProfile);

    // 2. Synthesize alert via Claude Sonnet (or deterministic fallback)
    const synthesis = await synthesizeFamilyAlert({
      parent: parentProfile,
      fallEvent,
      hospitalEr: enrichmentResult.hospitalEr.data,
      drugRecalls: enrichmentResult.drugRecalls.data,
      ambulance: enrichmentResult.ambulance.data,
      weather: enrichmentResult.weather.data,
    });

    const alertId = `alert_${Date.now()}`;

    return NextResponse.json({
      success: true,
      alertId,
      fallTimestamp: fallEvent.timestamp,
      enrichment: {
        hospitalEr: enrichmentResult.hospitalEr,
        drugRecalls: enrichmentResult.drugRecalls,
        ambulance: enrichmentResult.ambulance,
        weather: enrichmentResult.weather,
        totalLatencyMs: enrichmentResult.totalLatencyMs,
        totalContextBytes: enrichmentResult.totalContextBytes,
      },
      synthesis,
      fallEvent,
      parentProfile,
    });
  } catch (error: any) {
    console.error("[Enrichment API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Enrichment orchestration failed" },
      { status: 500 }
    );
  }
}
