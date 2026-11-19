import { NextRequest, NextResponse } from "next/server";
import { deleteResourceInDb, updateResourceInDb } from "@/lib/db";
import type { ResourceItem } from "@/lib/skills-data";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ resourceId: string }> }
) {
  const { resourceId } = await context.params;
  let body: {
    updates?: Partial<Omit<ResourceItem, "id" | "created_at">>;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.updates) {
    return NextResponse.json(
      { ok: false, error: "Missing resource updates." },
      { status: 400 }
    );
  }

  const updated = updateResourceInDb(
    decodeURIComponent(resourceId),
    body.updates
  );
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Resource not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, resource: updated });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ resourceId: string }> }
) {
  const { resourceId } = await context.params;
  const deleted = deleteResourceInDb(decodeURIComponent(resourceId));
  if (!deleted) {
    return NextResponse.json(
      { ok: false, error: "Resource not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
