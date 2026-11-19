import { NextRequest, NextResponse } from "next/server";
import { createResourceInDb } from "@/lib/db";
import type { ResourceItem } from "@/lib/skills-data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    draft?: Omit<ResourceItem, "id" | "created_at" | "updated_at">;
    attachToSkillId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.draft || !body.draft.title?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Resource title is required." },
      { status: 400 }
    );
  }

  const created = createResourceInDb(body.draft, body.attachToSkillId);
  return NextResponse.json({ ok: true, resource: created }, { status: 201 });
}
