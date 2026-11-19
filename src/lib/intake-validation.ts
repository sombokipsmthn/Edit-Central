import {
  type CanonicalIntakePayload,
  DEFAULT_GITHUB_BRANCH,
  DEFAULT_GITHUB_REPOSITORY,
  type IncomingProposedSkillInput,
  type PublishingStatus,
  type SkillApprovalStatus,
} from "@/lib/intake-types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  payload?: CanonicalIntakePayload;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function normalizeSlug(raw: string, fallbackName: string): string {
  const base = (raw || fallbackName || "skill")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "skill";
}

export function normalizeRepoPath(
  rawPath: unknown,
  slug: string
): string {
  const candidate = asString(rawPath);
  if (!candidate) {
    return `skills/${slug}/SKILL.md`;
  }
  const cleaned = candidate.replace(/^\/+/, "");
  if (cleaned.includes("..")) {
    return `skills/${slug}/SKILL.md`;
  }
  return cleaned;
}

function parseApprovalStatus(raw: unknown): SkillApprovalStatus {
  if (raw === "approved" || raw === "rejected" || raw === "pending") {
    return raw;
  }
  return "pending";
}

function resolvePublishingInfo(
  rawPub: Record<string, unknown>,
  approvalStatus: SkillApprovalStatus,
  fallbackPath: string
): {
  status: PublishingStatus;
  repository: string;
  branch: string;
  target_path: string;
  commit_sha: string | null;
  github_url: string | null;
  published_at: string | null;
} {
  const repository =
    asString(rawPub.repository) || DEFAULT_GITHUB_REPOSITORY;
  const branch = asString(rawPub.branch) || DEFAULT_GITHUB_BRANCH;
  const targetPath = asString(rawPub.target_path).replace(/^\/+/, "") || fallbackPath;
  const commitSha = asString(rawPub.commit_sha) || null;
  const githubUrl = asString(rawPub.github_url) || null;
  const hasConfirmation = Boolean(commitSha || githubUrl);

  const requestedStatus = asString(rawPub.status);
  let status: PublishingStatus = "not_ready";

  // Never pretend a skill is published unless explicit confirmation (commit_sha or github_url) is supplied
  if (requestedStatus === "published" && hasConfirmation && approvalStatus === "approved") {
    status = "published";
  } else if (requestedStatus === "failed") {
    status = "failed";
  } else if (approvalStatus === "approved") {
    status = requestedStatus === "awaiting_publish" ? "awaiting_publish" : "awaiting_publish";
  } else {
    status = "not_ready";
  }

  return {
    status,
    repository,
    branch,
    target_path: targetPath,
    commit_sha: status === "published" ? commitSha : null,
    github_url: status === "published" ? githubUrl : null,
    published_at:
      status === "published"
        ? asString(rawPub.published_at) || new Date().toISOString()
        : null,
  };
}

export function validateIntakePayload(raw: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isPlainObject(raw)) {
    return {
      valid: false,
      errors: ["Request body must be a JSON object."],
    };
  }

  const schemaVersion = asString(raw.schema_version, "1.0");
  const submissionType = asString(raw.submission_type, "skill_analysis");
  const submissionId = asString(raw.submission_id);

  if (!submissionId) {
    errors.push("Missing required field: submission_id.");
  }

  const submittedAt =
    asString(raw.submitted_at) || new Date().toISOString();

  // Origin (provider-independent, defaults cleanly if optional fields omitted)
  const originObj = isPlainObject(raw.origin) ? raw.origin : {};
  const origin = {
    platform: asString(originObj.platform, "External AI Assistant"),
    project: asString(originObj.project, "Edit Central"),
    assistant: asString(originObj.assistant, "Skill Research Assistant"),
  };

  // Resource (require at least title or url)
  if (!isPlainObject(raw.resource)) {
    errors.push("Missing required object: resource.");
  }
  const resObj = isPlainObject(raw.resource) ? raw.resource : {};
  const resourceTitle = asString(resObj.title);
  const resourceUrl = asString(resObj.url);
  if (!resourceTitle && !resourceUrl) {
    errors.push("resource.title or resource.url is required.");
  }
  const resource = {
    title: resourceTitle || resourceUrl || "Untitled Resource",
    url: resourceUrl,
    creator: asString(resObj.creator, "Unknown"),
    resource_type: asString(resObj.resource_type, "resource"),
    subject: asString(resObj.subject),
    access_status: asString(resObj.access_status, "unknown"),
    access_notes: asString(resObj.access_notes),
  };

  // Analysis (allow optional arrays/strings to be empty)
  if (!isPlainObject(raw.analysis)) {
    errors.push("Missing required object: analysis.");
  }
  const analysisObj = isPlainObject(raw.analysis) ? raw.analysis : {};
  const analysis = {
    purpose: asString(analysisObj.purpose),
    intended_audience: asString(analysisObj.intended_audience),
    problems_addressed: asStringArray(analysisObj.problems_addressed),
    knowledge_extracted: asStringArray(analysisObj.knowledge_extracted),
    workflows: asStringArray(analysisObj.workflows),
    techniques: asStringArray(analysisObj.techniques),
    tools_and_technologies: asStringArray(analysisObj.tools_and_technologies),
    limitations: asStringArray(analysisObj.limitations),
    source_supported_findings: asStringArray(
      analysisObj.source_supported_findings
    ),
    assistant_recommendations: asStringArray(
      analysisObj.assistant_recommendations
    ),
  };

  // Recommendation
  const recObj = isPlainObject(raw.recommendation) ? raw.recommendation : {};
  const recommendation = {
    type: asString(recObj.type, "new_skill"),
    reason: asString(recObj.reason),
    related_existing_skills: asStringArray(recObj.related_existing_skills),
    confidence: asString(recObj.confidence, "medium"),
  };

  // Top-level Approval & Publishing supplied by external assistant
  const topApprovalObj = isPlainObject(raw.approval) ? raw.approval : {};
  const topApprovalStatus = parseApprovalStatus(topApprovalObj.status);
  const topApprovedBy =
    asString(topApprovalObj.approved_by) ||
    (topApprovalStatus === "approved" ? origin.platform : null);
  const topApprovedAt =
    asString(topApprovalObj.approved_at) ||
    (topApprovalStatus === "approved" ? submittedAt : null);

  const topPubObj = isPlainObject(raw.publishing) ? raw.publishing : {};

  // Proposed Skills
  if (
    raw.proposed_skills !== undefined &&
    !Array.isArray(raw.proposed_skills)
  ) {
    errors.push("proposed_skills must be an array.");
  }

  const rawSkills = Array.isArray(raw.proposed_skills)
    ? raw.proposed_skills
    : [];

  const proposedSkills: IncomingProposedSkillInput[] = rawSkills.map(
    (item, idx) => {
      if (!isPlainObject(item)) {
        errors.push(`proposed_skills[${idx}] must be an object.`);
        return {
          skill_id: `skill-${idx + 1}`,
          name: `Proposed Skill ${idx + 1}`,
          slug: `proposed-skill-${idx + 1}`,
          description: "",
          purpose: "",
          when_to_use: [],
          required_inputs: [],
          expected_outputs: [],
          instructions: "",
          quality_standards: [],
          constraints_and_limitations: [],
          compatibility: [],
          source_and_attribution: "",
          markdown_content: "",
          proposed_repository_path: `skills/proposed-skill-${idx + 1}/SKILL.md`,
        };
      }

      const name = asString(item.name);
      const markdownContent =
        typeof item.markdown_content === "string" ? item.markdown_content : "";
      const instructions =
        typeof item.instructions === "string" ? item.instructions : "";

      if (!name) {
        errors.push(`proposed_skills[${idx}].name is required.`);
      }
      if (!markdownContent.trim() && !instructions.trim()) {
        errors.push(
          `proposed_skills[${idx}] requires markdown_content or instructions.`
        );
      }

      const slug = normalizeSlug(asString(item.slug), name);
      const skillId = asString(item.skill_id) || `${submissionId}-${slug}`;
      const fallbackMd = markdownContent.trim()
        ? markdownContent
        : `# ${name}\n\n${asString(item.description)}\n\n## Instructions\n${instructions}`;
      const repoPath = normalizeRepoPath(item.proposed_repository_path, slug);

      const itemApprovalObj = isPlainObject(item.approval) ? item.approval : {};
      const skillApprovalStatus =
        itemApprovalObj.status !== undefined
          ? parseApprovalStatus(itemApprovalObj.status)
          : topApprovalStatus;
      const skillApprovedBy =
        asString(itemApprovalObj.approved_by) ||
        (skillApprovalStatus === "approved" ? topApprovedBy : null);
      const skillApprovedAt =
        asString(itemApprovalObj.approved_at) ||
        (skillApprovalStatus === "approved" ? topApprovedAt : null);

      const itemPubObj = isPlainObject(item.publishing)
        ? { ...topPubObj, ...item.publishing }
        : topPubObj;
      const resolvedPub = resolvePublishingInfo(
        itemPubObj,
        skillApprovalStatus,
        repoPath
      );

      return {
        skill_id: skillId,
        name: name || `Proposed Skill ${idx + 1}`,
        slug,
        description: asString(item.description),
        purpose: asString(item.purpose),
        when_to_use: asStringArray(item.when_to_use),
        required_inputs: asStringArray(item.required_inputs),
        expected_outputs: asStringArray(item.expected_outputs),
        instructions,
        quality_standards: asStringArray(item.quality_standards),
        constraints_and_limitations: asStringArray(
          item.constraints_and_limitations
        ),
        compatibility: asStringArray(item.compatibility),
        source_and_attribution: asString(item.source_and_attribution),
        markdown_content: fallbackMd,
        proposed_repository_path: repoPath,
        category: asString(item.category),
        discipline: asString(item.discipline),
        tags: asStringArray(item.tags),
        approval: {
          status: skillApprovalStatus,
          approved_by: skillApprovedBy,
          approved_at: skillApprovedAt,
        },
        publishing: resolvedPub,
      };
    }
  );

  if (
    rawSkills.length === 0 &&
    recommendation.type !== "reference_only" &&
    recommendation.type !== "no_action"
  ) {
    errors.push(
      "proposed_skills must contain at least one skill unless recommendation.type is reference_only."
    );
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const topPubResolved = resolvePublishingInfo(
    topPubObj,
    topApprovalStatus,
    proposedSkills[0]?.proposed_repository_path || "skills/SKILL.md"
  );

  return {
    valid: true,
    errors: [],
    payload: {
      schema_version: schemaVersion,
      submission_type: submissionType,
      submission_id: submissionId,
      submitted_at: submittedAt,
      origin,
      resource,
      analysis,
      recommendation,
      proposed_skills: proposedSkills,
      approval: {
        status: topApprovalStatus,
        approved_by: topApprovedBy,
        approved_at: topApprovedAt,
      },
      publishing: {
        status: topPubResolved.status,
        repository: topPubResolved.repository,
        branch: topPubResolved.branch,
        commit_sha: topPubResolved.commit_sha,
        github_url: topPubResolved.github_url,
      },
    },
  };
}

export function createSampleIntakePayload(): CanonicalIntakePayload {
  const uniqueSuffix = Date.now().toString(36);
  return {
    schema_version: "1.0",
    submission_type: "skill_analysis",
    submission_id: `sub-chatgpt-${uniqueSuffix}`,
    submitted_at: new Date().toISOString(),
    origin: {
      platform: "ChatGPT",
      project: "Edit Central",
      assistant: "Skill Research and Discovery Assistant",
    },
    resource: {
      title: "Pacing & J-Cut Sound Bridges for Short-Form Retention",
      url: "https://example.com/resources/j-cut-sound-bridges",
      creator: "Editorial Craft Lab",
      resource_type: "video",
      subject: "Audio-led cut pacing",
      access_status: "full",
      access_notes:
        "Full transcript and visual cut timestamps inspected; no missing segments.",
    },
    analysis: {
      purpose:
        "Demonstrates how leading dialogue by 3-5 frames under ambient SFX smooths harsh visual cuts.",
      intended_audience: "Short-form documentary and creator video editors",
      problems_addressed: [
        "Abrupt silence between talking-head cuts",
        "Viewer drop-off at scene transitions",
      ],
      knowledge_extracted: [
        "Offset incoming dialogue track 3-4 frames earlier than the video cut.",
        "Bridge transition points with -18dB room tone rather than hard digital silence.",
      ],
      workflows: [
        "Transcript pass -> Rough assembly -> Audio J-cut lead pass -> Room tone bed",
      ],
      techniques: [
        "3-frame J-cut",
        "Ambient room tone overlap",
        "Transient alignment",
      ],
      tools_and_technologies: ["DaVinci Resolve", "Premiere Pro", "Final Cut Pro"],
      limitations: [
        "Requires clean separation between speech and background music stems.",
      ],
      source_supported_findings: [
        "3-frame overlap reduces perceived jumpiness without colliding with previous final syllables.",
      ],
      assistant_recommendations: [
        "Package as a portable, NLE-agnostic audio J-cut assembly skill.",
      ],
    },
    recommendation: {
      type: "new_skill",
      reason:
        "Repeatable pacing technique applicable across any editing assistant or NLE.",
      related_existing_skills: ["0.5s Pre-Hook Cut Sequence"],
      confidence: "high",
    },
    proposed_skills: [
      {
        skill_id: `j-cut-bridge-${uniqueSuffix}`,
        name: "Audio-Led J-Cut Transition",
        slug: `audio-led-j-cut-${uniqueSuffix}`,
        description:
          "Leads scene cuts by 3-5 frames of incoming audio over continuous room tone to smooth visual transitions.",
        purpose:
          "Eliminate jarring audio gaps and maintain narrative momentum across edits.",
        when_to_use: [
          "Assembling talking-head or documentary dialogue cuts",
          "Transitioning between B-roll and narration",
        ],
        required_inputs: [
          "Dialogue track with trimmed silences",
          "Ambient room tone or atmospheric bed",
        ],
        expected_outputs: [
          "Timeline cut alignment checklist and frame-offset guide",
        ],
        instructions:
          "Offset incoming vocal clips 3 to 5 frames ahead of the video cut while keeping continuous room tone underneath.",
        quality_standards: [
          "No clipped consonants on incoming dialogue",
          "Consistent -18dB to -24dB ambient bed",
        ],
        constraints_and_limitations: [
          "Avoid overlapping when music lyrics compete with foreground speech.",
        ],
        compatibility: [
          "App-Agnostic",
          "DaVinci Resolve",
          "Premiere Pro",
          "ChatGPT",
          "Claude",
          "Gemini",
        ],
        source_and_attribution:
          "Derived from Editorial Craft Lab — Pacing & J-Cut Sound Bridges.",
        markdown_content: `# Audio-Led J-Cut Transition\n\n## Purpose\nEliminate jarring audio gaps and maintain narrative momentum across dialogue and B-roll cuts.\n\n## When to Use\n- Assembling talking-head or documentary dialogue cuts\n- Transitioning between B-roll and narration\n\n## Required Inputs\n- Dialogue track with trimmed silences\n- Ambient room tone or atmospheric bed\n\n## Instructions\n1. Trim dead air on the outgoing clip right after the final breath.\n2. Pull the incoming clip's audio track 3 to 5 frames earlier than its video cut point.\n3. Apply a short 2-frame exponential audio crossfade at the splice.\n4. Maintain continuous room tone at -18dB to -24dB underneath.\n\n## Quality Standards\n- No clipped consonants on incoming dialogue.\n- Transitions feel continuous with eyes closed.\n\n## Source & Attribution\nDerived from Editorial Craft Lab — Pacing & J-Cut Sound Bridges.`,
        proposed_repository_path: `skills/audio-led-j-cut-${uniqueSuffix}/SKILL.md`,
      },
    ],
    approval: {
      status: "pending",
      approved_by: null,
      approved_at: null,
    },
    publishing: {
      status: "not_ready",
      repository: DEFAULT_GITHUB_REPOSITORY,
      branch: DEFAULT_GITHUB_BRANCH,
      commit_sha: null,
      github_url: null,
    },
  };
}
