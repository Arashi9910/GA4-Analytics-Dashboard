import { type NextRequest, NextResponse } from "next/server";
import { getDevices } from "@/lib/ga4";

export async function GET(req: NextRequest) {
  const startDate = req.nextUrl.searchParams.get("startDate") || "7daysAgo";
  const endDate = req.nextUrl.searchParams.get("endDate") || "today";
  try {
    const data = await getDevices(startDate, endDate);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GA4 devices error:", error);
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 });
  }
}
