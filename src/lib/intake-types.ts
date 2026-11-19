export type SubmissionStatus =
  | "received"
  | "processing"
  | "ready_for_review"
  | "needs_improvement"
  | "rejected"
  | "reference_only";

export type SkillApprovalStatus = "pending" | "approved" | "rejected";

export type PublishingStatus =
  | "not_ready"
  | "awaiting_publish"
  | "publishing"
  | "published"
  | "failed";

export interface SubmissionOrigin {
  platform: string;
  project: string;
  assistant: string;
}

export interface SubmissionResource {
  title: string;
  url: string;
  creator: string;
  resource_type: string;
  subject: string;
  access_status: string;
  access_notes: string;
}

export interface SubmissionAnalysis {
  purpose: string;
  intended_audience: string;
  problems_addressed: string[];
  knowledge_extracted: string[];
  workflows: string[];
  techniques: string[];
  tools_and_technologies: string[];
  limitations: string[];
  source_supported_findings: string[];
  assistant_recommendations: string[];
}

export interface SubmissionRecommendation {
  type: string;
  reason: string;
  related_existing_skills: string[];
  confidence: string;
}

export interface IncomingProposedSkillInput {
  skill_id: string;
  name: string;
  slug: string;
  description: string;
  purpose: string;
  when_to_use: string[];
  required_inputs: string[];
  expected_outputs: string[];
  instructions: string;
  quality_standards: string[];
  constraints_and_limitations: string[];
  compatibility: string[];
  source_and_attribution: string;
  markdown_content: string;
  proposed_repository_path: string;
  category?: string;
  discipline?: string;
  tags?: string[];
  approval?: {
    status?: SkillApprovalStatus;
    approved_by?: string | null;
    approved_at?: string | null;
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
}

export interface CanonicalIntakePayload {
  schema_version: string;
  submission_type: string;
  submission_id: string;
  submitted_at: string;
  origin: SubmissionOrigin;
  resource: SubmissionResource;
  analysis: SubmissionAnalysis;
  recommendation: SubmissionRecommendation;
  proposed_skills: IncomingProposedSkillInput[];
  approval: {
    status: SkillApprovalStatus;
    approved_by: string | null;
    approved_at: string | null;
  };
  publishing: {
    status: PublishingStatus;
    repository: string;
    branch: string;
    commit_sha: string | null;
    github_url: string | null;
  };
}

export interface StoredAnalysisRecord {
  id: string;
  submission_id: string;
  resource_id: string | null;
  purpose: string;
  intended_audience: string;
  problems_addressed: string[];
  knowledge_extracted: string[];
  workflows: string[];
  techniques: string[];
  tools_and_technologies: string[];
  limitations: string[];
  source_supported_findings: string[];
  assistant_recommendations: string[];
  created_at: string;
}

export interface StoredSubmission {
  id: string;
  submission_id: string;
  schema_version: string;
  submission_type: string;
  submitted_at: string;
  received_at: string;
  updated_at: string;
  submission_status: SubmissionStatus;
  reviewer_notes: string;
  origin: SubmissionOrigin;
  resource: SubmissionResource;
  analysis: SubmissionAnalysis;
  recommendation: SubmissionRecommendation;
  proposed_skill_record_ids: string[];
  raw_payload: unknown;
}

export interface SkillApprovalRecord {
  status: SkillApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  decision_note: string | null;
}

export interface SkillPublishingRecord {
  status: PublishingStatus;
  repository: string;
  branch: string;
  target_path: string;
  commit_sha: string | null;
  github_url: string | null;
  published_at: string | null;
  last_error: string | null;
  overwrite_approved: boolean;
}

export interface StoredProposedSkill {
  id: string;
  submission_id: string;
  skill_id: string;
  name: string;
  slug: string;
  description: string;
  purpose: string;
  when_to_use: string[];
  required_inputs: string[];
  expected_outputs: string[];
  instructions: string;
  quality_standards: string[];
  constraints_and_limitations: string[];
  compatibility: string[];
  source_and_attribution: string;
  markdown_content: string;
  proposed_repository_path: string;
  approval: SkillApprovalRecord;
  publishing: SkillPublishingRecord;
  linked_skill_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntakeErrorRecord {
  id: string;
  timestamp: string;
  status_code: number;
  reason: string;
  submission_id: string | null;
  origin_platform: string | null;
  details: string[];
  raw_excerpt: string;
}

export interface IntakeStoreData {
  submissions: StoredSubmission[];
  proposed_skills: StoredProposedSkill[];
  analysis_records: StoredAnalysisRecord[];
  intake_errors: IntakeErrorRecord[];
}

export interface IntegrationConfigStatus {
  intakeAuthConfigured: boolean;
  targetRepository: string;
  targetBranch: string;
  databaseEngine: string;
}

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  received: "Received",
  processing: "Processing",
  ready_for_review: "Ready for Review",
  needs_improvement: "Needs Improvement",
  rejected: "Rejected",
  reference_only: "Reference Only",
};

export const APPROVAL_STATUS_LABELS: Record<SkillApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const PUBLISHING_STATUS_LABELS: Record<PublishingStatus, string> = {
  not_ready: "Not Ready",
  awaiting_publish: "Awaiting External Publish",
  publishing: "Publishing",
  published: "Published",
  failed: "Publish Failed",
};

export const DEFAULT_GITHUB_REPOSITORY = "sombokipsmthn/Edit-Central";
export const DEFAULT_GITHUB_BRANCH = "master";
