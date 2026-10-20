import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      type: payload.type || "pose_telemetry",
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}
