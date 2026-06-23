import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { flipbookFromDb } from "@/lib/flipbook-db";
import { generateId } from "@/lib/utils/generateId";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
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

  const original = flipbookFromDb(record);
  const newId = generateId();
  const now = new Date();

  await prisma.flipbook.create({
    data: {
      id: newId,
      userId: user.id,
      title: `${original.title} (Copy)`,
      description: original.description || "",
      sourceType: original.sourceType,
      originalFileName: original.originalFileName || null,
      sourceUrl: original.sourceUrl || null,
      pageCount: original.pageCount,
      coverImage: record.coverImage,
      status: "draft",
      settings: record.settings,
      analytics: JSON.stringify({ ...original.analytics, views: 0, uniqueViewers: 0 }),
      hotspots: record.hotspots,
      pagesData: record.pagesData,
      originalFileData: record.originalFileData,
      createdAt: now,
      updatedAt: now,
    },
  });

  return NextResponse.json({ id: newId });
}
