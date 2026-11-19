import { NextRequest, NextResponse } from "next/server";
import { upsertExternalCompletedSkill } from "@/lib/db";
import { getIntegrationConfigStatus, verifyIntakeToken } from "@/lib/intake-store";
import type {
  AIProviderId,
  SkillCategory,
  SkillDiscipline,
  SkillVisualType,
} from "@/lib/skills-data";

export const dynamic = "force-dynamic";

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  const headerToken = req.headers.get("x-intake-token");
  return headerToken ? headerToken.trim() : null;
}

const VALID_CATEGORIES = new Set<SkillCategory>([
  "text",
  "transitions",
  "graphics",
  "pacing",
  "styles",
  "general",
]);

const VALID_VISUAL_TYPES = new Set<SkillVisualType>([
  "text-transition",
  "text-animation",
  "audio-skill",
  "graphic-animation",
  "graphic-style",
  "pacing",
  "general",
]);

const VALID_PROVIDERS = new Set<AIProviderId>([
  "chatgpt",
  "claude",
  "gemini",
  "codex",
  "any",
]);

export async function POST(req: NextRequest) {
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

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const title =
    typeof body.name === "string"
      ? body.name.trim()
      : typeof body.title === "string"
      ? body.title.trim()
      : "";
  const markdownContent =
    typeof body.markdown_content === "string"
      ? body.markdown_content.trim()
      : typeof body.content_markdown === "string"
      ? body.content_markdown.trim()
      : typeof body.instructions === "string"
      ? body.instructions.trim()
      : "";

  if (!title || !markdownContent) {
    return NextResponse.json(
      {
        ok: false,
        error: "Provide both 'name' (or 'title') and 'markdown_content' (or 'instructions').",
      },
      { status: 422 }
    );
  }

  const rawCategory =
    typeof body.category === "string" ? body.category.toLowerCase().trim() : "";
  const category: SkillCategory = VALID_CATEGORIES.has(
    rawCategory as SkillCategory
  )
    ? (rawCategory as SkillCategory)
    : "general";

  const rawVisualType =
    typeof body.visual_type === "string"
      ? body.visual_type.toLowerCase().trim()
      : "";
  const visual_type = VALID_VISUAL_TYPES.has(rawVisualType as SkillVisualType)
    ? (rawVisualType as SkillVisualType)
    : undefined;

  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.trim().toLowerCase())
    : [];

  const compatObj =
    typeof body.compatibility === "object" &&
    body.compatibility !== null &&
    !Array.isArray(body.compatibility)
      ? (body.compatibility as Record<string, unknown>)
      : {};

  const rawProviders = Array.isArray(body.providers)
    ? body.providers
    : Array.isArray(compatObj.providers)
    ? compatObj.providers
    : [];

  const providers = rawProviders
    .filter((p): p is string => typeof p === "string")
    .map((p) => p.toLowerCase().trim())
    .filter((p): p is AIProviderId => VALID_PROVIDERS.has(p as AIProviderId));

  const rawApps = Array.isArray(body.apps)
    ? body.apps
    : Array.isArray(compatObj.apps)
    ? compatObj.apps
    : Array.isArray(body.compatibility)
    ? body.compatibility
    : [];

  const apps = rawApps
    .filter((a): a is string => typeof a === "string" && a.trim().length > 0)
    .map((a) => a.trim());

  const skill = upsertExternalCompletedSkill({
    title,
    slug: typeof body.slug === "string" ? body.slug : undefined,
    description:
      typeof body.description === "string" ? body.description.trim() : "",
    category,
    discipline:
      typeof body.discipline === "string"
        ? (body.discipline as SkillDiscipline)
        : undefined,
    visual_type,
    tags,
    content_markdown: markdownContent,
    providers,
    apps,
    source_url:
      typeof body.source_url === "string" ? body.source_url.trim() : undefined,
    source_and_attribution:
      typeof body.source_and_attribution === "string"
        ? body.source_and_attribution.trim()
        : undefined,
    github_url:
      typeof body.github_url === "string" ? body.github_url.trim() : undefined,
    github_path:
      typeof body.github_path === "string"
        ? body.github_path.trim()
        : undefined,
    github_commit_sha:
      typeof body.github_commit_sha === "string"
        ? body.github_commit_sha.trim()
        : undefined,
    thumbnail_url:
      typeof body.thumbnail_url === "string"
        ? body.thumbnail_url.trim()
        : undefined,
    purpose: typeof body.purpose === "string" ? body.purpose.trim() : undefined,
  });

  return NextResponse.json({ ok: true, skill }, { status: 201 });
}
