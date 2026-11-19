import { NextRequest, NextResponse } from "next/server";
import { updateSubmissionDecision } from "@/lib/intake-store";
import type { SubmissionStatus } from "@/lib/intake-types";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES: SubmissionStatus[] = [
  "received",
  "processing",
  "ready_for_review",
  "needs_improvement",
  "rejected",
  "reference_only",
];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ submissionId: string }> }
) {
  const { submissionId } = await context.params;
  let body: {
    submission_status?: SubmissionStatus;
    reviewer_notes?: string;
    action?:
      | "approve_all_pending"
      | "reject_submission"
      | "reference_only"
      | "request_improvements";
    reviewer?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const status = body.submission_status;
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { ok: false, error: "Invalid submission_status value." },
      { status: 400 }
    );
  }

  const result = updateSubmissionDecision({
    submissionId: decodeURIComponent(submissionId),
    submission_status: status,
    reviewer_notes: body.reviewer_notes,
    action: body.action,
    reviewer: body.reviewer,
  });

  if (!result.submission) {
    return NextResponse.json(
      { ok: false, error: "Submission not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    submission: result.submission,
    updated_skills: result.updated_skills,
  });
}
