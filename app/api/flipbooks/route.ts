import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { flipbookSummaryFromStored } from "@/lib/flipbook-db";
import { listStoredFlipbooks } from "@/lib/storage/flipbook-store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await listStoredFlipbooks();
  return NextResponse.json(records.map((record) => flipbookSummaryFromStored(record)));
}
