import { NextResponse } from "next/server";
import { sendFamilySMS } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { smsText, phone } = body;

    if (!smsText) {
      return NextResponse.json(
        { success: false, error: "smsText is required" },
        { status: 400 }
      );
    }

    const result = await sendFamilySMS(smsText, phone);

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      status: result.status,
      recipient: result.to,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Alert API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to dispatch family alert" },
      { status: 500 }
    );
  }
}
