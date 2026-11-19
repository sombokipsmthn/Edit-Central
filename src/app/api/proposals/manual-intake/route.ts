import { NextRequest, NextResponse } from "next/server";
import {
  createSubmissionRecords,
  logIntakeError,
} from "@/lib/intake-store";
import { validateIntakePayload } from "@/lib/intake-validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let rawText = "";
  let parsedBody: unknown;
  try {
    rawText = await req.text();
    parsedBody = JSON.parse(rawText);
  } catch {
    const err = logIntakeError({
      status_code: 400,
      reason: "Manual JSON submission contained invalid JSON syntax.",
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
      reason: "Manual submission validation failed.",
      submission_id: maybeSubmissionId,
      origin_platform: maybeOrigin,
      details: validation.errors,
      raw_excerpt: rawText,
    });
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        error: "JSON did not satisfy required intake fields.",
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
        error_id: err.id,
      },
      { status: 409 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      submission: created.submission,
      skills: created.skills,
    },
    { status: 201 }
  );
}
