import {
  ensureResourceForExternalUrl,
  getGithubSyncState,
  type GithubSyncState,
  updateGithubSyncState,
  upsertGithubSyncedSkill,
} from "@/lib/db";
import {
  type AIProviderId,
  inferSkillVisualType,
  type SkillCategory,
  type SkillDiscipline,
  type SkillItem,
  type SkillVisualType,
  slugifyTitle,
} from "@/lib/skills-data";

export interface ParsedGithubSkillMarkdown {
  slug: string;
  title: string;
  description: string;
  category: SkillCategory;
  discipline: SkillDiscipline;
  visual_type: SkillVisualType;
  tags: string[];
  purpose: string;
  when_to_use: string[];
  required_inputs: string[];
  expected_outputs: string[];
  quality_standards: string[];
  constraints_and_limitations: string[];
  source_and_attribution: string;
  source_url: string | null;
  source_creator: string;
  apps: string[];
  providers: AIProviderId[];
  requirements: string;
  compatibility_notes: string;
  content_markdown: string;
}

function normalizePrefix(prefix: string): string {
  const cleaned = prefix.trim().replace(/^\/+/, "");
  if (!cleaned) return "";
  return cleaned.endsWith("/") ? cleaned : `${cleaned}/`;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string | string[]>;
  body: string;
} {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: normalized };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const meta: Record<string, string | string[]> = {};
  let currentListKey: string | null = null;

  for (const line of yamlBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("- ") && currentListKey) {
      const val = trimmed
        .slice(2)
        .trim()
        .replace(/^["']|["']$/g, "");
      const existing = meta[currentListKey];
      if (Array.isArray(existing)) {
        existing.push(val);
      } else {
        meta[currentListKey] = [val];
      }
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1].trim().toLowerCase();
    const rawVal = kvMatch[2].trim();
    currentListKey = null;

    if (!rawVal) {
      meta[key] = [];
      currentListKey = key;
    } else if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
      meta[key] = rawVal
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      meta[key] = rawVal.replace(/^["']|["']$/g, "");
    }
  }

  return { meta, body };
}

function metaString(
  meta: Record<string, string | string[]>,
  ...keys: string[]
): string {
  for (const k of keys) {
    const val = meta[k];
    if (typeof val === "string" && val.trim()) return val.trim();
    if (Array.isArray(val) && val.length > 0) return val.join(", ");
  }
  return "";
}

function metaArray(
  meta: Record<string, string | string[]>,
  ...keys: string[]
): string[] {
  for (const k of keys) {
    const val = meta[k];
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === "string" && val.trim()) {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function extractSectionBullets(body: string, headings: string[]): string[] {
  const sectionText = extractSectionText(body, headings);
  if (!sectionText) return [];
  return sectionText
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

function extractSectionText(body: string, headings: string[]): string {
  const lines = body.split("\n");
  const normalizedTargets = headings.map((h) => h.toLowerCase());
  let capturing = false;
  const collected: string[] = [];

  for (const line of lines) {
    const hMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (hMatch) {
      const heading = hMatch[1].trim().toLowerCase();
      if (capturing) break;
      if (normalizedTargets.some((t) => heading.includes(t))) {
        capturing = true;
      }
      continue;
    }
    if (capturing) {
      collected.push(line);
    }
  }

  return collected.join("\n").trim();
}

function mapVisualTypeAndCategory(
  rawType: string,
  rawCategory: string,
  rawDiscipline: string,
  title: string,
  tags: string[],
  contentMarkdown: string
): {
  category: SkillCategory;
  discipline: SkillDiscipline;
  visual_type: SkillVisualType;
} {
  const combined = `${rawType} ${rawCategory} ${rawDiscipline} ${title} ${tags.join(
    " "
  )}`.toLowerCase();

  let visual_type: SkillVisualType = "general";
  if (/text[-_\s]?transition/.test(combined)) {
    visual_type = "text-transition";
  } else if (/text[-_\s]?animation|kinetic\s*text|typography/.test(combined)) {
    visual_type = "text-animation";
  } else if (/audio|j-cut|l-cut|ducking|fairlight|sfx|sound/.test(combined)) {
    visual_type = "audio-skill";
  } else if (/graphic[-_\s]?animation|motion\s*graphic|hud|callout|overlay/.test(combined)) {
    visual_type = "graphic-animation";
  } else if (/graphic[-_\s]?style|color|grade|halation|lut|style/.test(combined)) {
    visual_type = "graphic-style";
  } else if (/pacing|rhythm|cut\s*sequence/.test(combined)) {
    visual_type = "pacing";
  }

  let category: SkillCategory = "general";
  if (rawCategory.toLowerCase().includes("text") || visual_type.startsWith("text-")) {
    category = "text";
  } else if (rawCategory.toLowerCase().includes("transition")) {
    category = "transitions";
  } else if (
    rawCategory.toLowerCase().includes("graphic") ||
    visual_type === "graphic-animation"
  ) {
    category = "graphics";
  } else if (
    rawCategory.toLowerCase().includes("style") ||
    visual_type === "graphic-style"
  ) {
    category = "styles";
  } else if (
    rawCategory.toLowerCase().includes("pacing") ||
    visual_type === "audio-skill" ||
    visual_type === "pacing"
  ) {
    category = "pacing";
  }

  let discipline: SkillDiscipline = "general";
  if (visual_type === "text-transition" || visual_type === "text-animation") {
    discipline = "typography-motion";
  } else if (visual_type === "audio-skill") {
    discipline = "audio-dialogue";
  } else if (visual_type === "graphic-animation" || category === "transitions") {
    discipline = "transitions-vfx";
  } else if (visual_type === "graphic-style") {
    discipline = "color-finishing";
  } else if (visual_type === "pacing") {
    discipline = "editorial-pacing";
  }

  const inferred = inferSkillVisualType({
    visual_type,
    category,
    discipline,
    tags,
    title,
    content_markdown: contentMarkdown,
  });

  return { category, discipline, visual_type: inferred };
}

export function parseGithubSkillMarkdown(
  rawMarkdown: string,
  filePath: string
): ParsedGithubSkillMarkdown {
  const { meta, body } = parseFrontmatter(rawMarkdown);
  const lines = body.split("\n");

  // Infer default slug from skills/<slug>/SKILL.md or skills/<slug>.md
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1] || "skill.md";
  const parentDir = parts.length >= 2 ? parts[parts.length - 2] : "";
  const pathSlug =
    fileName.toLowerCase() === "skill.md" && parentDir
      ? parentDir
      : fileName.replace(/\.(md|markdown)$/i, "");

  let title = metaString(meta, "name", "title");
  let description = metaString(meta, "description", "summary");
  let bodyStart = 0;

  if (lines[0]?.startsWith("# ")) {
    if (!title) title = lines[0].slice(2).trim();
    bodyStart = 1;
    while (bodyStart < lines.length && lines[bodyStart].trim() === "") {
      bodyStart++;
    }
    if (lines[bodyStart]?.startsWith("> ")) {
      if (!description) description = lines[bodyStart].slice(2).trim();
      bodyStart++;
      while (bodyStart < lines.length && lines[bodyStart].trim() === "") {
        bodyStart++;
      }
    }
  }

  if (!title) {
    title = pathSlug
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const contentMarkdown =
    lines.slice(bodyStart).join("\n").trim() || body.trim() || rawMarkdown.trim();

  const purpose =
    metaString(meta, "purpose") ||
    extractSectionText(body, ["purpose", "overview"]);

  if (!description) {
    description =
      purpose.split("\n")[0]?.slice(0, 180) ||
      contentMarkdown
        .split("\n")
        .find((l) => l.trim() && !l.startsWith("#"))
        ?.replace(/[*_`>#-]/g, "")
        .trim()
        .slice(0, 180) ||
      "Synced skill specification.";
  }

  const slug = slugifyTitle(metaString(meta, "slug") || pathSlug || title);
  const tags = metaArray(meta, "tags");
  const rawType = metaString(meta, "visual_type", "skill_type", "type");
  const rawCategory = metaString(meta, "category");
  const rawDiscipline = metaString(meta, "discipline");

  const mapped = mapVisualTypeAndCategory(
    rawType,
    rawCategory,
    rawDiscipline,
    title,
    tags,
    contentMarkdown
  );

  const rawProviders = metaArray(meta, "providers", "compatibility_providers");
  const providers: AIProviderId[] = rawProviders
    .map((p) => p.toLowerCase())
    .filter(
      (p): p is AIProviderId =>
        p === "chatgpt" || p === "claude" || p === "gemini" || p === "codex"
    );

  const apps = metaArray(meta, "apps", "compatibility", "tools");
  const resolvedApps =
    apps.length > 0
      ? apps
      : /davinci|resolve|fusion|fairlight/i.test(contentMarkdown)
      ? ["DaVinci Resolve"]
      : ["DaVinci Resolve", "App-Agnostic"];

  const youtubeOrUrlMatch =
    metaString(meta, "source_url", "youtube_url", "url") ||
    body.match(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^\s)>\]]+/i)?.[0] ||
    null;

  const sourceAttribution =
    metaString(meta, "source", "source_and_attribution", "creator") ||
    extractSectionText(body, ["source", "attribution", "reference"]) ||
    (youtubeOrUrlMatch ? `Source video: ${youtubeOrUrlMatch}` : "Synced from GitHub");

  return {
    slug,
    title,
    description,
    category: mapped.category,
    discipline: mapped.discipline,
    visual_type: mapped.visual_type,
    tags: tags.length > 0 ? tags : [mapped.visual_type],
    purpose,
    when_to_use: extractSectionBullets(body, ["when to use", "use cases"]),
    required_inputs: extractSectionBullets(body, ["required inputs", "inputs"]),
    expected_outputs: extractSectionBullets(body, ["expected outputs", "expected output", "output"]),
    quality_standards: extractSectionBullets(body, ["quality standards", "qa"]),
    constraints_and_limitations: extractSectionBullets(body, ["constraints", "limitations"]),
    source_and_attribution: sourceAttribution,
    source_url: youtubeOrUrlMatch,
    source_creator: metaString(meta, "creator", "author") || "YouTube / External Source",
    apps: resolvedApps,
    providers: providers.length > 0 ? providers : ["claude", "chatgpt"],
    requirements: metaString(meta, "requirements"),
    compatibility_notes: metaString(meta, "compatibility_notes", "notes"),
    content_markdown: contentMarkdown,
  };
}

function buildGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Edit-Central-Skill-Sync",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchRepoFileText(
  repository: string,
  branch: string,
  filePath: string
): Promise<string> {
  const encodedPath = filePath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    const apiUrl = `https://api.github.com/repos/${repository}/contents/${encodedPath}?ref=${encodeURIComponent(
      branch
    )}`;
    const res = await fetch(apiUrl, {
      headers: buildGithubHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`GitHub contents fetch failed (${res.status}) for ${filePath}`);
    }
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (data.content && data.encoding === "base64") {
      return Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
    }
  }

  const rawUrl = `https://raw.githubusercontent.com/${repository}/${encodeURIComponent(
    branch
  )}/${encodedPath}`;
  const res = await fetch(rawUrl, {
    headers: { "User-Agent": "Edit-Central-Skill-Sync" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub raw fetch failed (${res.status}) for ${filePath}`);
  }
  return res.text();
}

export interface GithubSyncRunResult {
  ok: boolean;
  state: GithubSyncState;
  added: number;
  updated: number;
  unchanged: number;
  total_repo_skills: number;
  synced_skills: SkillItem[];
  error?: string;
}

export async function runGithubRepositorySync(options?: {
  force?: boolean;
}): Promise<GithubSyncRunResult> {
  const current = getGithubSyncState();
  const repository = current.repository.trim();
  const branch = current.branch.trim() || "master";
  const prefix = normalizePrefix(current.skills_prefix);
  const nowIso = new Date().toISOString();

  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    const errMsg = `Invalid GitHub repository format "${repository}". Expected owner/repo.`;
    const state = updateGithubSyncState({
      last_synced_at: nowIso,
      last_status: "error",
      last_error: errMsg,
    });
    return {
      ok: false,
      state,
      added: 0,
      updated: 0,
      unchanged: 0,
      total_repo_skills: 0,
      synced_skills: [],
      error: errMsg,
    };
  }

  try {
    const treeUrl = `https://api.github.com/repos/${repository}/git/trees/${encodeURIComponent(
      branch
    )}?recursive=1`;
    const treeRes = await fetch(treeUrl, {
      headers: buildGithubHeaders(),
      cache: "no-store",
    });

    if (!treeRes.ok) {
      const errText = await treeRes.text().catch(() => "");
      throw new Error(
        `GitHub API returned ${treeRes.status} for ${repository}@${branch}${
          errText ? `: ${errText.slice(0, 140)}` : ""
        }`
      );
    }

    const treeData = (await treeRes.json()) as {
      sha: string;
      tree: Array<{ path: string; type: string; sha: string }>;
    };

    const skillFiles = (treeData.tree || []).filter((node) => {
      if (node.type !== "blob") return false;
      const lower = node.path.toLowerCase();
      if (!lower.endsWith(".md") && !lower.endsWith(".markdown")) return false;
      if (prefix) {
        if (!node.path.startsWith(prefix)) return false;
        // Skip folder-level README index inside skills/
        if (lower === `${prefix.toLowerCase()}readme.md`) return false;
        return true;
      }
      // If scanning repo root, ignore standard documentation files
      return (
        lower !== "readme.md" &&
        lower !== "platform_direction.md" &&
        lower !== "contributing.md"
      );
    });

    if (
      !options?.force &&
      current.last_tree_sha === treeData.sha &&
      skillFiles.length === current.synced_skill_count
    ) {
      const state = updateGithubSyncState({
        last_synced_at: nowIso,
        last_status: "ok",
        last_error: null,
      });
      return {
        ok: true,
        state,
        added: 0,
        updated: 0,
        unchanged: skillFiles.length,
        total_repo_skills: skillFiles.length,
        synced_skills: [],
      };
    }

    let added = 0;
    let updated = 0;
    let unchanged = 0;
    const syncedSkills: SkillItem[] = [];

    for (const file of skillFiles) {
      const markdownText = await fetchRepoFileText(repository, branch, file.path);
      const parsed = parseGithubSkillMarkdown(markdownText, file.path);

      const resourceIds: string[] = [];
      if (parsed.source_url) {
        const resItem = ensureResourceForExternalUrl({
          url: parsed.source_url,
          title: `${parsed.title} — Source Reference`,
          creator: parsed.source_creator,
          summary: parsed.description,
          tags: [parsed.visual_type, "github-sync"],
        });
        resourceIds.push(resItem.id);
      }

      const encodedPath = file.path
        .split("/")
        .map((s) => encodeURIComponent(s))
        .join("/");
      const githubUrl = `https://github.com/${repository}/blob/${encodeURIComponent(
        branch
      )}/${encodedPath}`;

      const result = upsertGithubSyncedSkill({
        repository,
        branch,
        github_path: file.path,
        github_url: githubUrl,
        blob_sha: file.sha,
        slug: parsed.slug,
        title: parsed.title,
        description: parsed.description,
        category: parsed.category,
        discipline: parsed.discipline,
        visual_type: parsed.visual_type,
        tags: parsed.tags,
        purpose: parsed.purpose,
        when_to_use: parsed.when_to_use,
        required_inputs: parsed.required_inputs,
        expected_outputs: parsed.expected_outputs,
        quality_standards: parsed.quality_standards,
        constraints_and_limitations: parsed.constraints_and_limitations,
        source_and_attribution: parsed.source_and_attribution,
        compatibility: {
          providers: parsed.providers,
          apps: parsed.apps,
          requirements: parsed.requirements,
          notes: parsed.compatibility_notes,
        },
        content_markdown: parsed.content_markdown,
        resource_ids: resourceIds,
      });

      if (result.action === "added") {
        added++;
        syncedSkills.push(result.skill);
      } else if (result.action === "updated") {
        updated++;
        syncedSkills.push(result.skill);
      } else {
        unchanged++;
      }
    }

    const state = updateGithubSyncState({
      last_synced_at: nowIso,
      last_tree_sha: treeData.sha,
      last_status: "ok",
      last_error: null,
      synced_skill_count: skillFiles.length,
    });

    return {
      ok: true,
      state,
      added,
      updated,
      unchanged,
      total_repo_skills: skillFiles.length,
      synced_skills: syncedSkills,
    };
  } catch (err) {
    const errMsg =
      err instanceof Error ? err.message : "Failed to sync from GitHub.";
    const state = updateGithubSyncState({
      last_synced_at: nowIso,
      last_status: "error",
      last_error: errMsg,
    });
    return {
      ok: false,
      state,
      added: 0,
      updated: 0,
      unchanged: 0,
      total_repo_skills: 0,
      synced_skills: [],
      error: errMsg,
    };
  }
}
