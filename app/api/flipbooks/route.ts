import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { coverImageFromPagesData, flipbookSummaryFromDb } from "@/lib/flipbook-db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.flipbook.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      sourceType: true,
      pageCount: true,
      coverImage: true,
      pagesData: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(
    records.map((record) => {
      const summary = flipbookSummaryFromDb(record);
      const coverImage = coverImageFromPagesData(record.pagesData, record.coverImage);
      return { ...summary, coverImage };
    })
  );
}
