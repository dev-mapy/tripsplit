import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { MAX_FREE_TRIPS } from "@/lib/constants";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const count = await prisma.savedTrip.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      count,
      limit: MAX_FREE_TRIPS,
      remaining: Math.max(0, MAX_FREE_TRIPS - count),
    });
  } catch (error) {
    console.error("GET /api/trips/count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip count" },
      { status: 500 }
    );
  }
}
