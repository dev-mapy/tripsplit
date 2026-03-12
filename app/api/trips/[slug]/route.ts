import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Traveler, Expense } from "@/types";

// GET /api/trips/[slug] — fetch a trip by slug (public)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const trip = await prisma.savedTrip.findUnique({
      where: { slug },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: trip.id,
      slug: trip.slug,
      name: trip.name,
      currencyCode: trip.currencyCode,
      travelers: trip.travelers as unknown as Traveler[],
      expenses: trip.expenses as unknown as Expense[],
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    });
  } catch (error) {
    console.error("GET /api/trips/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

// PATCH /api/trips/[slug] — update a trip (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    // Confirm ownership
    const existing = await prisma.savedTrip.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updated = await prisma.savedTrip.update({
      where: { slug },
      data: {
        name: body.name ?? existing.name,
        currencyCode: body.currencyCode ?? existing.currencyCode,
        travelers: body.travelers ?? existing.travelers,
        expenses: body.expenses ?? existing.expenses,
      },
    });

    return NextResponse.json({
      slug: updated.slug,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    console.error("PATCH /api/trips/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[slug] — delete a trip (owner only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    // Confirm ownership
    const existing = await prisma.savedTrip.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.savedTrip.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/trips/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}
