import { NextResponse } from "next/server";
import { getRealtime } from "@/lib/ga4";

export async function GET() {
  try {
    const data = await getRealtime();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GA4 realtime error:", error);
    return NextResponse.json({ error: "Failed to fetch realtime" }, { status: 500 });
  }
}
