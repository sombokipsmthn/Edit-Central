import { NextRequest, NextResponse } from "next/server";
import {
  createResourceLinkSubmission,
  listResourceLinkSubmissions,
  updateResourceLinkSubmission,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || undefined;
  const normalizedStatus = status === "pending" ? "queued" : status;
  const submissions = listResourceLinkSubmissions(normalizedStatus);
  return NextResponse.json({
    ok: true,
    submissions,
    webhookConfigured: Boolean(
      process.env.EDIT_CENTRAL_ASSISTANT_WEBHOOK_URL?.trim()
    ),
  });
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = (await req.json()) as { url?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
  if (!rawUrl) {
    return NextResponse.json(
      { ok: false, error: "Please paste a resource link." },
      { status: 400 }
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Please enter a valid http:// or https:// URL.",
      },
      { status: 400 }
    );
  }

  let submission = createResourceLinkSubmission({ url: parsedUrl.toString() });

  const webhookUrl = process.env.EDIT_CENTRAL_ASSISTANT_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const token = process.env.EDIT_CENTRAL_INTAKE_TOKEN?.trim();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const dispatchRes = await fetch(webhookUrl, {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          event: "resource_link_submitted",
          submission_id: submission.id,
          url: submission.url,
          platform: submission.platform,
          submitted_at: submission.submitted_at,
          callback_skills_endpoint: "/api/skills/external",
          callback_intake_endpoint: "/api/intake",
        }),
      });
      if (dispatchRes.ok) {
        submission =
          updateResourceLinkSubmission(submission.id, {
            status: "forwarded",
            dispatch_target: webhookUrl,
            error_message: null,
          }) || submission;
      } else {
        submission =
          updateResourceLinkSubmission(submission.id, {
            status: "queued",
            dispatch_target: webhookUrl,
            error_message: `Webhook returned HTTP ${dispatchRes.status}; kept queued for assistant pickup.`,
          }) || submission;
      }
    } catch (err) {
      submission =
        updateResourceLinkSubmission(submission.id, {
          status: "queued",
          dispatch_target: webhookUrl,
          error_message:
            err instanceof Error
              ? err.message
              : "Unable to reach webhook; kept queued for assistant pickup.",
        }) || submission;
    }
  }

  return NextResponse.json(
    {
      ok: true,
      submission,
      webhookConfigured: Boolean(webhookUrl),
    },
    { status: 201 }
  );
}
