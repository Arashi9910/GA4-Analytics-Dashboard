import { NextRequest, NextResponse } from "next/server";
import { getSources } from "@/lib/ga4";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") || "7daysAgo";
  const endDate = searchParams.get("endDate") || "today";

  try {
    const data = await getSources(startDate, endDate);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GA4 sources error:", error);
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 });
  }
}
