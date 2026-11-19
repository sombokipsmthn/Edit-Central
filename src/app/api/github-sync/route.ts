import { NextRequest, NextResponse } from "next/server";
import { getGithubSyncState, updateGithubSyncState } from "@/lib/db";
import { runGithubRepositorySync } from "@/lib/github-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = getGithubSyncState();
  return NextResponse.json({
    ok: true,
    state,
    githubTokenConfigured: Boolean(process.env.GITHUB_TOKEN?.trim()),
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      repository?: string;
      branch?: string;
      skills_prefix?: string;
      auto_sync_enabled?: boolean;
      poll_interval_seconds?: number;
    };

    const state = updateGithubSyncState({
      ...(typeof body.repository === "string" && body.repository.trim()
        ? { repository: body.repository.trim(), last_tree_sha: null }
        : {}),
      ...(typeof body.branch === "string" && body.branch.trim()
        ? { branch: body.branch.trim(), last_tree_sha: null }
        : {}),
      ...(typeof body.skills_prefix === "string"
        ? { skills_prefix: body.skills_prefix.trim(), last_tree_sha: null }
        : {}),
      ...(typeof body.auto_sync_enabled === "boolean"
        ? { auto_sync_enabled: body.auto_sync_enabled }
        : {}),
      ...(typeof body.poll_interval_seconds === "number" &&
      body.poll_interval_seconds >= 15
        ? { poll_interval_seconds: Math.round(body.poll_interval_seconds) }
        : {}),
    });

    return NextResponse.json({
      ok: true,
      state,
      githubTokenConfigured: Boolean(process.env.GITHUB_TOKEN?.trim()),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid sync configuration payload." },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  let force = false;
  try {
    const body = (await req.json()) as {
      force?: boolean;
      repository?: string;
      branch?: string;
      skills_prefix?: string;
      auto_sync_enabled?: boolean;
      poll_interval_seconds?: number;
    };
    force = Boolean(body.force);
    if (
      body.repository ||
      body.branch ||
      typeof body.skills_prefix === "string" ||
      typeof body.auto_sync_enabled === "boolean" ||
      typeof body.poll_interval_seconds === "number"
    ) {
      updateGithubSyncState({
        ...(typeof body.repository === "string" && body.repository.trim()
          ? { repository: body.repository.trim(), last_tree_sha: null }
          : {}),
        ...(typeof body.branch === "string" && body.branch.trim()
          ? { branch: body.branch.trim(), last_tree_sha: null }
          : {}),
        ...(typeof body.skills_prefix === "string"
          ? { skills_prefix: body.skills_prefix.trim(), last_tree_sha: null }
          : {}),
        ...(typeof body.auto_sync_enabled === "boolean"
          ? { auto_sync_enabled: body.auto_sync_enabled }
          : {}),
        ...(typeof body.poll_interval_seconds === "number" &&
        body.poll_interval_seconds >= 15
          ? { poll_interval_seconds: Math.round(body.poll_interval_seconds) }
          : {}),
      });
    }
  } catch {
    // Allow empty POST body to trigger default sync
  }

  const result = await runGithubRepositorySync({ force });
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
