import { NextRequest, NextResponse } from "next/server";
import { getFunnel } from "@/lib/ga4";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") || "7daysAgo";
  const endDate = searchParams.get("endDate") || "today";

  try {
    const data = await getFunnel(startDate, endDate);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GA4 funnel error:", error);
    return NextResponse.json({ error: "Failed to fetch funnel" }, { status: 500 });
  }
}
