import crypto from "node:crypto";
import {
  createResourceInDb,
  createSkillInDb,
  getDb,
  getSkillById,
  listWorkspaceData,
  updateSkillInDb,
} from "@/lib/db";
import {
  type CanonicalIntakePayload,
  DEFAULT_GITHUB_BRANCH,
  DEFAULT_GITHUB_REPOSITORY,
  type IntakeErrorRecord,
  type IntakeStoreData,
  type IntegrationConfigStatus,
  type PublishingStatus,
  type SkillApprovalRecord,
  type SkillApprovalStatus,
  type SkillPublishingRecord,
  type StoredAnalysisRecord,
  type StoredProposedSkill,
  type StoredSubmission,
  type SubmissionStatus,
} from "@/lib/intake-types";
import type {
  AIProviderId,
  SkillCategory,
  SkillDiscipline,
} from "@/lib/skills-data";

function safeParse<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function inferSkillCategory(rawCat?: string, tags: string[] = []): SkillCategory {
  const c = (rawCat || "").toLowerCase();
  if (
    c === "text" ||
    c === "transitions" ||
    c === "graphics" ||
    c === "pacing" ||
    c === "styles" ||
    c === "general"
  ) {
    return c;
  }
  const joined = `${c} ${tags.join(" ")}`.toLowerCase();
  if (joined.includes("caption") || joined.includes("text") || joined.includes("title")) {
    return "text";
  }
  if (joined.includes("transition") || joined.includes("whip") || joined.includes("cut")) {
    return "transitions";
  }
  if (joined.includes("graphic") || joined.includes("hud") || joined.includes("overlay")) {
    return "graphics";
  }
  if (joined.includes("pacing") || joined.includes("hook") || joined.includes("j-cut")) {
    return "pacing";
  }
  if (joined.includes("color") || joined.includes("grade") || joined.includes("style")) {
    return "styles";
  }
  return "general";
}

function inferSkillDiscipline(
  rawDiscipline?: string,
  category?: SkillCategory
): SkillDiscipline {
  const d = (rawDiscipline || "").toLowerCase();
  const allowed: SkillDiscipline[] = [
    "typography-motion",
    "editorial-pacing",
    "transitions-vfx",
    "color-finishing",
    "audio-dialogue",
    "workflow-research",
    "general",
  ];
  if (allowed.includes(d as SkillDiscipline)) {
    return d as SkillDiscipline;
  }
  switch (category) {
    case "text":
      return "typography-motion";
    case "pacing":
      return "editorial-pacing";
    case "transitions":
    case "graphics":
      return "transitions-vfx";
    case "styles":
      return "color-finishing";
    default:
      return "workflow-research";
  }
}

function splitCompatibility(items: string[]): {
  providers: AIProviderId[];
  apps: string[];
} {
  const providers: AIProviderId[] = [];
  const apps: string[] = [];
  for (const item of items) {
    const lower = item.toLowerCase();
    if (lower === "chatgpt") providers.push("chatgpt");
    else if (lower === "claude") providers.push("claude");
    else if (lower === "gemini") providers.push("gemini");
    else if (lower === "codex") providers.push("codex");
    else apps.push(item);
  }
  return {
    providers:
      providers.length > 0 ? providers : ["chatgpt", "claude", "gemini"],
    apps: apps.length > 0 ? apps : ["App-Agnostic"],
  };
}

function rowToSubmission(row: Record<string, unknown>): StoredSubmission {
  return {
    id: String(row.id),
    submission_id: String(row.submission_id),
    schema_version: String(row.schema_version),
    submission_type: String(row.submission_type),
    submitted_at: String(row.submitted_at),
    received_at: String(row.received_at),
    updated_at: String(row.updated_at),
    submission_status:
      (row.submission_status as SubmissionStatus) || "ready_for_review",
    reviewer_notes: String(row.reviewer_notes || ""),
    origin: safeParse(row.origin_json, {
      platform: "External AI Assistant",
      project: "Edit Central",
      assistant: "Skill Assistant",
    }),
    resource: safeParse(row.resource_json, {
      title: "Untitled Resource",
      url: "",
      creator: "Unknown",
      resource_type: "resource",
      subject: "",
      access_status: "unknown",
      access_notes: "",
    }),
    analysis: safeParse(row.analysis_json, {
      purpose: "",
      intended_audience: "",
      problems_addressed: [],
      knowledge_extracted: [],
      workflows: [],
      techniques: [],
      tools_and_technologies: [],
      limitations: [],
      source_supported_findings: [],
      assistant_recommendations: [],
    }),
    recommendation: safeParse(row.recommendation_json, {
      type: "new_skill",
      reason: "",
      related_existing_skills: [],
      confidence: "medium",
    }),
    proposed_skill_record_ids: safeParse<string[]>(
      row.proposed_skill_record_ids_json,
      []
    ),
    raw_payload: safeParse(row.raw_payload_json, {}),
  };
}

function rowToProposedSkill(row: Record<string, unknown>): StoredProposedSkill {
  return {
    id: String(row.id),
    submission_id: String(row.submission_id),
    skill_id: String(row.skill_id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description || ""),
    purpose: String(row.purpose || ""),
    when_to_use: safeParse<string[]>(row.when_to_use_json, []),
    required_inputs: safeParse<string[]>(row.required_inputs_json, []),
    expected_outputs: safeParse<string[]>(row.expected_outputs_json, []),
    instructions: String(row.instructions || ""),
    quality_standards: safeParse<string[]>(row.quality_standards_json, []),
    constraints_and_limitations: safeParse<string[]>(
      row.constraints_and_limitations_json,
      []
    ),
    compatibility: safeParse<string[]>(row.compatibility_json, []),
    source_and_attribution: String(row.source_and_attribution || ""),
    markdown_content: String(row.markdown_content || ""),
    proposed_repository_path: String(row.proposed_repository_path || ""),
    approval: safeParse<SkillApprovalRecord>(row.approval_json, {
      status: "pending",
      approved_by: null,
      approved_at: null,
      decision_note: null,
    }),
    publishing: safeParse<SkillPublishingRecord>(row.publishing_json, {
      status: "not_ready",
      repository: DEFAULT_GITHUB_REPOSITORY,
      branch: DEFAULT_GITHUB_BRANCH,
      target_path: "",
      commit_sha: null,
      github_url: null,
      published_at: null,
      last_error: null,
      overwrite_approved: false,
    }),
    linked_skill_id: row.linked_skill_id ? String(row.linked_skill_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function rowToAnalysisRecord(row: Record<string, unknown>): StoredAnalysisRecord {
  return {
    id: String(row.id),
    submission_id: String(row.submission_id),
    resource_id: row.resource_id ? String(row.resource_id) : null,
    purpose: String(row.purpose || ""),
    intended_audience: String(row.intended_audience || ""),
    problems_addressed: safeParse<string[]>(row.problems_addressed_json, []),
    knowledge_extracted: safeParse<string[]>(row.knowledge_extracted_json, []),
    workflows: safeParse<string[]>(row.workflows_json, []),
    techniques: safeParse<string[]>(row.techniques_json, []),
    tools_and_technologies: safeParse<string[]>(
      row.tools_and_technologies_json,
      []
    ),
    limitations: safeParse<string[]>(row.limitations_json, []),
    source_supported_findings: safeParse<string[]>(
      row.source_supported_findings_json,
      []
    ),
    assistant_recommendations: safeParse<string[]>(
      row.assistant_recommendations_json,
      []
    ),
    created_at: String(row.created_at),
  };
}

function rowToIntakeError(row: Record<string, unknown>): IntakeErrorRecord {
  return {
    id: String(row.id),
    timestamp: String(row.timestamp),
    status_code: Number(row.status_code),
    reason: String(row.reason),
    submission_id: row.submission_id ? String(row.submission_id) : null,
    origin_platform: row.origin_platform ? String(row.origin_platform) : null,
    details: safeParse<string[]>(row.details_json, []),
    raw_excerpt: String(row.raw_excerpt || ""),
  };
}

export function readIntakeStore(): IntakeStoreData {
  const db = getDb();
  const submissions = (
    db
      .prepare("SELECT * FROM submissions ORDER BY received_at DESC")
      .all() as Record<string, unknown>[]
  ).map(rowToSubmission);

  const proposed_skills = (
    db
      .prepare("SELECT * FROM proposed_skills ORDER BY created_at DESC")
      .all() as Record<string, unknown>[]
  ).map(rowToProposedSkill);

  const analysis_records = (
    db
      .prepare("SELECT * FROM analysis_records ORDER BY created_at DESC")
      .all() as Record<string, unknown>[]
  ).map(rowToAnalysisRecord);

  const intake_errors = (
    db
      .prepare("SELECT * FROM intake_errors ORDER BY timestamp DESC LIMIT 100")
      .all() as Record<string, unknown>[]
  ).map(rowToIntakeError);

  return {
    submissions,
    proposed_skills,
    analysis_records,
    intake_errors,
  };
}

export function getIntegrationConfigStatus(): IntegrationConfigStatus {
  return {
    intakeAuthConfigured: Boolean(process.env.EDIT_CENTRAL_INTAKE_TOKEN?.trim()),
    targetRepository: DEFAULT_GITHUB_REPOSITORY,
    targetBranch: DEFAULT_GITHUB_BRANCH,
    databaseEngine: "SQLite (node:sqlite)",
  };
}

export function verifyIntakeToken(providedToken: string | null): boolean {
  const expected = process.env.EDIT_CENTRAL_INTAKE_TOKEN?.trim();
  if (!expected || !providedToken) return false;

  const expectedBuf = Buffer.from(expected, "utf-8");
  const providedBuf = Buffer.from(providedToken.trim(), "utf-8");
  if (expectedBuf.length !== providedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

export function logIntakeError(params: {
  status_code: number;
  reason: string;
  submission_id?: string | null;
  origin_platform?: string | null;
  details?: string[];
  raw_excerpt?: string;
}): IntakeErrorRecord {
  const db = getDb();
  const record: IntakeErrorRecord = {
    id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    status_code: params.status_code,
    reason: params.reason,
    submission_id: params.submission_id ?? null,
    origin_platform: params.origin_platform ?? null,
    details: params.details ?? [],
    raw_excerpt: (params.raw_excerpt || "").slice(0, 600),
  };

  db.prepare(
    `INSERT INTO intake_errors (
      id, timestamp, status_code, reason, submission_id, origin_platform, details_json, raw_excerpt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    record.id,
    record.timestamp,
    record.status_code,
    record.reason,
    record.submission_id,
    record.origin_platform,
    JSON.stringify(record.details),
    record.raw_excerpt
  );

  return record;
}

export function promoteProposedSkillToLibrary(
  proposed: StoredProposedSkill,
  resourceId: string | null
): string {
  const db = getDb();
  if (proposed.linked_skill_id) {
    const existing = getSkillById(proposed.linked_skill_id);
    if (existing) {
      const updated = updateSkillInDb(
        existing.id,
        {
          approval_status: proposed.approval.status,
          approved_by: proposed.approval.approved_by,
          approved_at: proposed.approval.approved_at,
          publishing_status: proposed.publishing.status,
          github_repository: proposed.publishing.repository,
          github_branch: proposed.publishing.branch,
          github_path: proposed.publishing.target_path,
          github_commit_sha: proposed.publishing.commit_sha,
          github_url: proposed.publishing.github_url,
          published_at: proposed.publishing.published_at,
          status:
            proposed.approval.status === "approved" ? "ready" : existing.status,
          resource_ids:
            resourceId && !existing.resource_ids.includes(resourceId)
              ? [...existing.resource_ids, resourceId]
              : existing.resource_ids,
        },
        { recordVersion: false }
      );
      if (updated) return updated.id;
    }
  }

  const category = inferSkillCategory(undefined, [proposed.slug, proposed.name]);
  const discipline = inferSkillDiscipline(undefined, category);
  const compat = splitCompatibility(proposed.compatibility);

  const created = createSkillInDb(
    {
      slug: proposed.slug,
      title: proposed.name,
      description: proposed.description,
      category,
      discipline,
      tags: [proposed.slug, "external-intake"].filter(Boolean),
      collections: [],
      status: proposed.approval.status === "approved" ? "ready" : "draft",
      approval_status: proposed.approval.status,
      approved_by: proposed.approval.approved_by,
      approved_at: proposed.approval.approved_at,
      publishing_status: proposed.publishing.status,
      github_repository: proposed.publishing.repository,
      github_branch: proposed.publishing.branch,
      github_path:
        proposed.publishing.target_path || proposed.proposed_repository_path,
      github_commit_sha: proposed.publishing.commit_sha,
      github_url: proposed.publishing.github_url,
      published_at: proposed.publishing.published_at,
      purpose: proposed.purpose,
      when_to_use: proposed.when_to_use,
      required_inputs: proposed.required_inputs,
      expected_outputs: proposed.expected_outputs,
      quality_standards: proposed.quality_standards,
      constraints_and_limitations: proposed.constraints_and_limitations,
      source_and_attribution: proposed.source_and_attribution,
      source_submission_id: proposed.submission_id,
      content_markdown: proposed.markdown_content,
      preferred_provider: compat.providers[0] || "any",
      provider_note: proposed.source_and_attribution,
      compatibility: {
        providers: compat.providers,
        apps: compat.apps,
        requirements: proposed.required_inputs.join("; "),
        notes: proposed.constraints_and_limitations.join(" "),
      },
      resource_ids: resourceId ? [resourceId] : [],
    },
    `Synced from submission ${proposed.submission_id}`
  );

  db.prepare(
    "UPDATE proposed_skills SET linked_skill_id = ? WHERE id = ?"
  ).run(created.id, proposed.id);

  return created.id;
}

export function createSubmissionRecords(
  payload: CanonicalIntakePayload,
  rawPayload: unknown
):
  | {
      ok: true;
      submission: StoredSubmission;
      skills: StoredProposedSkill[];
      resource_id: string | null;
    }
  | { ok: false; duplicate: true } {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM submissions WHERE submission_id = ?")
    .get(payload.submission_id);

  if (existing) {
    return { ok: false, duplicate: true };
  }

  const now = new Date().toISOString();
  const submissionRecordId = `subrec-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;

  // Store or reuse resource reference in the Resource Library
  const existingResource = listWorkspaceData().resources.find(
    (r) =>
      r.source_submission_id === payload.submission_id ||
      (payload.resource.url && r.url === payload.resource.url)
  );

  const resourceItem =
    existingResource ||
    createResourceInDb({
      title: payload.resource.title,
      type: payload.resource.url ? "link" : "note",
      url: payload.resource.url || undefined,
      creator: payload.resource.creator,
      resource_type_label: payload.resource.resource_type,
      subject: payload.resource.subject,
      summary: payload.analysis.purpose,
      extracted_knowledge: payload.analysis.knowledge_extracted,
      content: [
        payload.analysis.purpose,
        payload.analysis.knowledge_extracted.length > 0
          ? "Extracted Knowledge:\n" +
            payload.analysis.knowledge_extracted.map((k) => `- ${k}`).join("\n")
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
      tags: [
        payload.resource.resource_type,
        payload.origin.platform.toLowerCase(),
      ].filter(Boolean),
      source_submission_id: payload.submission_id,
    });

  // Persist Analysis Record
  const analysisId = `anl-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  db.prepare(
    `INSERT INTO analysis_records (
      id, submission_id, resource_id, purpose, intended_audience,
      problems_addressed_json, knowledge_extracted_json, workflows_json,
      techniques_json, tools_and_technologies_json, limitations_json,
      source_supported_findings_json, assistant_recommendations_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    analysisId,
    payload.submission_id,
    resourceItem.id,
    payload.analysis.purpose,
    payload.analysis.intended_audience,
    JSON.stringify(payload.analysis.problems_addressed),
    JSON.stringify(payload.analysis.knowledge_extracted),
    JSON.stringify(payload.analysis.workflows),
    JSON.stringify(payload.analysis.techniques),
    JSON.stringify(payload.analysis.tools_and_technologies),
    JSON.stringify(payload.analysis.limitations),
    JSON.stringify(payload.analysis.source_supported_findings),
    JSON.stringify(payload.analysis.assistant_recommendations),
    now
  );

  const skillRecords: StoredProposedSkill[] = payload.proposed_skills.map(
    (skill, idx) => {
      const approvalStatus: SkillApprovalStatus =
        skill.approval?.status || payload.approval.status || "pending";
      const approvedBy =
        skill.approval?.approved_by ??
        (approvalStatus === "approved"
          ? payload.approval.approved_by || payload.origin.platform
          : null);
      const approvedAt =
        skill.approval?.approved_at ??
        (approvalStatus === "approved"
          ? payload.approval.approved_at || now
          : null);

      const pubStatus: PublishingStatus =
        skill.publishing?.status || payload.publishing.status || "not_ready";
      const commitSha =
        pubStatus === "published"
          ? skill.publishing?.commit_sha ?? payload.publishing.commit_sha ?? null
          : null;
      const githubUrl =
        pubStatus === "published"
          ? skill.publishing?.github_url ?? payload.publishing.github_url ?? null
          : null;

      return {
        id: `pskill-${Date.now()}-${idx}-${Math.random()
          .toString(36)
          .slice(2, 6)}`,
        submission_id: payload.submission_id,
        skill_id: skill.skill_id,
        name: skill.name,
        slug: skill.slug,
        description: skill.description,
        purpose: skill.purpose,
        when_to_use: skill.when_to_use,
        required_inputs: skill.required_inputs,
        expected_outputs: skill.expected_outputs,
        instructions: skill.instructions,
        quality_standards: skill.quality_standards,
        constraints_and_limitations: skill.constraints_and_limitations,
        compatibility: skill.compatibility,
        source_and_attribution: skill.source_and_attribution,
        markdown_content: skill.markdown_content,
        proposed_repository_path: skill.proposed_repository_path,
        approval: {
          status: approvalStatus,
          approved_by: approvedBy,
          approved_at: approvedAt,
          decision_note: null,
        },
        publishing: {
          status: pubStatus,
          repository:
            skill.publishing?.repository ||
            payload.publishing.repository ||
            DEFAULT_GITHUB_REPOSITORY,
          branch:
            skill.publishing?.branch ||
            payload.publishing.branch ||
            DEFAULT_GITHUB_BRANCH,
          target_path:
            skill.publishing?.target_path || skill.proposed_repository_path,
          commit_sha: commitSha,
          github_url: githubUrl,
          published_at:
            pubStatus === "published"
              ? skill.publishing?.published_at || now
              : null,
          last_error: null,
          overwrite_approved: false,
        },
        linked_skill_id: null,
        created_at: now,
        updated_at: now,
      };
    }
  );

  for (const sk of skillRecords) {
    db.prepare(
      `INSERT INTO proposed_skills (
        id, submission_id, skill_id, name, slug, description, purpose,
        when_to_use_json, required_inputs_json, expected_outputs_json,
        instructions, quality_standards_json, constraints_and_limitations_json,
        compatibility_json, source_and_attribution, markdown_content,
        proposed_repository_path, approval_json, publishing_json, linked_skill_id,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      sk.id,
      sk.submission_id,
      sk.skill_id,
      sk.name,
      sk.slug,
      sk.description,
      sk.purpose,
      JSON.stringify(sk.when_to_use),
      JSON.stringify(sk.required_inputs),
      JSON.stringify(sk.expected_outputs),
      sk.instructions,
      JSON.stringify(sk.quality_standards),
      JSON.stringify(sk.constraints_and_limitations),
      JSON.stringify(sk.compatibility),
      sk.source_and_attribution,
      sk.markdown_content,
      sk.proposed_repository_path,
      JSON.stringify(sk.approval),
      JSON.stringify(sk.publishing),
      sk.linked_skill_id,
      sk.created_at,
      sk.updated_at
    );

    // If external assistant already received approval (e.g., approved in ChatGPT),
    // automatically index it into the Skill Library for immediate visual browsing.
    if (sk.approval.status === "approved") {
      sk.linked_skill_id = promoteProposedSkillToLibrary(sk, resourceItem.id);
    }
  }

  const initialStatus: SubmissionStatus =
    payload.recommendation.type === "reference_only"
      ? "reference_only"
      : "ready_for_review";

  const submission: StoredSubmission = {
    id: submissionRecordId,
    submission_id: payload.submission_id,
    schema_version: payload.schema_version,
    submission_type: payload.submission_type,
    submitted_at: payload.submitted_at,
    received_at: now,
    updated_at: now,
    submission_status: initialStatus,
    reviewer_notes: "",
    origin: payload.origin,
    resource: payload.resource,
    analysis: payload.analysis,
    recommendation: payload.recommendation,
    proposed_skill_record_ids: skillRecords.map((s) => s.id),
    raw_payload: rawPayload,
  };

  db.prepare(
    `INSERT INTO submissions (
      id, submission_id, schema_version, submission_type, submitted_at,
      received_at, updated_at, submission_status, reviewer_notes,
      origin_json, resource_json, analysis_json, recommendation_json,
      proposed_skill_record_ids_json, raw_payload_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    submission.id,
    submission.submission_id,
    submission.schema_version,
    submission.submission_type,
    submission.submitted_at,
    submission.received_at,
    submission.updated_at,
    submission.submission_status,
    submission.reviewer_notes,
    JSON.stringify(submission.origin),
    JSON.stringify(submission.resource),
    JSON.stringify(submission.analysis),
    JSON.stringify(submission.recommendation),
    JSON.stringify(submission.proposed_skill_record_ids),
    JSON.stringify(submission.raw_payload)
  );

  return {
    ok: true,
    submission,
    skills: skillRecords,
    resource_id: resourceItem.id,
  };
}

export function updateSubmissionDecision(params: {
  submissionId: string;
  submission_status: SubmissionStatus;
  reviewer_notes?: string;
  action?:
    | "approve_all_pending"
    | "reject_submission"
    | "reference_only"
    | "request_improvements";
  reviewer?: string;
}): {
  submission: StoredSubmission | null;
  updated_skills: StoredProposedSkill[];
} {
  const db = getDb();
  const now = new Date().toISOString();
  const reviewer = params.reviewer || "Reviewer";

  const row = db
    .prepare(
      "SELECT * FROM submissions WHERE submission_id = ? OR id = ? LIMIT 1"
    )
    .get(params.submissionId, params.submissionId) as
    | Record<string, unknown>
    | undefined;
  if (!row) {
    return { submission: null, updated_skills: [] };
  }

  const submission = rowToSubmission(row);
  submission.submission_status = params.submission_status;
  if (typeof params.reviewer_notes === "string") {
    submission.reviewer_notes = params.reviewer_notes;
  }
  submission.updated_at = now;

  db.prepare(
    "UPDATE submissions SET submission_status = ?, reviewer_notes = ?, updated_at = ? WHERE id = ?"
  ).run(
    submission.submission_status,
    submission.reviewer_notes,
    submission.updated_at,
    submission.id
  );

  const skillRows = db
    .prepare("SELECT * FROM proposed_skills WHERE submission_id = ?")
    .all(submission.submission_id) as Record<string, unknown>[];

  const analysisRow = db
    .prepare("SELECT resource_id FROM analysis_records WHERE submission_id = ? LIMIT 1")
    .get(submission.submission_id) as { resource_id?: string | null } | undefined;
  const linkedResourceId = analysisRow?.resource_id ?? null;

  const updatedSkills: StoredProposedSkill[] = [];
  for (const sRow of skillRows) {
    const skill = rowToProposedSkill(sRow);

    if (
      params.action === "approve_all_pending" &&
      skill.approval.status === "pending"
    ) {
      skill.approval = {
        status: "approved",
        approved_by: reviewer,
        approved_at: now,
        decision_note: params.reviewer_notes || null,
      };
      if (skill.publishing.status === "not_ready") {
        skill.publishing.status = "awaiting_publish";
      }
      skill.updated_at = now;
      skill.linked_skill_id = promoteProposedSkillToLibrary(
        skill,
        linkedResourceId
      );
    } else if (
      params.action === "reject_submission" &&
      skill.publishing.status !== "published"
    ) {
      skill.approval = {
        status: "rejected",
        approved_by: reviewer,
        approved_at: now,
        decision_note: params.reviewer_notes || null,
      };
      skill.publishing.status = "not_ready";
      skill.updated_at = now;
    } else if (
      params.action === "reference_only" &&
      skill.approval.status === "pending"
    ) {
      skill.publishing.status = "not_ready";
      skill.updated_at = now;
    }

    db.prepare(
      "UPDATE proposed_skills SET approval_json = ?, publishing_json = ?, linked_skill_id = ?, updated_at = ? WHERE id = ?"
    ).run(
      JSON.stringify(skill.approval),
      JSON.stringify(skill.publishing),
      skill.linked_skill_id,
      skill.updated_at,
      skill.id
    );

    updatedSkills.push(skill);
  }

  return { submission, updated_skills: updatedSkills };
}

export function updateProposedSkillRecord(params: {
  recordId: string;
  status?: SkillApprovalStatus;
  reviewer?: string;
  decision_note?: string;
  publishing?: {
    status?: PublishingStatus;
    repository?: string;
    branch?: string;
    target_path?: string;
    commit_sha?: string | null;
    github_url?: string | null;
    published_at?: string | null;
  };
  promoteToLibrary?: boolean;
}): StoredProposedSkill | null {
  const db = getDb();
  const now = new Date().toISOString();
  const row = db
    .prepare(
      "SELECT * FROM proposed_skills WHERE id = ? OR skill_id = ? LIMIT 1"
    )
    .get(params.recordId, params.recordId) as
    | Record<string, unknown>
    | undefined;

  if (!row) return null;

  const skill = rowToProposedSkill(row);
  const reviewer = params.reviewer || "Reviewer";

  if (params.status) {
    if (params.status === "approved") {
      skill.approval = {
        status: "approved",
        approved_by: reviewer,
        approved_at: now,
        decision_note: params.decision_note || null,
      };
      if (
        skill.publishing.status === "not_ready" ||
        skill.publishing.status === "failed"
      ) {
        skill.publishing.status = "awaiting_publish";
        skill.publishing.last_error = null;
      }
    } else if (params.status === "rejected") {
      skill.approval = {
        status: "rejected",
        approved_by: reviewer,
        approved_at: now,
        decision_note: params.decision_note || null,
      };
      if (skill.publishing.status !== "published") {
        skill.publishing.status = "not_ready";
      }
    } else {
      skill.approval = {
        status: "pending",
        approved_by: null,
        approved_at: null,
        decision_note: null,
      };
      if (skill.publishing.status !== "published") {
        skill.publishing.status = "not_ready";
      }
    }
  }

  if (params.publishing) {
    const commitSha =
      params.publishing.commit_sha !== undefined
        ? params.publishing.commit_sha
        : skill.publishing.commit_sha;
    const githubUrl =
      params.publishing.github_url !== undefined
        ? params.publishing.github_url
        : skill.publishing.github_url;
    const hasConfirmation = Boolean(commitSha?.trim() || githubUrl?.trim());

    let nextPubStatus = params.publishing.status ?? skill.publishing.status;
    if (nextPubStatus === "published" && !hasConfirmation) {
      nextPubStatus =
        skill.approval.status === "approved" ? "awaiting_publish" : "not_ready";
    }

    skill.publishing = {
      ...skill.publishing,
      status: nextPubStatus,
      repository: params.publishing.repository || skill.publishing.repository,
      branch: params.publishing.branch || skill.publishing.branch,
      target_path: params.publishing.target_path || skill.publishing.target_path,
      commit_sha: commitSha,
      github_url: githubUrl,
      published_at:
        nextPubStatus === "published"
          ? params.publishing.published_at || skill.publishing.published_at || now
          : null,
      last_error:
        nextPubStatus === "published" ? null : skill.publishing.last_error,
    };
  }

  skill.updated_at = now;

  const analysisRow = db
    .prepare("SELECT resource_id FROM analysis_records WHERE submission_id = ? LIMIT 1")
    .get(skill.submission_id) as { resource_id?: string | null } | undefined;
  const linkedResourceId = analysisRow?.resource_id ?? null;

  if (
    params.promoteToLibrary ||
    skill.approval.status === "approved" ||
    skill.linked_skill_id
  ) {
    skill.linked_skill_id = promoteProposedSkillToLibrary(
      skill,
      linkedResourceId
    );
  }

  db.prepare(
    "UPDATE proposed_skills SET approval_json = ?, publishing_json = ?, linked_skill_id = ?, updated_at = ? WHERE id = ?"
  ).run(
    JSON.stringify(skill.approval),
    JSON.stringify(skill.publishing),
    skill.linked_skill_id,
    skill.updated_at,
    skill.id
  );

  db.prepare("UPDATE submissions SET updated_at = ? WHERE submission_id = ?").run(
    now,
    skill.submission_id
  );

  return skill;
}
