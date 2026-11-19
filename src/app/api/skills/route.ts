import { NextRequest, NextResponse } from "next/server";
import { createSkillInDb, duplicateSkillInDb } from "@/lib/db";
import type { SkillItem } from "@/lib/skills-data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    action?: "create" | "duplicate";
    sourceSkillId?: string;
    draft?: Omit<SkillItem, "id" | "created_at" | "updated_at" | "versions">;
    versionNote?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (body.action === "duplicate" && body.sourceSkillId) {
    const duplicated = duplicateSkillInDb(body.sourceSkillId);
    if (!duplicated) {
      return NextResponse.json(
        { ok: false, error: "Source skill not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, skill: duplicated }, { status: 201 });
  }

  if (!body.draft || !body.draft.title?.trim() || !body.draft.content_markdown?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Skill title and Markdown content are required." },
      { status: 400 }
    );
  }

  const created = createSkillInDb(body.draft, body.versionNote);
  return NextResponse.json({ ok: true, skill: created }, { status: 201 });
}
