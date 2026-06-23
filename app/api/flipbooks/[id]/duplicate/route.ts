import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { flipbookFromStored } from "@/lib/flipbook-db";
import { getStoredFlipbook, saveStoredFlipbook } from "@/lib/storage/flipbook-store";
import { generateId } from "@/lib/utils/generateId";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const stored = await getStoredFlipbook(id);

  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const original = flipbookFromStored(stored);
  const newId = generateId();
  const now = new Date().toISOString();

  await saveStoredFlipbook({
    ...stored,
    id: newId,
    title: `${original.title} (Copy)`,
    status: "draft",
    analytics: { ...original.analytics, views: 0, uniqueViewers: 0 },
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ id: newId });
}
