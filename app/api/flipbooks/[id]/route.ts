import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { flipbookFromStored, type StoredFlipbook } from "@/lib/flipbook-db";
import { processSettingsForSave } from "@/lib/flipbook-settings-server";
import {
  deleteStoredFlipbook,
  getStoredFlipbook,
  saveStoredFlipbook,
} from "@/lib/storage/flipbook-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const stored = await getStoredFlipbook(id);

  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(flipbookFromStored(stored));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body is too large or invalid" }, { status: 413 });
  }

  try {
    const existing = await getStoredFlipbook(id);
    const settings = await processSettingsForSave(
      body.settings || {},
      existing ? JSON.stringify(existing.settings) : undefined
    );

    const stored: StoredFlipbook = {
      id,
      title: body.title,
      description: body.description || "",
      sourceType: body.sourceType,
      originalFileName: body.originalFileName,
      sourceUrl: body.sourceUrl,
      pageCount: body.pageCount,
      coverImage: body.coverImage,
      status: body.status || "draft",
      settings,
      analytics: body.analytics,
      hotspots: body.hotspots || [],
      pages: body.pages,
      originalFileData: body.originalFileData,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStoredFlipbook(stored);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("Failed to save flipbook:", err);
    const message = err instanceof Error ? err.message : "Failed to save flipbook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await deleteStoredFlipbook(id);

  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
