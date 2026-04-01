import { NextRequest, NextResponse } from "next/server";
import { getOverview } from "@/lib/ga4";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") || "7daysAgo";
  const endDate = searchParams.get("endDate") || "today";

  try {
    const data = await getOverview(startDate, endDate);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GA4 overview error:", error);
    return NextResponse.json({ error: "Failed to fetch overview" }, { status: 500 });
  }
}
