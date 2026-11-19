import { NextRequest, NextResponse } from "next/server";
import { updateProposedSkillRecord } from "@/lib/intake-store";
import type { PublishingStatus, SkillApprovalStatus } from "@/lib/intake-types";

export const dynamic = "force-dynamic";

const ALLOWED_APPROVALS: SkillApprovalStatus[] = [
  "pending",
  "approved",
  "rejected",
];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ recordId: string }> }
) {
  const { recordId } = await context.params;
  let body: {
    status?: SkillApprovalStatus;
    reviewer?: string;
    decision_note?: string;
    promoteToLibrary?: boolean;
    publishing?: {
      status?: PublishingStatus;
      repository?: string;
      branch?: string;
      target_path?: string;
      commit_sha?: string | null;
      github_url?: string | null;
      published_at?: string | null;
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (body.status && !ALLOWED_APPROVALS.includes(body.status)) {
    return NextResponse.json(
      { ok: false, error: "Invalid skill approval status." },
      { status: 400 }
    );
  }

  const updated = updateProposedSkillRecord({
    recordId: decodeURIComponent(recordId),
    status: body.status,
    reviewer: body.reviewer,
    decision_note: body.decision_note,
    publishing: body.publishing,
    promoteToLibrary: body.promoteToLibrary,
  });

  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Proposed skill record not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, skill: updated });
}
