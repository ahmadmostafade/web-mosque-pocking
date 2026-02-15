import { NextResponse } from "next/server";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";

// Simple in-memory cache for fallback
let cachedTimes: { data: Awaited<ReturnType<typeof fetchPrayerTimes>>; date: string } | null = null;

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const times = await fetchPrayerTimes();

  if (times) {
    cachedTimes = { data: times, date: today };
    const nextPrayer = getNextPrayer(times);
    return NextResponse.json({ times, nextPrayer, cached: false });
  }

  // Fallback to cached times
  if (cachedTimes) {
    const nextPrayer = cachedTimes.data ? getNextPrayer(cachedTimes.data) : null;
    return NextResponse.json({
      times: cachedTimes.data,
      nextPrayer,
      cached: true,
      cachedDate: cachedTimes.date,
    });
  }

  return NextResponse.json(
    { error: "Gebetszeiten konnten nicht geladen werden." },
    { status: 503 }
  );
}
