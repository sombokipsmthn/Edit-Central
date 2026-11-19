import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  type CustomCollection,
  INITIAL_COLLECTIONS,
  INITIAL_RESOURCES,
  INITIAL_SKILLS,
  type ResourceItem,
  type SkillApprovalStatus,
  type SkillCategory,
  type SkillCompatibility,
  type SkillDiscipline,
  type SkillItem,
  type SkillPublishingStatus,
  type SkillStatus,
  type SkillVersion,
  type SkillVisualType,
  inferSkillVisualType,
  slugifyTitle,
  type AIProviderId,
} from "@/lib/skills-data";

export interface GithubSyncState {
  id: string;
  repository: string;
  branch: string;
  skills_prefix: string;
  auto_sync_enabled: boolean;
  poll_interval_seconds: number;
  last_synced_at: string | null;
  last_tree_sha: string | null;
  last_status: "idle" | "ok" | "error";
  last_error: string | null;
  synced_skill_count: number;
}

export interface ResourceLinkSubmission {
  id: string;
  url: string;
  platform: string;
  status: "queued" | "forwarded" | "completed" | "failed";
  dispatch_target: string | null;
  error_message: string | null;
  linked_resource_id: string | null;
  linked_skill_id: string | null;
  submitted_at: string;
  completed_at: string | null;
}

const globalForDb = globalThis as unknown as {
  __editCentralDb?: DatabaseSync;
  __editCentralDbPath?: string;
};

function resolveDbPath(): string {
  const envPath = process.env.EDIT_CENTRAL_DB_PATH?.trim();
  if (envPath) return envPath;
  return path.join(process.cwd(), "data", "edit-central.db");
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'note',
      url TEXT,
      creator TEXT NOT NULL DEFAULT '',
      resource_type_label TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      extracted_knowledge_json TEXT NOT NULL DEFAULT '[]',
      content TEXT NOT NULL DEFAULT '',
      file_name TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      source_submission_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      discipline TEXT NOT NULL DEFAULT 'general',
      visual_type TEXT NOT NULL DEFAULT 'general',
      tags_json TEXT NOT NULL DEFAULT '[]',
      collections_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'ready',
      approval_status TEXT NOT NULL DEFAULT 'pending',
      approved_by TEXT,
      approved_at TEXT,
      publishing_status TEXT NOT NULL DEFAULT 'not_ready',
      github_repository TEXT NOT NULL DEFAULT 'sombokipsmthn/Edit-Central',
      github_branch TEXT NOT NULL DEFAULT 'master',
      github_path TEXT NOT NULL DEFAULT '',
      github_commit_sha TEXT,
      github_blob_sha TEXT,
      github_url TEXT,
      published_at TEXT,
      purpose TEXT NOT NULL DEFAULT '',
      when_to_use_json TEXT NOT NULL DEFAULT '[]',
      required_inputs_json TEXT NOT NULL DEFAULT '[]',
      expected_outputs_json TEXT NOT NULL DEFAULT '[]',
      quality_standards_json TEXT NOT NULL DEFAULT '[]',
      constraints_and_limitations_json TEXT NOT NULL DEFAULT '[]',
      source_and_attribution TEXT NOT NULL DEFAULT '',
      source_submission_id TEXT,
      content_markdown TEXT NOT NULL DEFAULT '',
      preferred_provider TEXT NOT NULL DEFAULT 'any',
      provider_note TEXT NOT NULL DEFAULT '',
      compatibility_json TEXT NOT NULL DEFAULT '{}',
      resource_ids_json TEXT NOT NULL DEFAULT '[]',
      thumbnail_url TEXT,
      versions_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      submission_id TEXT UNIQUE NOT NULL,
      schema_version TEXT NOT NULL,
      submission_type TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      received_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      submission_status TEXT NOT NULL,
      reviewer_notes TEXT NOT NULL DEFAULT '',
      origin_json TEXT NOT NULL,
      resource_json TEXT NOT NULL,
      analysis_json TEXT NOT NULL,
      recommendation_json TEXT NOT NULL,
      proposed_skill_record_ids_json TEXT NOT NULL DEFAULT '[]',
      raw_payload_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analysis_records (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL,
      resource_id TEXT,
      purpose TEXT NOT NULL DEFAULT '',
      intended_audience TEXT NOT NULL DEFAULT '',
      problems_addressed_json TEXT NOT NULL DEFAULT '[]',
      knowledge_extracted_json TEXT NOT NULL DEFAULT '[]',
      workflows_json TEXT NOT NULL DEFAULT '[]',
      techniques_json TEXT NOT NULL DEFAULT '[]',
      tools_and_technologies_json TEXT NOT NULL DEFAULT '[]',
      limitations_json TEXT NOT NULL DEFAULT '[]',
      source_supported_findings_json TEXT NOT NULL DEFAULT '[]',
      assistant_recommendations_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS proposed_skills (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL,
      skill_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      purpose TEXT NOT NULL DEFAULT '',
      when_to_use_json TEXT NOT NULL DEFAULT '[]',
      required_inputs_json TEXT NOT NULL DEFAULT '[]',
      expected_outputs_json TEXT NOT NULL DEFAULT '[]',
      instructions TEXT NOT NULL DEFAULT '',
      quality_standards_json TEXT NOT NULL DEFAULT '[]',
      constraints_and_limitations_json TEXT NOT NULL DEFAULT '[]',
      compatibility_json TEXT NOT NULL DEFAULT '[]',
      source_and_attribution TEXT NOT NULL DEFAULT '',
      markdown_content TEXT NOT NULL DEFAULT '',
      proposed_repository_path TEXT NOT NULL DEFAULT '',
      approval_json TEXT NOT NULL,
      publishing_json TEXT NOT NULL,
      linked_skill_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS intake_errors (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      status_code INTEGER NOT NULL,
      reason TEXT NOT NULL,
      submission_id TEXT,
      origin_platform TEXT,
      details_json TEXT NOT NULL DEFAULT '[]',
      raw_excerpt TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS github_sync_state (
      id TEXT PRIMARY KEY,
      repository TEXT NOT NULL,
      branch TEXT NOT NULL,
      skills_prefix TEXT NOT NULL DEFAULT 'skills/',
      auto_sync_enabled INTEGER NOT NULL DEFAULT 1,
      poll_interval_seconds INTEGER NOT NULL DEFAULT 60,
      last_synced_at TEXT,
      last_tree_sha TEXT,
      last_status TEXT NOT NULL DEFAULT 'idle',
      last_error TEXT,
      synced_skill_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS resource_submissions (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      platform TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      dispatch_target TEXT,
      error_message TEXT,
      linked_resource_id TEXT,
      linked_skill_id TEXT,
      submitted_at TEXT NOT NULL,
      completed_at TEXT
    );
  `);

  const existingCols = (
    db.prepare("PRAGMA table_info(skills)").all() as Array<{ name: string }>
  ).map((c) => c.name);
  if (!existingCols.includes("visual_type")) {
    db.exec("ALTER TABLE skills ADD COLUMN visual_type TEXT NOT NULL DEFAULT 'general'");
  }
  if (!existingCols.includes("github_blob_sha")) {
    db.exec("ALTER TABLE skills ADD COLUMN github_blob_sha TEXT");
  }

  const syncRow = db
    .prepare("SELECT id FROM github_sync_state WHERE id = 'default'")
    .get() as { id: string } | undefined;
  if (!syncRow) {
    const repo =
      process.env.EDIT_CENTRAL_GITHUB_REPO?.trim() ||
      "sombokipsmthn/Edit-Central";
    const branch = process.env.EDIT_CENTRAL_GITHUB_BRANCH?.trim() || "master";
    const prefix = process.env.EDIT_CENTRAL_SKILLS_PREFIX?.trim() || "skills/";
    db.prepare(
      `INSERT INTO github_sync_state (
        id, repository, branch, skills_prefix, auto_sync_enabled,
        poll_interval_seconds, last_synced_at, last_tree_sha, last_status,
        last_error, synced_skill_count
      ) VALUES ('default', ?, ?, ?, 1, 60, NULL, NULL, 'idle', NULL, 0)`
    ).run(repo, branch, prefix);
  }
}

function seedIfEmpty(db: DatabaseSync) {
  const skillCount = (
    db.prepare("SELECT COUNT(*) as count FROM skills").get() as { count: number }
  ).count;
  const resourceCount = (
    db.prepare("SELECT COUNT(*) as count FROM resources").get() as {
      count: number;
    }
  ).count;
  const collectionCount = (
    db.prepare("SELECT COUNT(*) as count FROM collections").get() as {
      count: number;
    }
  ).count;

  if (skillCount === 0 && resourceCount === 0 && collectionCount === 0) {
    db.exec("BEGIN");
    try {
      for (const col of INITIAL_COLLECTIONS) {
        insertCollectionRow(db, col);
      }
      for (const res of INITIAL_RESOURCES) {
        insertResourceRow(db, res);
      }
      for (const skill of INITIAL_SKILLS) {
        insertSkillRow(db, skill);
      }
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }
}

export function getDb(): DatabaseSync {
  const targetPath = resolveDbPath();
  if (globalForDb.__editCentralDb && globalForDb.__editCentralDbPath === targetPath) {
    return globalForDb.__editCentralDb;
  }

  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new DatabaseSync(targetPath);
  initSchema(db);
  seedIfEmpty(db);

  globalForDb.__editCentralDb = db;
  globalForDb.__editCentralDbPath = targetPath;
  return db;
}

function safeJsonParse<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function insertCollectionRow(db: DatabaseSync, col: CustomCollection) {
  db.prepare(
    `INSERT OR REPLACE INTO collections (id, name, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(col.id, col.name, col.description, col.created_at, col.updated_at);
}

function insertResourceRow(db: DatabaseSync, res: ResourceItem) {
  db.prepare(
    `INSERT OR REPLACE INTO resources (
      id, title, type, url, creator, resource_type_label, subject, summary,
      extracted_knowledge_json, content, file_name, tags_json, source_submission_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    res.id,
    res.title,
    res.type,
    res.url ?? null,
    res.creator ?? "",
    res.resource_type_label ?? "",
    res.subject ?? "",
    res.summary ?? "",
    JSON.stringify(res.extracted_knowledge ?? []),
    res.content ?? "",
    res.file_name ?? null,
    JSON.stringify(res.tags ?? []),
    res.source_submission_id ?? null,
    res.created_at,
    res.updated_at
  );
}

function insertSkillRow(db: DatabaseSync, skill: SkillItem) {
  const resolvedVisualType = inferSkillVisualType(skill);
  db.prepare(
    `INSERT OR REPLACE INTO skills (
      id, slug, title, description, category, discipline, visual_type, tags_json, collections_json,
      status, approval_status, approved_by, approved_at,
      publishing_status, github_repository, github_branch, github_path,
      github_commit_sha, github_blob_sha, github_url, published_at,
      purpose, when_to_use_json, required_inputs_json, expected_outputs_json,
      quality_standards_json, constraints_and_limitations_json, source_and_attribution,
      source_submission_id, content_markdown, preferred_provider, provider_note,
      compatibility_json, resource_ids_json, thumbnail_url, versions_json,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    skill.id,
    skill.slug || slugifyTitle(skill.title),
    skill.title,
    skill.description ?? "",
    skill.category,
    skill.discipline ?? "general",
    resolvedVisualType,
    JSON.stringify(skill.tags ?? []),
    JSON.stringify(skill.collections ?? []),
    skill.status,
    skill.approval_status ?? "pending",
    skill.approved_by ?? null,
    skill.approved_at ?? null,
    skill.publishing_status ?? "not_ready",
    skill.github_repository ?? "sombokipsmthn/Edit-Central",
    skill.github_branch ?? "master",
    skill.github_path ?? `skills/${skill.slug || slugifyTitle(skill.title)}/SKILL.md`,
    skill.github_commit_sha ?? null,
    skill.github_blob_sha ?? null,
    skill.github_url ?? null,
    skill.published_at ?? null,
    skill.purpose ?? "",
    JSON.stringify(skill.when_to_use ?? []),
    JSON.stringify(skill.required_inputs ?? []),
    JSON.stringify(skill.expected_outputs ?? []),
    JSON.stringify(skill.quality_standards ?? []),
    JSON.stringify(skill.constraints_and_limitations ?? []),
    skill.source_and_attribution ?? "",
    skill.source_submission_id ?? null,
    skill.content_markdown,
    skill.preferred_provider ?? "any",
    skill.provider_note ?? "",
    JSON.stringify(skill.compatibility ?? { providers: [], apps: [], requirements: "", notes: "" }),
    JSON.stringify(skill.resource_ids ?? []),
    skill.thumbnail_url ?? null,
    JSON.stringify(skill.versions ?? []),
    skill.created_at,
    skill.updated_at
  );
}

function rowToSkill(row: Record<string, unknown>): SkillItem {
  const title = String(row.title || "Untitled Skill");
  const slug = String(row.slug || slugifyTitle(title));
  const category = (row.category as SkillCategory) || "general";
  const discipline = (row.discipline as SkillDiscipline) || "general";
  const tags = safeJsonParse<string[]>(row.tags_json, []);
  const content_markdown = String(row.content_markdown || "");
  const rawVisualType = row.visual_type
    ? (String(row.visual_type) as SkillVisualType)
    : undefined;
  return {
    id: String(row.id),
    slug,
    title,
    description: String(row.description || ""),
    category,
    discipline,
    visual_type: inferSkillVisualType({
      visual_type: rawVisualType,
      category,
      discipline,
      tags,
      title,
      content_markdown,
    }),
    tags,
    collections: safeJsonParse<string[]>(row.collections_json, []),
    status: (row.status as SkillStatus) || "ready",
    approval_status: (row.approval_status as SkillApprovalStatus) || "pending",
    approved_by: row.approved_by ? String(row.approved_by) : null,
    approved_at: row.approved_at ? String(row.approved_at) : null,
    publishing_status:
      (row.publishing_status as SkillPublishingStatus) || "not_ready",
    github_repository: row.github_repository
      ? String(row.github_repository)
      : "sombokipsmthn/Edit-Central",
    github_branch: row.github_branch ? String(row.github_branch) : "master",
    github_path: row.github_path
      ? String(row.github_path)
      : `skills/${slug}/SKILL.md`,
    github_commit_sha: row.github_commit_sha
      ? String(row.github_commit_sha)
      : null,
    github_blob_sha: row.github_blob_sha ? String(row.github_blob_sha) : null,
    github_url: row.github_url ? String(row.github_url) : null,
    published_at: row.published_at ? String(row.published_at) : null,
    purpose: row.purpose ? String(row.purpose) : "",
    when_to_use: safeJsonParse<string[]>(row.when_to_use_json, []),
    required_inputs: safeJsonParse<string[]>(row.required_inputs_json, []),
    expected_outputs: safeJsonParse<string[]>(row.expected_outputs_json, []),
    quality_standards: safeJsonParse<string[]>(row.quality_standards_json, []),
    constraints_and_limitations: safeJsonParse<string[]>(
      row.constraints_and_limitations_json,
      []
    ),
    source_and_attribution: row.source_and_attribution
      ? String(row.source_and_attribution)
      : "",
    source_submission_id: row.source_submission_id
      ? String(row.source_submission_id)
      : null,
    content_markdown,
    preferred_provider: (row.preferred_provider as AIProviderId) || "any",
    provider_note: String(row.provider_note || ""),
    compatibility: safeJsonParse<SkillCompatibility>(row.compatibility_json, {
      providers: ["chatgpt", "claude", "gemini"],
      apps: ["App-Agnostic"],
      requirements: "",
      notes: "",
    }),
    resource_ids: safeJsonParse<string[]>(row.resource_ids_json, []),
    thumbnail_url: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    versions: safeJsonParse<SkillVersion[]>(row.versions_json, []),
  };
}

function rowToResource(row: Record<string, unknown>): ResourceItem {
  return {
    id: String(row.id),
    title: String(row.title || "Untitled Resource"),
    type: (row.type as ResourceItem["type"]) || "note",
    url: row.url ? String(row.url) : undefined,
    creator: row.creator ? String(row.creator) : undefined,
    resource_type_label: row.resource_type_label
      ? String(row.resource_type_label)
      : undefined,
    subject: row.subject ? String(row.subject) : undefined,
    summary: row.summary ? String(row.summary) : undefined,
    extracted_knowledge: safeJsonParse<string[]>(
      row.extracted_knowledge_json,
      []
    ),
    content: String(row.content || ""),
    file_name: row.file_name ? String(row.file_name) : undefined,
    tags: safeJsonParse<string[]>(row.tags_json, []),
    source_submission_id: row.source_submission_id
      ? String(row.source_submission_id)
      : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function rowToCollection(row: Record<string, unknown>): CustomCollection {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description || ""),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function listWorkspaceData(): {
  skills: SkillItem[];
  resources: ResourceItem[];
  collections: CustomCollection[];
} {
  const db = getDb();
  const skillRows = db
    .prepare("SELECT * FROM skills ORDER BY updated_at DESC, created_at DESC")
    .all() as Record<string, unknown>[];
  const resourceRows = db
    .prepare("SELECT * FROM resources ORDER BY updated_at DESC, created_at DESC")
    .all() as Record<string, unknown>[];
  const collectionRows = db
    .prepare("SELECT * FROM collections ORDER BY name ASC")
    .all() as Record<string, unknown>[];

  return {
    skills: skillRows.map(rowToSkill),
    resources: resourceRows.map(rowToResource),
    collections: collectionRows.map(rowToCollection),
  };
}

export function getSkillById(skillId: string): SkillItem | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM skills WHERE id = ?")
    .get(skillId) as Record<string, unknown> | undefined;
  return row ? rowToSkill(row) : null;
}

export function createSkillInDb(
  draft: Omit<SkillItem, "id" | "created_at" | "updated_at" | "versions"> & {
    id?: string;
    slug?: string;
  },
  versionNote = "Initial version"
): SkillItem {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const id =
    draft.id ||
    `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const slug = draft.slug?.trim() || slugifyTitle(draft.title);
  const firstVersion: SkillVersion = {
    id: `ver-${Date.now()}`,
    version_number: 1,
    timestamp: today,
    note: versionNote,
    title: draft.title,
    description: draft.description,
    content_markdown: draft.content_markdown,
  };

  // Enforce: never pretend published unless confirmation link or SHA is supplied
  const hasPublishProof = Boolean(
    draft.github_url?.trim() || draft.github_commit_sha?.trim()
  );
  const publishingStatus: SkillPublishingStatus =
    draft.publishing_status === "published" && !hasPublishProof
      ? draft.approval_status === "approved"
        ? "awaiting_publish"
        : "not_ready"
      : draft.publishing_status || "not_ready";

  const skill: SkillItem = {
    ...draft,
    id,
    slug,
    discipline: draft.discipline || "general",
    collections: draft.collections || [],
    approval_status: draft.approval_status || "pending",
    publishing_status: publishingStatus,
    github_repository: draft.github_repository || "sombokipsmthn/Edit-Central",
    github_branch: draft.github_branch || "master",
    github_path: draft.github_path || `skills/${slug}/SKILL.md`,
    created_at: today,
    updated_at: today,
    versions: [firstVersion],
  };

  insertSkillRow(db, skill);
  return skill;
}

export function updateSkillInDb(
  skillId: string,
  updates: Partial<Omit<SkillItem, "id" | "created_at" | "versions">>,
  options?: { recordVersion?: boolean; versionNote?: string }
): SkillItem | null {
  const db = getDb();
  const existing = getSkillById(skillId);
  if (!existing) return null;

  const today = new Date().toISOString().slice(0, 10);
  const merged: SkillItem = {
    ...existing,
    ...updates,
    slug: updates.slug
      ? slugifyTitle(updates.slug)
      : updates.title && !existing.slug
      ? slugifyTitle(updates.title)
      : existing.slug,
    updated_at: today,
  };

  const hasProof = Boolean(
    merged.github_url?.trim() || merged.github_commit_sha?.trim()
  );
  if (merged.publishing_status === "published" && !hasProof) {
    merged.publishing_status =
      merged.approval_status === "approved" ? "awaiting_publish" : "not_ready";
  }

  const contentChanged =
    merged.content_markdown !== existing.content_markdown ||
    merged.title !== existing.title ||
    merged.description !== existing.description;

  if ((options?.recordVersion ?? contentChanged) && contentChanged) {
    const nextNumber =
      (existing.versions[0]?.version_number ?? existing.versions.length) + 1;
    const snapshot: SkillVersion = {
      id: `ver-${Date.now()}`,
      version_number: nextNumber,
      timestamp: today,
      note: options?.versionNote?.trim() || `Updated v${nextNumber}`,
      title: merged.title,
      description: merged.description,
      content_markdown: merged.content_markdown,
    };
    merged.versions = [snapshot, ...existing.versions];
  }

  insertSkillRow(db, merged);
  return merged;
}

export function restoreSkillVersionInDb(
  skillId: string,
  version: SkillVersion
): SkillItem | null {
  const db = getDb();
  const existing = getSkillById(skillId);
  if (!existing) return null;

  const today = new Date().toISOString().slice(0, 10);
  const nextNumber =
    (existing.versions[0]?.version_number ?? existing.versions.length) + 1;
  const snapshot: SkillVersion = {
    id: `ver-${Date.now()}`,
    version_number: nextNumber,
    timestamp: today,
    note: `Restored from v${version.version_number}`,
    title: version.title,
    description: version.description,
    content_markdown: version.content_markdown,
  };

  const restored: SkillItem = {
    ...existing,
    title: version.title,
    description: version.description,
    content_markdown: version.content_markdown,
    updated_at: today,
    versions: [snapshot, ...existing.versions],
  };

  insertSkillRow(db, restored);
  return restored;
}

export function duplicateSkillInDb(skillId: string): SkillItem | null {
  const existing = getSkillById(skillId);
  if (!existing) return null;

  const today = new Date().toISOString().slice(0, 10);
  const id = `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const copyTitle = `${existing.title} (Copy)`;
  const copySlug = slugifyTitle(copyTitle);

  const copy: SkillItem = {
    ...existing,
    id,
    slug: copySlug,
    title: copyTitle,
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_path: `skills/${copySlug}/SKILL.md`,
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    created_at: today,
    updated_at: today,
    versions: [
      {
        id: `ver-${Date.now()}`,
        version_number: 1,
        timestamp: today,
        note: `Duplicated from "${existing.title}"`,
        title: copyTitle,
        description: existing.description,
        content_markdown: existing.content_markdown,
      },
    ],
  };

  insertSkillRow(getDb(), copy);
  return copy;
}

export function deleteSkillInDb(skillId: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM skills WHERE id = ?").run(skillId);
  return Number(res.changes) > 0;
}

export function toggleSkillResourceInDb(
  skillId: string,
  resourceId: string
): SkillItem | null {
  const existing = getSkillById(skillId);
  if (!existing) return null;

  const exists = existing.resource_ids.includes(resourceId);
  const nextIds = exists
    ? existing.resource_ids.filter((id) => id !== resourceId)
    : [...existing.resource_ids, resourceId];

  return updateSkillInDb(
    skillId,
    { resource_ids: nextIds },
    { recordVersion: false }
  );
}

export function createResourceInDb(
  draft: Omit<ResourceItem, "id" | "created_at" | "updated_at"> & {
    id?: string;
  },
  attachToSkillId?: string
): ResourceItem {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const id =
    draft.id ||
    `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const resource: ResourceItem = {
    ...draft,
    id,
    created_at: today,
    updated_at: today,
  };

  insertResourceRow(db, resource);

  if (attachToSkillId) {
    const skill = getSkillById(attachToSkillId);
    if (skill && !skill.resource_ids.includes(id)) {
      updateSkillInDb(
        attachToSkillId,
        { resource_ids: [...skill.resource_ids, id] },
        { recordVersion: false }
      );
    }
  }

  return resource;
}

export function updateResourceInDb(
  resourceId: string,
  updates: Partial<Omit<ResourceItem, "id" | "created_at">>
): ResourceItem | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM resources WHERE id = ?")
    .get(resourceId) as Record<string, unknown> | undefined;
  if (!row) return null;

  const existing = rowToResource(row);
  const merged: ResourceItem = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString().slice(0, 10),
  };

  insertResourceRow(db, merged);
  return merged;
}

export function deleteResourceInDb(resourceId: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM resources WHERE id = ?").run(resourceId);
  if (Number(res.changes) === 0) return false;

  const skills = listWorkspaceData().skills;
  for (const sk of skills) {
    if (sk.resource_ids.includes(resourceId)) {
      updateSkillInDb(
        sk.id,
        { resource_ids: sk.resource_ids.filter((id) => id !== resourceId) },
        { recordVersion: false }
      );
    }
  }
  return true;
}

export function createCollectionInDb(draft: {
  name: string;
  description?: string;
}): CustomCollection {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const col: CustomCollection = {
    id: `col-${slugifyTitle(draft.name)}-${Math.random()
      .toString(36)
      .slice(2, 5)}`,
    name: draft.name.trim(),
    description: (draft.description || "").trim(),
    created_at: today,
    updated_at: today,
  };
  insertCollectionRow(db, col);
  return col;
}

export function deleteCollectionInDb(collectionId: string): boolean {
  const db = getDb();
  const res = db
    .prepare("DELETE FROM collections WHERE id = ?")
    .run(collectionId);
  if (Number(res.changes) === 0) return false;

  const skills = listWorkspaceData().skills;
  for (const sk of skills) {
    if (sk.collections.includes(collectionId)) {
      updateSkillInDb(
        sk.id,
        { collections: sk.collections.filter((id) => id !== collectionId) },
        { recordVersion: false }
      );
    }
  }
  return true;
}

export function getGithubSyncState(): GithubSyncState {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM github_sync_state WHERE id = 'default'")
    .get() as Record<string, unknown>;
  return {
    id: "default",
    repository: String(row.repository || "sombokipsmthn/Edit-Central"),
    branch: String(row.branch || "master"),
    skills_prefix: String(row.skills_prefix || "skills/"),
    auto_sync_enabled: Number(row.auto_sync_enabled) === 1,
    poll_interval_seconds: Number(row.poll_interval_seconds) || 60,
    last_synced_at: row.last_synced_at ? String(row.last_synced_at) : null,
    last_tree_sha: row.last_tree_sha ? String(row.last_tree_sha) : null,
    last_status: (String(row.last_status || "idle") as GithubSyncState["last_status"]),
    last_error: row.last_error ? String(row.last_error) : null,
    synced_skill_count: Number(row.synced_skill_count) || 0,
  };
}

export function updateGithubSyncState(
  updates: Partial<Omit<GithubSyncState, "id">>
): GithubSyncState {
  const db = getDb();
  const current = getGithubSyncState();
  const merged: GithubSyncState = {
    ...current,
    ...updates,
    id: "default",
  };
  db.prepare(
    `UPDATE github_sync_state SET
      repository = ?, branch = ?, skills_prefix = ?, auto_sync_enabled = ?,
      poll_interval_seconds = ?, last_synced_at = ?, last_tree_sha = ?,
      last_status = ?, last_error = ?, synced_skill_count = ?
     WHERE id = 'default'`
  ).run(
    merged.repository,
    merged.branch,
    merged.skills_prefix,
    merged.auto_sync_enabled ? 1 : 0,
    merged.poll_interval_seconds,
    merged.last_synced_at,
    merged.last_tree_sha,
    merged.last_status,
    merged.last_error,
    merged.synced_skill_count
  );
  return merged;
}

export function ensureResourceForExternalUrl(input: {
  url: string;
  title: string;
  creator?: string;
  summary?: string;
  tags?: string[];
}): ResourceItem {
  const db = getDb();
  const existingRow = db
    .prepare("SELECT * FROM resources WHERE url = ? LIMIT 1")
    .get(input.url) as Record<string, unknown> | undefined;
  if (existingRow) {
    return rowToResource(existingRow);
  }
  return createResourceInDb({
    title: input.title,
    type: "link",
    url: input.url,
    creator: input.creator || "External Reference",
    resource_type_label:
      /youtube\.com|youtu\.be/i.test(input.url) ? "video" : "reference",
    subject: input.title,
    summary: input.summary || "",
    extracted_knowledge: [],
    content: input.summary || `Linked source: ${input.url}`,
    tags: input.tags || ["github-sync"],
  });
}

export function upsertGithubSyncedSkill(input: {
  repository: string;
  branch: string;
  github_path: string;
  github_url: string;
  blob_sha: string;
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
  compatibility: SkillCompatibility;
  content_markdown: string;
  resource_ids: string[];
}): { action: "added" | "updated" | "unchanged"; skill: SkillItem } {
  const db = getDb();
  const existingRow = db
    .prepare(
      "SELECT * FROM skills WHERE github_path = ? OR slug = ? ORDER BY updated_at DESC LIMIT 1"
    )
    .get(input.github_path, input.slug) as Record<string, unknown> | undefined;

  if (existingRow) {
    const existing = rowToSkill(existingRow);
    if (
      existing.github_blob_sha === input.blob_sha &&
      existing.publishing_status === "published" &&
      existing.github_url === input.github_url
    ) {
      return { action: "unchanged", skill: existing };
    }

    const today = new Date().toISOString().slice(0, 10);
    const mergedResources = Array.from(
      new Set([...existing.resource_ids, ...input.resource_ids])
    );
    const nextNumber =
      (existing.versions[0]?.version_number ?? existing.versions.length) + 1;
    const contentChanged =
      existing.content_markdown.trim() !== input.content_markdown.trim() ||
      existing.title !== input.title;

    const updated: SkillItem = {
      ...existing,
      slug: input.slug,
      title: input.title,
      description: input.description || existing.description,
      category: input.category,
      discipline: input.discipline,
      visual_type: input.visual_type,
      tags: input.tags.length > 0 ? input.tags : existing.tags,
      approval_status: "approved",
      approved_by: existing.approved_by || "GitHub Repository Sync",
      approved_at: existing.approved_at || new Date().toISOString(),
      publishing_status: "published",
      github_repository: input.repository,
      github_branch: input.branch,
      github_path: input.github_path,
      github_commit_sha: existing.github_commit_sha || input.blob_sha.slice(0, 12),
      github_blob_sha: input.blob_sha,
      github_url: input.github_url,
      published_at: existing.published_at || new Date().toISOString(),
      purpose: input.purpose || existing.purpose,
      when_to_use:
        input.when_to_use.length > 0 ? input.when_to_use : existing.when_to_use,
      required_inputs:
        input.required_inputs.length > 0
          ? input.required_inputs
          : existing.required_inputs,
      expected_outputs:
        input.expected_outputs.length > 0
          ? input.expected_outputs
          : existing.expected_outputs,
      quality_standards:
        input.quality_standards.length > 0
          ? input.quality_standards
          : existing.quality_standards,
      constraints_and_limitations:
        input.constraints_and_limitations.length > 0
          ? input.constraints_and_limitations
          : existing.constraints_and_limitations,
      source_and_attribution:
        input.source_and_attribution || existing.source_and_attribution,
      compatibility: {
        providers:
          input.compatibility.providers.length > 0
            ? input.compatibility.providers
            : existing.compatibility.providers,
        apps:
          input.compatibility.apps.length > 0
            ? input.compatibility.apps
            : existing.compatibility.apps,
        requirements:
          input.compatibility.requirements || existing.compatibility.requirements,
        notes: input.compatibility.notes || existing.compatibility.notes,
      },
      resource_ids: mergedResources,
      content_markdown: input.content_markdown,
      updated_at: today,
      versions: contentChanged
        ? [
            {
              id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              version_number: nextNumber,
              timestamp: today,
              note: `Synced update from ${input.github_path}`,
              title: input.title,
              description: input.description || existing.description,
              content_markdown: input.content_markdown,
            },
            ...existing.versions,
          ]
        : existing.versions,
    };

    insertSkillRow(db, updated);
    return { action: "updated", skill: updated };
  }

  const today = new Date().toISOString().slice(0, 10);
  const newSkill: SkillItem = {
    id: `skill-gh-${slugifyTitle(input.slug)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`,
    slug: input.slug,
    title: input.title,
    description: input.description,
    category: input.category,
    discipline: input.discipline,
    visual_type: input.visual_type,
    tags: input.tags,
    collections: [],
    status: "ready",
    approval_status: "approved",
    approved_by: "GitHub Repository Sync",
    approved_at: new Date().toISOString(),
    publishing_status: "published",
    github_repository: input.repository,
    github_branch: input.branch,
    github_path: input.github_path,
    github_commit_sha: input.blob_sha.slice(0, 12),
    github_blob_sha: input.blob_sha,
    github_url: input.github_url,
    published_at: new Date().toISOString(),
    purpose: input.purpose,
    when_to_use: input.when_to_use,
    required_inputs: input.required_inputs,
    expected_outputs: input.expected_outputs,
    quality_standards: input.quality_standards,
    constraints_and_limitations: input.constraints_and_limitations,
    source_and_attribution: input.source_and_attribution,
    source_submission_id: null,
    content_markdown: input.content_markdown,
    preferred_provider: input.compatibility.providers[0] || "claude",
    provider_note:
      "Synced from GitHub. Copy this skill and hand off to Claude or another agent for DaVinci Resolve.",
    compatibility: input.compatibility,
    resource_ids: input.resource_ids,
    created_at: today,
    updated_at: today,
    versions: [
      {
        id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        version_number: 1,
        timestamp: today,
        note: `Synced from ${input.github_path}`,
        title: input.title,
        description: input.description,
        content_markdown: input.content_markdown,
      },
    ],
  };

  insertSkillRow(db, newSkill);
  return { action: "added", skill: newSkill };
}

export function detectResourcePlatform(urlString: string): string {
  try {
    const host = new URL(urlString).hostname.toLowerCase();
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      return "YouTube";
    }
    if (host.includes("instagram.com") || host.includes("instagr.am")) {
      return "Instagram";
    }
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("vimeo.com")) return "Vimeo";
    if (host.includes("github.com")) return "GitHub";
    if (
      host.includes("docs.") ||
      urlString.toLowerCase().includes("/docs") ||
      urlString.toLowerCase().includes("documentation")
    ) {
      return "Documentation";
    }
    return host.replace(/^www\./, "") || "Website";
  } catch {
    return "Website";
  }
}

function rowToResourceLinkSubmission(
  row: Record<string, unknown>
): ResourceLinkSubmission {
  return {
    id: String(row.id),
    url: String(row.url),
    platform: String(row.platform || "Website"),
    status: (row.status as ResourceLinkSubmission["status"]) || "queued",
    dispatch_target: row.dispatch_target ? String(row.dispatch_target) : null,
    error_message: row.error_message ? String(row.error_message) : null,
    linked_resource_id: row.linked_resource_id
      ? String(row.linked_resource_id)
      : null,
    linked_skill_id: row.linked_skill_id ? String(row.linked_skill_id) : null,
    submitted_at: String(row.submitted_at),
    completed_at: row.completed_at ? String(row.completed_at) : null,
  };
}

export function listResourceLinkSubmissions(
  statusFilter?: string
): ResourceLinkSubmission[] {
  const db = getDb();
  const rows = statusFilter
    ? (db
        .prepare(
          "SELECT * FROM resource_submissions WHERE status = ? ORDER BY submitted_at DESC"
        )
        .all(statusFilter) as Record<string, unknown>[])
    : (db
        .prepare(
          "SELECT * FROM resource_submissions ORDER BY submitted_at DESC LIMIT 50"
        )
        .all() as Record<string, unknown>[]);
  return rows.map(rowToResourceLinkSubmission);
}

export function createResourceLinkSubmission(input: {
  url: string;
}): ResourceLinkSubmission {
  const db = getDb();
  const cleanUrl = input.url.trim();
  const platform = detectResourcePlatform(cleanUrl);
  const resource = ensureResourceForExternalUrl({
    url: cleanUrl,
    title: `${platform} Resource`,
    creator: platform,
    summary: `Submitted resource link for external AI research: ${cleanUrl}`,
    tags: [platform.toLowerCase().replace(/[^a-z0-9]+/g, "-")],
  });

  const id = `rsub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const submittedAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO resource_submissions (
      id, url, platform, status, dispatch_target, error_message,
      linked_resource_id, linked_skill_id, submitted_at, completed_at
    ) VALUES (?, ?, ?, 'queued', NULL, NULL, ?, NULL, ?, NULL)`
  ).run(id, cleanUrl, platform, resource.id, submittedAt);

  return {
    id,
    url: cleanUrl,
    platform,
    status: "queued",
    dispatch_target: null,
    error_message: null,
    linked_resource_id: resource.id,
    linked_skill_id: null,
    submitted_at: submittedAt,
    completed_at: null,
  };
}

export function updateResourceLinkSubmission(
  id: string,
  updates: Partial<
    Pick<
      ResourceLinkSubmission,
      "status" | "dispatch_target" | "error_message" | "linked_skill_id" | "completed_at"
    >
  >
): ResourceLinkSubmission | null {
  const db = getDb();
  const existingRow = db
    .prepare("SELECT * FROM resource_submissions WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  if (!existingRow) return null;
  const existing = rowToResourceLinkSubmission(existingRow);

  const merged: ResourceLinkSubmission = {
    ...existing,
    ...updates,
  };
  db.prepare(
    `UPDATE resource_submissions
     SET status = ?, dispatch_target = ?, error_message = ?,
         linked_skill_id = ?, completed_at = ?
     WHERE id = ?`
  ).run(
    merged.status,
    merged.dispatch_target,
    merged.error_message,
    merged.linked_skill_id,
    merged.completed_at,
    id
  );
  return merged;
}

export function markResourceSubmissionsCompletedByUrl(
  sourceUrl: string,
  skillId: string
): void {
  const db = getDb();
  const nowIso = new Date().toISOString();
  db.prepare(
    `UPDATE resource_submissions
     SET status = 'completed', linked_skill_id = ?, completed_at = ?
     WHERE url = ? AND status != 'completed'`
  ).run(skillId, nowIso, sourceUrl.trim());
}

export function upsertExternalCompletedSkill(input: {
  title: string;
  slug?: string;
  description: string;
  category?: SkillCategory;
  discipline?: SkillDiscipline;
  visual_type?: SkillVisualType;
  tags?: string[];
  content_markdown: string;
  providers?: AIProviderId[];
  apps?: string[];
  source_url?: string;
  source_and_attribution?: string;
  github_url?: string;
  github_path?: string;
  github_commit_sha?: string;
  thumbnail_url?: string;
  purpose?: string;
}): SkillItem {
  const db = getDb();
  const cleanSlug = slugifyTitle(input.slug?.trim() || input.title.trim());
  const category: SkillCategory = input.category || "general";
  const discipline: SkillDiscipline = input.discipline || "general";
  const tags = input.tags && input.tags.length > 0 ? input.tags : [];
  const visual_type = inferSkillVisualType({
    visual_type: input.visual_type,
    category,
    discipline,
    tags,
    title: input.title,
    content_markdown: input.content_markdown,
  });

  const resourceIds: string[] = [];
  if (input.source_url?.trim()) {
    const res = ensureResourceForExternalUrl({
      url: input.source_url.trim(),
      title: `${input.title} — Source Reference`,
      creator: detectResourcePlatform(input.source_url.trim()),
      summary: input.description,
      tags: [visual_type, ...tags].slice(0, 5),
    });
    resourceIds.push(res.id);
  }

  const existingRow = db
    .prepare("SELECT * FROM skills WHERE slug = ? LIMIT 1")
    .get(cleanSlug) as Record<string, unknown> | undefined;

  const today = new Date().toISOString().slice(0, 10);
  const providers: AIProviderId[] =
    input.providers && input.providers.length > 0
      ? input.providers
      : ["chatgpt", "claude"];
  const apps =
    input.apps && input.apps.length > 0 ? input.apps : ["DaVinci Resolve"];

  const hasGithubProof = Boolean(
    input.github_url?.trim() || input.github_commit_sha?.trim()
  );

  if (existingRow) {
    const existing = rowToSkill(existingRow);
    const mergedResources = Array.from(
      new Set([...existing.resource_ids, ...resourceIds])
    );
    const nextNumber =
      (existing.versions[0]?.version_number ?? existing.versions.length) + 1;
    const updated: SkillItem = {
      ...existing,
      title: input.title.trim(),
      description: input.description.trim() || existing.description,
      category,
      discipline,
      visual_type,
      tags: tags.length > 0 ? tags : existing.tags,
      approval_status: "approved",
      approved_by: existing.approved_by || "External AI Assistant",
      approved_at: existing.approved_at || new Date().toISOString(),
      publishing_status: hasGithubProof
        ? "published"
        : existing.publishing_status,
      github_url: input.github_url?.trim() || existing.github_url || null,
      github_path:
        input.github_path?.trim() ||
        existing.github_path ||
        `skills/${cleanSlug}/SKILL.md`,
      github_commit_sha:
        input.github_commit_sha?.trim() || existing.github_commit_sha || null,
      purpose: input.purpose?.trim() || existing.purpose,
      source_and_attribution:
        input.source_and_attribution?.trim() ||
        (input.source_url?.trim()
          ? `Source: ${input.source_url.trim()}`
          : existing.source_and_attribution),
      compatibility: {
        providers,
        apps,
        requirements: existing.compatibility.requirements,
        notes: existing.compatibility.notes,
      },
      resource_ids: mergedResources,
      thumbnail_url: input.thumbnail_url?.trim() || existing.thumbnail_url,
      content_markdown: input.content_markdown.trim(),
      updated_at: today,
      versions: [
        {
          id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          version_number: nextNumber,
          timestamp: today,
          note: "Updated via external AI assistant",
          title: input.title.trim(),
          description: input.description.trim() || existing.description,
          content_markdown: input.content_markdown.trim(),
        },
        ...existing.versions,
      ],
    };
    insertSkillRow(db, updated);
    if (input.source_url?.trim()) {
      markResourceSubmissionsCompletedByUrl(input.source_url.trim(), updated.id);
    }
    return updated;
  }

  const created = createSkillInDb(
    {
      slug: cleanSlug,
      title: input.title.trim(),
      description: input.description.trim(),
      category,
      discipline,
      visual_type,
      tags,
      collections: [],
      status: "ready",
      approval_status: "approved",
      approved_by: "External AI Assistant",
      approved_at: new Date().toISOString(),
      publishing_status: hasGithubProof ? "published" : "not_ready",
      github_repository: "sombokipsmthn/Edit-Central",
      github_branch: "master",
      github_path: input.github_path?.trim() || `skills/${cleanSlug}/SKILL.md`,
      github_commit_sha: input.github_commit_sha?.trim() || null,
      github_url: input.github_url?.trim() || null,
      published_at: hasGithubProof ? new Date().toISOString() : null,
      purpose: input.purpose?.trim() || "",
      when_to_use: [],
      required_inputs: [],
      expected_outputs: [],
      quality_standards: [],
      constraints_and_limitations: [],
      source_and_attribution:
        input.source_and_attribution?.trim() ||
        (input.source_url?.trim() ? `Source: ${input.source_url.trim()}` : ""),
      content_markdown: input.content_markdown.trim(),
      preferred_provider: providers[0] || "claude",
      provider_note: "",
      compatibility: {
        providers,
        apps,
        requirements: "",
        notes: "",
      },
      resource_ids: resourceIds,
      thumbnail_url: input.thumbnail_url?.trim() || undefined,
    },
    "Created via external AI assistant"
  );

  if (input.source_url?.trim()) {
    markResourceSubmissionsCompletedByUrl(input.source_url.trim(), created.id);
  }
  return created;
}
