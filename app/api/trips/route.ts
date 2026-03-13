import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, uniqueSlug } from "@/lib/utils";
import { MAX_FREE_TRIPS } from "@/lib/constants";
import type { SaveTripPayload } from "@/types";

// POST /api/trips — save a new trip
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
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

    const body: SaveTripPayload = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Trip name is required" },
        { status: 400 }
      );
    }

    if (!body.travelers?.length || body.travelers.length < 2) {
      return NextResponse.json(
        { error: "At least 2 travelers are required" },
        { status: 400 }
      );
    }

    // Enforce trip limit
    const tripCount = await prisma.savedTrip.count({
      where: { userId: user.id },
    });

    if (tripCount >= MAX_FREE_TRIPS) {
      return NextResponse.json(
        { error: `You have reached the limit of ${MAX_FREE_TRIPS} saved trips.` },
        { status: 403 }
      );
    }

    // Generate a unique slug
    const baseSlug = generateSlug(body.name);
    let slug = body.slug?.trim()
      ? generateSlug(body.slug)
      : baseSlug;

    // Check if slug already exists — append suffix if so
    const existing = await prisma.savedTrip.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = uniqueSlug(baseSlug);
    }

    // Save the trip
    const savedTrip = await prisma.savedTrip.create({
      data: {
        slug,
        userId: user.id,
        name: body.name.trim(),
        currencyCode: body.currencyCode,
        travelers: body.travelers as object[],
        expenses: body.expenses as object[],
      },
    });

    return NextResponse.json(
      {
        id: savedTrip.id,
        slug: savedTrip.slug,
        url: `/t/${savedTrip.slug}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json(
      { error: "Failed to save trip" },
      { status: 500 }
    );
  }
}

// GET /api/trips — fetch all trips for the current user
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

    const trips = await prisma.savedTrip.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        currencyCode: true,
        travelers: true,
        expenses: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}
