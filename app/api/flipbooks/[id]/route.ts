import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flipbookFromDb } from "@/lib/flipbook-db";
import { processSettingsForSave } from "@/lib/flipbook-settings-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const record = await prisma.flipbook.findFirst({
    where: { id, userId: user.id },
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(flipbookFromDb(record));
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
    const existing = await prisma.flipbook.findFirst({
      where: { id, userId: user.id },
      select: { settings: true },
    });

    const settings = await processSettingsForSave(body.settings || {}, existing?.settings);

    const data = {
      title: body.title,
      description: body.description || "",
      sourceType: body.sourceType,
      originalFileName: body.originalFileName || null,
      sourceUrl: body.sourceUrl || null,
      pageCount: body.pageCount,
      coverImage: body.coverImage || null,
      status: body.status || "draft",
      settings: JSON.stringify(settings),
      analytics: JSON.stringify(body.analytics),
      hotspots: JSON.stringify(body.hotspots || []),
      pagesData: JSON.stringify(body.pages),
      originalFileData: body.originalFileData || null,
      updatedAt: new Date(),
    };

    await prisma.flipbook.upsert({
      where: { id },
      create: {
        id,
        userId: user.id,
        ...data,
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
      },
      update: data,
    });

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
  const record = await prisma.flipbook.findFirst({
    where: { id, userId: user.id },
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.flipbook.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
