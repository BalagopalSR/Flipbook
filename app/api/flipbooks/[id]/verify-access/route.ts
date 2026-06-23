import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mergeFlipbookSettings } from "@/lib/flipbook-settings";
import { isFlipbookExpired } from "@/lib/flipbook-access";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const record = await prisma.flipbook.findFirst({
    where: { id, userId: user.id },
    select: { settings: true },
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const settings = mergeFlipbookSettings(JSON.parse(record.settings));

  if (isFlipbookExpired(settings.expiryDate)) {
    return NextResponse.json({ error: "This flipbook has expired" }, { status: 403 });
  }

  if (!settings.passwordProtection) {
    return NextResponse.json({ ok: true });
  }

  if (!settings.accessPasswordHash) {
    return NextResponse.json({ error: "Password protection is not configured" }, { status: 400 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const valid = await verifyPassword(password, settings.accessPasswordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
