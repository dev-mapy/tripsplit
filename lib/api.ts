import type { SaveTripPayload, SavedTrip } from "@/types";

const BASE = "/api/trips";

export async function saveTrip(
  payload: SaveTripPayload
): Promise<{ slug: string; url: string }> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to save trip");
  }

  return res.json();
}

export async function fetchUserTrips(): Promise<SavedTrip[]> {
  const res = await fetch(BASE);

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to fetch trips");
  }

  const { trips } = await res.json();
  return trips;
}

export async function fetchTripCount(): Promise<{
  count: number;
  limit: number;
  remaining: number;
}> {
  const res = await fetch(`${BASE}/count`);

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to fetch trip count");
  }

  return res.json();
}

export async function fetchTripBySlug(
  slug: string
): Promise<SavedTrip | null> {
  const res = await fetch(`${BASE}/${slug}`);

  if (res.status === 404) return null;

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to fetch trip");
  }

  return res.json();
}

export async function updateTrip(
  slug: string,
  payload: Partial<SaveTripPayload>
): Promise<{ slug: string; updatedAt: string }> {
  const res = await fetch(`${BASE}/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to update trip");
  }

  return res.json();
}

export async function deleteTrip(slug: string): Promise<void> {
  const res = await fetch(`${BASE}/${slug}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to delete trip");
  }
}
