import { NextRequest, NextResponse } from "next/server";
import {
  deleteSkillInDb,
  restoreSkillVersionInDb,
  toggleSkillResourceInDb,
  updateSkillInDb,
} from "@/lib/db";
import type { SkillItem, SkillVersion } from "@/lib/skills-data";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ skillId: string }> }
) {
  const { skillId } = await context.params;
  const id = decodeURIComponent(skillId);

  let body: {
    action?: "update" | "restore_version" | "toggle_resource";
    updates?: Partial<Omit<SkillItem, "id" | "created_at" | "versions">>;
    options?: { recordVersion?: boolean; versionNote?: string };
    version?: SkillVersion;
    resourceId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  let updated: SkillItem | null = null;
  if (body.action === "restore_version" && body.version) {
    updated = restoreSkillVersionInDb(id, body.version);
  } else if (body.action === "toggle_resource" && body.resourceId) {
    updated = toggleSkillResourceInDb(id, body.resourceId);
  } else if (body.updates) {
    updated = updateSkillInDb(id, body.updates, body.options);
  } else {
    return NextResponse.json(
      { ok: false, error: "Missing skill update payload." },
      { status: 400 }
    );
  }

  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Skill not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, skill: updated });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ skillId: string }> }
) {
  const { skillId } = await context.params;
  const deleted = deleteSkillInDb(decodeURIComponent(skillId));
  if (!deleted) {
    return NextResponse.json(
      { ok: false, error: "Skill not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
