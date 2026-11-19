import { NextRequest, NextResponse } from "next/server";
import {
  createSubmissionRecords,
  getIntegrationConfigStatus,
  logIntakeError,
  readIntakeStore,
  updateProposedSkillRecord,
  verifyIntakeToken,
} from "@/lib/intake-store";
import type { PublishingStatus, SkillApprovalStatus } from "@/lib/intake-types";
import { validateIntakePayload } from "@/lib/intake-validation";

export const dynamic = "force-dynamic";

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  const headerToken = req.headers.get("x-intake-token");
  return headerToken ? headerToken.trim() : null;
}

export async function GET() {
  const store = readIntakeStore();
  return NextResponse.json({
    ...store,
    config: getIntegrationConfigStatus(),
  });
}

export async function POST(req: NextRequest) {
  const config = getIntegrationConfigStatus();

  if (!config.intakeAuthConfigured) {
    const err = logIntakeError({
      status_code: 503,
      reason:
        "External intake rejected: EDIT_CENTRAL_INTAKE_TOKEN is not configured on the server.",
    });
    return NextResponse.json(
      {
        ok: false,
        code: "INTAKE_NOT_CONFIGURED",
        error: err.reason,
        error_id: err.id,
      },
      { status: 503 }
    );
  }

  const token = extractBearerToken(req);
  if (!verifyIntakeToken(token)) {
    const err = logIntakeError({
      status_code: 401,
      reason: "Unauthorized intake request: missing or invalid Bearer token.",
    });
    return NextResponse.json(
      {
        ok: false,
        code: "UNAUTHORIZED",
        error: err.reason,
        error_id: err.id,
      },
      { status: 401 }
    );
  }

  let rawText = "";
  let parsedBody: unknown;
  try {
    rawText = await req.text();
    parsedBody = JSON.parse(rawText);
  } catch {
    const err = logIntakeError({
      status_code: 400,
      reason: "Invalid JSON payload.",
      raw_excerpt: rawText,
    });
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_JSON",
        error: err.reason,
        error_id: err.id,
      },
      { status: 400 }
    );
  }

  const validation = validateIntakePayload(parsedBody);
  const rawObj =
    typeof parsedBody === "object" && parsedBody !== null
      ? (parsedBody as Record<string, unknown>)
      : {};
  const maybeSubmissionId =
    typeof rawObj.submission_id === "string" ? rawObj.submission_id : null;
  const maybeOrigin =
    typeof rawObj.origin === "object" &&
    rawObj.origin !== null &&
    typeof (rawObj.origin as Record<string, unknown>).platform === "string"
      ? ((rawObj.origin as Record<string, unknown>).platform as string)
      : null;

  if (!validation.valid || !validation.payload) {
    const err = logIntakeError({
      status_code: 422,
      reason: "Payload validation failed.",
      submission_id: maybeSubmissionId,
      origin_platform: maybeOrigin,
      details: validation.errors,
      raw_excerpt: rawText,
    });
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        error: "Submitted JSON did not match the Edit Central intake contract.",
        details: validation.errors,
        error_id: err.id,
      },
      { status: 422 }
    );
  }

  const created = createSubmissionRecords(validation.payload, parsedBody);
  if (!created.ok) {
    const err = logIntakeError({
      status_code: 409,
      reason: `Duplicate submission_id "${validation.payload.submission_id}".`,
      submission_id: validation.payload.submission_id,
      origin_platform: validation.payload.origin.platform,
    });
    return NextResponse.json(
      {
        ok: false,
        code: "DUPLICATE_SUBMISSION",
        error: err.reason,
        submission_id: validation.payload.submission_id,
        error_id: err.id,
      },
      { status: 409 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      submission_id: created.submission.submission_id,
      submission_record_id: created.submission.id,
      submission_status: created.submission.submission_status,
      resource_id: created.resource_id,
      proposed_skill_count: created.skills.length,
      proposed_skills: created.skills.map((s) => ({
        record_id: s.id,
        skill_id: s.skill_id,
        name: s.name,
        slug: s.slug,
        approval_status: s.approval.status,
        publishing_status: s.publishing.status,
        linked_skill_id: s.linked_skill_id,
      })),
    },
    { status: 201 }
  );
}

export async function PATCH(req: NextRequest) {
  const config = getIntegrationConfigStatus();
  if (!config.intakeAuthConfigured) {
    return NextResponse.json(
      {
        ok: false,
        code: "INTAKE_NOT_CONFIGURED",
        error: "EDIT_CENTRAL_INTAKE_TOKEN is not configured on the server.",
      },
      { status: 503 }
    );
  }

  const token = extractBearerToken(req);
  if (!verifyIntakeToken(token)) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNAUTHORIZED",
        error: "Missing or invalid Bearer token.",
      },
      { status: 401 }
    );
  }

  let body: {
    record_id?: string;
    skill_id?: string;
    approval?: {
      status?: SkillApprovalStatus;
      approved_by?: string;
      decision_note?: string;
    };
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

  const lookupId = body.record_id || body.skill_id;
  if (!lookupId) {
    return NextResponse.json(
      { ok: false, error: "Provide record_id or skill_id to update." },
      { status: 400 }
    );
  }

  const updated = updateProposedSkillRecord({
    recordId: lookupId,
    status: body.approval?.status,
    reviewer: body.approval?.approved_by,
    decision_note: body.approval?.decision_note,
    publishing: body.publishing,
  });

  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Proposed skill record not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    skill: updated,
  });
}
