"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconBookmark,
  IconBrandGithub,
  IconCheck,
  IconCode,
  IconCopy,
  IconDownload,
  IconExternalLink,
  IconEye,
  IconFileCode,
  IconHistory,
  IconInbox,
  IconMessageExclamation,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarkdownViewer } from "@/components/markdown-viewer";
import {
  APPROVAL_STATUS_LABELS,
  type IntakeErrorRecord,
  type IntegrationConfigStatus,
  PUBLISHING_STATUS_LABELS,
  type StoredProposedSkill,
  type StoredSubmission,
  SUBMISSION_STATUS_LABELS,
  type SubmissionStatus,
} from "@/lib/intake-types";
import { createSampleIntakePayload } from "@/lib/intake-validation";

type ProposalFilter =
  | "all"
  | "ready_for_review"
  | "needs_improvement"
  | "reference_only"
  | "rejected";

const PROPOSAL_FILTERS: { value: ProposalFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ready_for_review", label: "Ready for Review" },
  { value: "needs_improvement", label: "Needs Improvement" },
  { value: "reference_only", label: "Reference Only" },
  { value: "rejected", label: "Rejected" },
];

export function IncomingProposalsView({
  initialSubmissionId = null,
  onWorkspaceSynced,
  onStoreChanged,
  onOpenLibrarySkill,
}: {
  initialSubmissionId?: string | null;
  onWorkspaceSynced: () => Promise<void> | void;
  onStoreChanged?: (summary: {
    pendingCount: number;
    submissions: StoredSubmission[];
    proposedSkills: StoredProposedSkill[];
  }) => void;
  onOpenLibrarySkill?: (skillId: string) => void;
}) {
  const [submissions, setSubmissions] = React.useState<StoredSubmission[]>([]);
  const [proposedSkills, setProposedSkills] = React.useState<
    StoredProposedSkill[]
  >([]);
  const [intakeErrors, setIntakeErrors] = React.useState<IntakeErrorRecord[]>(
    []
  );
  const [config, setConfig] = React.useState<IntegrationConfigStatus>({
    intakeAuthConfigured: false,
    targetRepository: "sombokipsmthn/Edit-Central",
    targetBranch: "master",
    databaseEngine: "SQLite (node:sqlite)",
  });
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [filter, setFilter] = React.useState<ProposalFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = React.useState<
    string | null
  >(initialSubmissionId);
  const [inspectingSkillId, setInspectingSkillId] = React.useState<
    string | null
  >(null);
  const [showRawMarkdown, setShowRawMarkdown] = React.useState(false);
  const [showRawPayload, setShowRawPayload] = React.useState(false);
  const [reviewerNoteDraft, setReviewerNoteDraft] = React.useState("");
  const [isActionBusy, setIsActionBusy] = React.useState(false);

  // Modals
  const [isSubmitJsonOpen, setIsSubmitJsonOpen] = React.useState(false);
  const [jsonInput, setJsonInput] = React.useState("");
  const [isLogsOpen, setIsLogsOpen] = React.useState(false);
  const [isApiGuideOpen, setIsApiGuideOpen] = React.useState(false);
  const [confirmPublishSkill, setConfirmPublishSkill] =
    React.useState<StoredProposedSkill | null>(null);
  const [confirmGithubUrl, setConfirmGithubUrl] = React.useState("");
  const [confirmCommitSha, setConfirmCommitSha] = React.useState("");
  const [confirmTargetPath, setConfirmTargetPath] = React.useState("");

  const applyIntakeResponse = React.useCallback(
    (data: {
      submissions?: StoredSubmission[];
      proposed_skills?: StoredProposedSkill[];
      intake_errors?: IntakeErrorRecord[];
      config?: IntegrationConfigStatus;
    }) => {
      const nextSubmissions = data.submissions || [];
      const nextSkills = data.proposed_skills || [];
      setSubmissions(nextSubmissions);
      setProposedSkills(nextSkills);
      setIntakeErrors(data.intake_errors || []);
      if (data.config) setConfig(data.config);
      const pendingCount = nextSkills.filter(
        (sk) => sk.approval.status === "pending"
      ).length;
      onStoreChanged?.({
        pendingCount,
        submissions: nextSubmissions,
        proposedSkills: nextSkills,
      });
    },
    [onStoreChanged]
  );

  const fetchIntakeData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/intake", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load incoming submissions (${res.status})`);
      }
      const data = (await res.json()) as {
        submissions: StoredSubmission[];
        proposed_skills: StoredProposedSkill[];
        intake_errors: IntakeErrorRecord[];
        config: IntegrationConfigStatus;
      };
      setLoadError(null);
      applyIntakeResponse(data);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load incoming submissions"
      );
    } finally {
      setLoading(false);
    }
  }, [applyIntakeResponse]);

  React.useEffect(() => {
    let cancelled = false;
    async function loadInitial() {
      try {
        const res = await fetch("/api/intake", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load incoming submissions (${res.status})`);
        }
        const data = (await res.json()) as {
          submissions: StoredSubmission[];
          proposed_skills: StoredProposedSkill[];
          intake_errors: IntakeErrorRecord[];
          config: IntegrationConfigStatus;
        };
        if (cancelled) return;
        setLoadError(null);
        applyIntakeResponse(data);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error
            ? err.message
            : "Failed to load incoming submissions"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadInitial();
    return () => {
      cancelled = true;
    };
  }, [applyIntakeResponse]);

  const selectedSubmission = React.useMemo(
    () =>
      submissions.find((s) => s.submission_id === selectedSubmissionId) || null,
    [submissions, selectedSubmissionId]
  );

  const selectedSubmissionSkills = React.useMemo(() => {
    if (!selectedSubmission) return [];
    return proposedSkills.filter(
      (sk) => sk.submission_id === selectedSubmission.submission_id
    );
  }, [proposedSkills, selectedSubmission]);

  const inspectingSkill = React.useMemo(
    () => proposedSkills.find((s) => s.id === inspectingSkillId) || null,
    [proposedSkills, inspectingSkillId]
  );

  const filteredSubmissions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return submissions.filter((sub) => {
      if (filter !== "all" && sub.submission_status !== filter) return false;
      if (!q) return true;
      const childSkills = proposedSkills.filter(
        (sk) => sk.submission_id === sub.submission_id
      );
      return (
        sub.resource.title.toLowerCase().includes(q) ||
        sub.resource.creator.toLowerCase().includes(q) ||
        sub.analysis.purpose.toLowerCase().includes(q) ||
        sub.origin.platform.toLowerCase().includes(q) ||
        childSkills.some((sk) => sk.name.toLowerCase().includes(q))
      );
    });
  }, [submissions, proposedSkills, filter, searchQuery]);

  const counts = React.useMemo(() => {
    return {
      all: submissions.length,
      ready_for_review: submissions.filter(
        (s) => s.submission_status === "ready_for_review"
      ).length,
      needs_improvement: submissions.filter(
        (s) => s.submission_status === "needs_improvement"
      ).length,
      reference_only: submissions.filter(
        (s) => s.submission_status === "reference_only"
      ).length,
      rejected: submissions.filter((s) => s.submission_status === "rejected")
        .length,
    };
  }, [submissions]);

  const handleManualJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionBusy(true);
    try {
      const res = await fetch("/api/proposals/manual-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonInput,
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        details?: string[];
        submission?: StoredSubmission;
      };
      if (!res.ok || !data.ok) {
        toast.error(
          data.details?.length
            ? `${data.error}: ${data.details.join(" ")}`
            : data.error || "Submission rejected"
        );
        await fetchIntakeData();
        return;
      }
      setIsSubmitJsonOpen(false);
      setJsonInput("");
      await fetchIntakeData();
      await onWorkspaceSynced();
      if (data.submission) {
        setSelectedSubmissionId(data.submission.submission_id);
        setReviewerNoteDraft(data.submission.reviewer_notes || "");
      }
      toast.success("Stored incoming submission and associated records");
    } catch {
      toast.error("Network error submitting JSON payload");
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleSubmissionDecision = async (
    submission: StoredSubmission,
    nextStatus: SubmissionStatus,
    action:
      | "approve_all_pending"
      | "reject_submission"
      | "reference_only"
      | "request_improvements"
  ) => {
    setIsActionBusy(true);
    try {
      const res = await fetch(
        `/api/proposals/${encodeURIComponent(submission.submission_id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submission_status: nextStatus,
            reviewer_notes: reviewerNoteDraft,
            action,
            reviewer: "sombo@mintylime.co.ke",
          }),
        }
      );
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Failed to update submission");
        return;
      }

      await fetchIntakeData();
      await onWorkspaceSynced();
      toast.success(
        `Submission marked ${SUBMISSION_STATUS_LABELS[nextStatus]}`
      );
    } catch {
      toast.error("Failed to update submission");
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleSkillUpdate = async (
    skill: StoredProposedSkill,
    payload: {
      status?: "approved" | "rejected" | "pending";
      promoteToLibrary?: boolean;
      publishing?: {
        status?: "published" | "awaiting_publish" | "not_ready" | "failed";
        target_path?: string;
        commit_sha?: string | null;
        github_url?: string | null;
      };
    },
    successMsg: string
  ) => {
    setIsActionBusy(true);
    try {
      const res = await fetch(
        `/api/proposals/skills/${encodeURIComponent(skill.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            reviewer: "sombo@mintylime.co.ke",
            decision_note: reviewerNoteDraft || undefined,
          }),
        }
      );
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Failed to update skill record");
        return;
      }
      await fetchIntakeData();
      await onWorkspaceSynced();
      toast.success(successMsg);
    } catch {
      toast.error("Failed to update skill record");
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleSaveGithubConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmPublishSkill) return;
    if (!confirmGithubUrl.trim() && !confirmCommitSha.trim()) {
      toast.error("Provide a confirmed GitHub URL or commit SHA");
      return;
    }

    await handleSkillUpdate(
      confirmPublishSkill,
      {
        status: "approved",
        promoteToLibrary: true,
        publishing: {
          status: "published",
          target_path:
            confirmTargetPath.trim() || confirmPublishSkill.publishing.target_path,
          github_url: confirmGithubUrl.trim() || null,
          commit_sha: confirmCommitSha.trim() || null,
        },
      },
      `Recorded GitHub confirmation for "${confirmPublishSkill.name}"`
    );
    setConfirmPublishSkill(null);
  };

  const handleDownloadSkillMd = (sk: StoredProposedSkill) => {
    const blob = new Blob([sk.markdown_content], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sk.slug || "skill"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${sk.slug || "skill"}.md`);
  };

  return (
    <div className="space-y-8">
      {!selectedSubmission ? (
        <>
          <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
                Incoming Submissions
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Receive structured research analyses, extracted knowledge,
                proposed Markdown skills, approval states, and confirmed{" "}
                <span className="font-mono text-xs text-foreground">
                  {config.targetRepository}@{config.targetBranch}
                </span>{" "}
                links from ChatGPT or any external AI assistant.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsApiGuideOpen(true)}
                className="cursor-pointer"
              >
                API &amp; Schema
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsLogsOpen(true)}
                className="cursor-pointer"
              >
                <IconHistory className="size-4" />
                Intake Errors ({intakeErrors.length})
              </Button>

              <Button
                type="button"
                size="lg"
                onClick={() => {
                  if (!jsonInput.trim()) {
                    setJsonInput(
                      JSON.stringify(createSampleIntakePayload(), null, 2)
                    );
                  }
                  setIsSubmitJsonOpen(true);
                }}
                className="cursor-pointer"
              >
                <IconCode className="size-4" />
                Import JSON
              </Button>
            </div>
          </section>

          {/* Storage & Intake Readiness Strip */}
          <section className="grid grid-cols-1 gap-4 rounded-[min(var(--radius-4xl),24px)] border border-border bg-card p-5 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <span>External Intake Endpoint</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    config.intakeAuthConfigured
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  {config.intakeAuthConfigured
                    ? "Token Configured"
                    : "Awaiting EDIT_CENTRAL_INTAKE_TOKEN"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                External assistants submit via{" "}
                <code className="font-mono">POST /api/intake</code> (and report
                GitHub confirmation via{" "}
                <code className="font-mono">PATCH /api/intake</code>), or import
                manually via <strong>Import JSON</strong>.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <span>Persistent Storage &amp; GitHub Link Display</span>
                <span aria-hidden="true">·</span>
                <span className="text-foreground">{config.databaseEngine}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                ChatGPT handles analysis, approval, and GitHub publishing to{" "}
                <code className="font-mono">{config.targetRepository}</code>.
                Edit Central displays verified links only when confirmation is
                supplied.
              </p>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Submission status filter"
              className="flex flex-wrap items-center gap-1 rounded-2xl border border-border bg-card p-1"
            >
              {PROPOSAL_FILTERS.map((opt) => {
                const isSelected = filter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setFilter(opt.value)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="tabular-nums opacity-75">
                      {counts[opt.value]}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-72">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resource, creator, or skill..."
                  aria-label="Search incoming submissions"
                  className="h-10 bg-card border-border"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label="Refresh submissions"
                onClick={() => void fetchIntakeData()}
                className="size-10 shrink-0 cursor-pointer"
              >
                <IconRefresh className="size-4" />
              </Button>
            </div>
          </section>

          {/* Submissions List */}
          {loading ? (
            <div className="rounded-[min(var(--radius-4xl),24px)] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Loading incoming submissions...
            </div>
          ) : loadError ? (
            <div className="rounded-[min(var(--radius-4xl),24px)] border border-destructive/40 bg-card p-8 text-center">
              <p className="text-sm text-destructive">{loadError}</p>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => void fetchIntakeData()}
                className="mt-4 cursor-pointer"
              >
                Retry
              </Button>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[min(var(--radius-4xl),24px)] border border-border bg-card px-6 py-20 text-center">
              <IconInbox className="size-8 text-muted-foreground mb-3" />
              <h2 className="font-heading text-lg font-medium text-foreground">
                No incoming submissions yet
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Send a structured JSON payload from ChatGPT or another AI
                assistant to <code className="font-mono">POST /api/intake</code>
                , or use <strong>Import JSON</strong> as a manual fallback.
              </p>
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  setJsonInput(
                    JSON.stringify(createSampleIntakePayload(), null, 2)
                  );
                  setIsSubmitJsonOpen(true);
                }}
                className="mt-5 cursor-pointer"
              >
                <IconCode className="size-4" />
                Load Sample JSON Submission
              </Button>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-5">
              {filteredSubmissions.map((sub) => {
                const childSkills = proposedSkills.filter(
                  (sk) => sk.submission_id === sub.submission_id
                );

                return (
                  <article
                    key={sub.id}
                    className="rounded-[min(var(--radius-4xl),24px)] border border-border bg-card p-6 space-y-4 transition-colors hover:border-foreground/25"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {SUBMISSION_STATUS_LABELS[sub.submission_status]}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{sub.origin.platform}</span>
                          <span aria-hidden="true">·</span>
                          <span>{sub.resource.resource_type}</span>
                          <span aria-hidden="true">·</span>
                          <span>By {sub.resource.creator}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {sub.submitted_at.slice(0, 10)}
                          </span>
                        </div>

                        <h2 className="font-heading text-xl font-semibold text-foreground text-balance">
                          {sub.resource.title}
                        </h2>

                        {sub.resource.url && (
                          <a
                            href={sub.resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline break-all"
                          >
                            <span>{sub.resource.url}</span>
                            <IconExternalLink className="size-3.5 shrink-0" />
                          </a>
                        )}
                      </div>

                      <Button
                        type="button"
                        size="lg"
                        onClick={() => {
                          setSelectedSubmissionId(sub.submission_id);
                          setReviewerNoteDraft(sub.reviewer_notes || "");
                          setShowRawPayload(false);
                        }}
                        className="shrink-0 cursor-pointer"
                      >
                        <IconEye className="size-4" />
                        Inspect Submission
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 md:grid-cols-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">
                          Analysis Summary
                        </div>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {sub.analysis.purpose || "No purpose summary provided."}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium text-foreground">
                          Knowledge Extracted (
                          <span className="tabular-nums">
                            {sub.analysis.knowledge_extracted.length}
                          </span>
                          )
                        </div>
                        {sub.analysis.knowledge_extracted.length > 0 ? (
                          <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                            {sub.analysis.knowledge_extracted
                              .slice(0, 2)
                              .map((k, idx) => (
                                <li key={idx} className="line-clamp-1">
                                  {k}
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">None listed</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium text-foreground">
                          Recommendation &amp; Access
                        </div>
                        <p className="text-muted-foreground">
                          <span className="text-foreground">
                            {sub.recommendation.type}
                          </span>{" "}
                          ({sub.recommendation.confidence} confidence)
                          {sub.recommendation.reason
                            ? ` — ${sub.recommendation.reason}`
                            : ""}
                        </p>
                        <p className="text-muted-foreground">
                          Access: {sub.resource.access_status}
                          {sub.resource.access_notes
                            ? ` · ${sub.resource.access_notes}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Proposed Skills ({childSkills.length})
                      </div>
                      {childSkills.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No proposed skills included (reference-only analysis).
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {childSkills.map((sk) => {
                            const isPubConfirmed =
                              sk.publishing.status === "published" &&
                              Boolean(
                                sk.publishing.github_url ||
                                  sk.publishing.commit_sha
                              );
                            return (
                              <div
                                key={sk.id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-xs"
                              >
                                <div className="min-w-0">
                                  <div className="font-medium text-foreground truncate">
                                    {sk.name}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    Approval:{" "}
                                    <span className="text-foreground">
                                      {APPROVAL_STATUS_LABELS[sk.approval.status]}
                                    </span>{" "}
                                    <span aria-hidden="true">·</span> GitHub:{" "}
                                    <span className="text-foreground">
                                      {isPubConfirmed
                                        ? "Published"
                                        : PUBLISHING_STATUS_LABELS[
                                            sk.publishing.status
                                          ]}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedSubmissionId(sub.submission_id);
                                    setReviewerNoteDraft(
                                      sub.reviewer_notes || ""
                                    );
                                    setInspectingSkillId(sk.id);
                                    setShowRawMarkdown(false);
                                  }}
                                  className="shrink-0 cursor-pointer"
                                >
                                  Read .md
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      ) : (
        /* Submission Full Inspection View */
        <div className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedSubmissionId(null);
                setInspectingSkillId(null);
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer self-start"
            >
              <IconArrowLeft className="size-4" />
              Back to Incoming Submissions
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="lg"
                disabled={isActionBusy}
                onClick={() =>
                  void handleSubmissionDecision(
                    selectedSubmission,
                    "ready_for_review",
                    "approve_all_pending"
                  )
                }
                className="cursor-pointer"
              >
                <IconCheck className="size-4" />
                Approve All Pending
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isActionBusy}
                onClick={() =>
                  void handleSubmissionDecision(
                    selectedSubmission,
                    "needs_improvement",
                    "request_improvements"
                  )
                }
                className="cursor-pointer"
              >
                <IconMessageExclamation className="size-4" />
                Needs Improvement
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isActionBusy}
                onClick={() =>
                  void handleSubmissionDecision(
                    selectedSubmission,
                    "reference_only",
                    "reference_only"
                  )
                }
                className="cursor-pointer"
              >
                <IconBookmark className="size-4" />
                Reference Only
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="lg"
                disabled={isActionBusy}
                onClick={() =>
                  void handleSubmissionDecision(
                    selectedSubmission,
                    "rejected",
                    "reject_submission"
                  )
                }
                className="cursor-pointer"
              >
                <IconX className="size-4" />
                Reject
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* Left: Complete Resource & Analysis Inspection */}
            <section className="rounded-[min(var(--radius-4xl),24px)] border border-border bg-card p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-border pb-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {
                      SUBMISSION_STATUS_LABELS[
                        selectedSubmission.submission_status
                      ]
                    }
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {selectedSubmission.origin.platform} (
                    {selectedSubmission.origin.assistant})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">
                    {selectedSubmission.submission_id}
                  </span>
                </div>

                <h1 className="font-heading text-2xl font-semibold text-foreground text-balance">
                  {selectedSubmission.resource.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Creator: {selectedSubmission.resource.creator}</span>
                  <span aria-hidden="true">·</span>
                  <span>Type: {selectedSubmission.resource.resource_type}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Access: {selectedSubmission.resource.access_status}
                  </span>
                  {selectedSubmission.resource.url && (
                    <>
                      <span aria-hidden="true">·</span>
                      <a
                        href={selectedSubmission.resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Open Source
                        <IconExternalLink className="size-3.5" />
                      </a>
                    </>
                  )}
                </div>

                {selectedSubmission.resource.access_notes && (
                  <p className="text-xs text-muted-foreground">
                    Access Notes: {selectedSubmission.resource.access_notes}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-muted/25 p-4 text-xs">
                <div>
                  <span className="font-medium text-foreground">
                    Assistant Recommendation:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {selectedSubmission.recommendation.type} (
                    {selectedSubmission.recommendation.confidence} confidence)
                    {selectedSubmission.recommendation.reason
                      ? ` — ${selectedSubmission.recommendation.reason}`
                      : ""}
                  </span>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="reviewer-notes" className="text-xs">
                    Organisation / Review Notes
                  </Label>
                  <Textarea
                    id="reviewer-notes"
                    rows={2}
                    value={reviewerNoteDraft}
                    onChange={(e) => setReviewerNoteDraft(e.target.value)}
                    placeholder="Add curation notes or feedback..."
                    className="text-xs bg-background"
                  />
                </div>
              </div>

              <div className="space-y-5 text-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Resource Analysis
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowRawPayload((prev) => !prev)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showRawPayload ? "Structured View" : "View Original JSON"}
                  </button>
                </div>

                {showRawPayload ? (
                  <pre className="max-h-[520px] overflow-auto rounded-2xl border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
                    {JSON.stringify(selectedSubmission.raw_payload, null, 2)}
                  </pre>
                ) : (
                  <div className="space-y-4 text-xs leading-relaxed">
                    {selectedSubmission.analysis.purpose && (
                      <div>
                        <div className="font-medium text-foreground mb-1">
                          Purpose
                        </div>
                        <p className="text-muted-foreground">
                          {selectedSubmission.analysis.purpose}
                        </p>
                      </div>
                    )}

                    {selectedSubmission.analysis.intended_audience && (
                      <div>
                        <div className="font-medium text-foreground mb-1">
                          Intended Audience
                        </div>
                        <p className="text-muted-foreground">
                          {selectedSubmission.analysis.intended_audience}
                        </p>
                      </div>
                    )}

                    {[
                      {
                        label: "Problems Addressed",
                        items: selectedSubmission.analysis.problems_addressed,
                      },
                      {
                        label: "Knowledge Extracted",
                        items: selectedSubmission.analysis.knowledge_extracted,
                      },
                      {
                        label: "Workflows",
                        items: selectedSubmission.analysis.workflows,
                      },
                      {
                        label: "Techniques",
                        items: selectedSubmission.analysis.techniques,
                      },
                      {
                        label: "Tools & Technologies",
                        items:
                          selectedSubmission.analysis.tools_and_technologies,
                      },
                      {
                        label: "Source-Supported Findings",
                        items:
                          selectedSubmission.analysis.source_supported_findings,
                      },
                      {
                        label: "Assistant Recommendations",
                        items:
                          selectedSubmission.analysis.assistant_recommendations,
                      },
                      {
                        label: "Limitations",
                        items: selectedSubmission.analysis.limitations,
                      },
                    ]
                      .filter((group) => group.items.length > 0)
                      .map((group) => (
                        <div key={group.label}>
                          <div className="font-medium text-foreground mb-1">
                            {group.label}
                          </div>
                          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                            {group.items.map((entry, idx) => (
                              <li key={idx}>{entry}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>

            {/* Right: Proposed Skills & External GitHub Status */}
            <aside className="space-y-4">
              <div className="rounded-[min(var(--radius-4xl),24px)] border border-border bg-card p-5 space-y-4">
                <h2 className="font-heading text-base font-semibold text-foreground">
                  Proposed Skills ({selectedSubmissionSkills.length})
                </h2>

                {selectedSubmissionSkills.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No skill candidates were attached to this submission.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedSubmissionSkills.map((sk) => {
                      const isApproved = sk.approval.status === "approved";
                      const isConfirmedPublished =
                        sk.publishing.status === "published" &&
                        Boolean(
                          sk.publishing.github_url || sk.publishing.commit_sha
                        );

                      return (
                        <div
                          key={sk.id}
                          className="rounded-2xl border border-border bg-background/60 p-4 space-y-3"
                        >
                          <div className="space-y-1">
                            <div className="font-heading text-base font-semibold text-foreground">
                              {sk.name}
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground break-all">
                              {sk.publishing.target_path}
                            </div>
                            {sk.description && (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {sk.description}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1 border-t border-border pt-2.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Approval
                              </span>
                              <span className="font-medium text-foreground">
                                {APPROVAL_STATUS_LABELS[sk.approval.status]}
                              </span>
                            </div>
                            {sk.approval.approved_at && (
                              <div className="text-[11px] text-muted-foreground">
                                By {sk.approval.approved_by} ·{" "}
                                {sk.approval.approved_at.slice(0, 10)}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-muted-foreground">
                                GitHub Status
                              </span>
                              <span className="font-medium text-foreground">
                                {isConfirmedPublished
                                  ? "Published"
                                  : PUBLISHING_STATUS_LABELS[
                                      sk.publishing.status
                                    ]}
                              </span>
                            </div>
                          </div>

                          {isConfirmedPublished && (
                            <div className="rounded-xl border border-border bg-muted/40 p-2.5 text-[11px] space-y-1">
                              {sk.publishing.commit_sha && (
                                <div className="font-mono text-foreground truncate">
                                  Commit: {sk.publishing.commit_sha}
                                </div>
                              )}
                              {sk.publishing.github_url && (
                                <a
                                  href={sk.publishing.github_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  View on GitHub
                                  <IconExternalLink className="size-3" />
                                </a>
                              )}
                            </div>
                          )}

                          <div className="flex flex-col gap-2 pt-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInspectingSkillId(sk.id);
                                setShowRawMarkdown(false);
                              }}
                              className="w-full cursor-pointer"
                            >
                              <IconFileCode className="size-3.5" />
                              Inspect Full Skill &amp; Markdown
                            </Button>

                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant={isApproved ? "secondary" : "default"}
                                size="sm"
                                disabled={isActionBusy || isApproved}
                                onClick={() =>
                                  void handleSkillUpdate(
                                    sk,
                                    { status: "approved", promoteToLibrary: true },
                                    `Approved "${sk.name}" and added to Skill Library`
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <IconCheck className="size-3.5" />
                                {isApproved ? "Approved" : "Approve"}
                              </Button>

                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={
                                  isActionBusy ||
                                  sk.approval.status === "rejected"
                                }
                                onClick={() =>
                                  void handleSkillUpdate(
                                    sk,
                                    { status: "rejected" },
                                    `Rejected "${sk.name}"`
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <IconX className="size-3.5" />
                                Reject
                              </Button>
                            </div>

                            {sk.linked_skill_id && onOpenLibrarySkill ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onOpenLibrarySkill(sk.linked_skill_id!)
                                }
                                className="w-full cursor-pointer"
                              >
                                Open in Skill Library
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isActionBusy}
                                onClick={() =>
                                  void handleSkillUpdate(
                                    sk,
                                    { promoteToLibrary: true },
                                    `Saved "${sk.name}" to Skill Library`
                                  )
                                }
                                className="w-full cursor-pointer"
                              >
                                Save to Skill Library
                              </Button>
                            )}

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setConfirmPublishSkill(sk);
                                setConfirmGithubUrl(
                                  sk.publishing.github_url || ""
                                );
                                setConfirmCommitSha(
                                  sk.publishing.commit_sha || ""
                                );
                                setConfirmTargetPath(
                                  sk.publishing.target_path ||
                                    sk.proposed_repository_path
                                );
                              }}
                              className="w-full cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                            >
                              <IconBrandGithub className="size-3.5" />
                              {isConfirmedPublished
                                ? "Update GitHub Confirmation"
                                : "Record GitHub Publish Link"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Inspect Full Proposed Skill Modal */}
      <Dialog
        open={Boolean(inspectingSkill)}
        onOpenChange={(open) => {
          if (!open) setInspectingSkillId(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-y-auto">
          {inspectingSkill && (
            <>
              <DialogHeader>
                <div className="text-xs text-muted-foreground font-mono">
                  {inspectingSkill.proposed_repository_path} · Approval:{" "}
                  {APPROVAL_STATUS_LABELS[inspectingSkill.approval.status]}
                </div>
                <DialogTitle className="font-heading text-xl font-semibold">
                  {inspectingSkill.name}
                </DialogTitle>
                <DialogDescription>
                  {inspectingSkill.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-xs leading-relaxed">
                {inspectingSkill.purpose && (
                  <div>
                    <div className="font-medium text-foreground mb-1">
                      Purpose
                    </div>
                    <p className="text-muted-foreground">
                      {inspectingSkill.purpose}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {inspectingSkill.when_to_use.length > 0 && (
                    <div>
                      <div className="font-medium text-foreground mb-1">
                        When to Use
                      </div>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                        {inspectingSkill.when_to_use.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inspectingSkill.required_inputs.length > 0 && (
                    <div>
                      <div className="font-medium text-foreground mb-1">
                        Required Inputs
                      </div>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                        {inspectingSkill.required_inputs.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inspectingSkill.expected_outputs.length > 0 && (
                    <div>
                      <div className="font-medium text-foreground mb-1">
                        Expected Outputs
                      </div>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                        {inspectingSkill.expected_outputs.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inspectingSkill.quality_standards.length > 0 && (
                    <div>
                      <div className="font-medium text-foreground mb-1">
                        Quality Standards
                      </div>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                        {inspectingSkill.quality_standards.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {inspectingSkill.constraints_and_limitations.length > 0 && (
                  <div>
                    <div className="font-medium text-foreground mb-1">
                      Constraints &amp; Limitations
                    </div>
                    <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                      {inspectingSkill.constraints_and_limitations.map(
                        (i, idx) => (
                          <li key={idx}>{i}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {inspectingSkill.source_and_attribution && (
                  <div>
                    <div className="font-medium text-foreground mb-1">
                      Source &amp; Attribution
                    </div>
                    <p className="text-muted-foreground">
                      {inspectingSkill.source_and_attribution}
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      Markdown Skill Content
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRawMarkdown((prev) => !prev)}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showRawMarkdown ? "Rendered View" : "Raw Markdown"}
                    </button>
                  </div>

                  {showRawMarkdown ? (
                    <pre className="max-h-80 overflow-auto rounded-2xl border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
                      {inspectingSkill.markdown_content}
                    </pre>
                  ) : (
                    <div className="max-h-80 overflow-y-auto rounded-2xl border border-border bg-muted/20 p-4">
                      <MarkdownViewer
                        content={inspectingSkill.markdown_content}
                      />
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        inspectingSkill.markdown_content
                      );
                      toast.success("Copied Markdown skill content");
                    } catch {
                      toast.error("Unable to access clipboard");
                    }
                  }}
                  className="cursor-pointer"
                >
                  <IconCopy className="size-4" />
                  Copy Markdown
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadSkillMd(inspectingSkill)}
                  className="cursor-pointer"
                >
                  <IconDownload className="size-4" />
                  Download .md
                </Button>
                <Button
                  type="button"
                  onClick={() => setInspectingSkillId(null)}
                  className="cursor-pointer"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual JSON Import Modal */}
      <Dialog open={isSubmitJsonOpen} onOpenChange={setIsSubmitJsonOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-semibold">
              Import External AI JSON Submission
            </DialogTitle>
            <DialogDescription>
              Manual fallback for testing or pasting structured JSON produced by
              ChatGPT, Claude, Gemini, or any external assistant.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleManualJsonSubmit} className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="manual-intake-json">
                Canonical Submission JSON
              </Label>
              <button
                type="button"
                onClick={() =>
                  setJsonInput(
                    JSON.stringify(createSampleIntakePayload(), null, 2)
                  )
                }
                className="text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Generate Fresh Sample Payload
              </button>
            </div>
            <Textarea
              id="manual-intake-json"
              rows={14}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono text-xs leading-relaxed"
              required
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSubmitJsonOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isActionBusy}
                className="cursor-pointer"
              >
                Import Submission
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record External GitHub Confirmation Modal */}
      <Dialog
        open={Boolean(confirmPublishSkill)}
        onOpenChange={(open) => {
          if (!open) setConfirmPublishSkill(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {confirmPublishSkill && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-lg font-semibold">
                  Record GitHub Publishing Confirmation
                </DialogTitle>
                <DialogDescription>
                  Supply the confirmed GitHub URL or commit SHA from ChatGPT’s
                  publish to{" "}
                  <code className="font-mono">
                    {config.targetRepository}@{config.targetBranch}
                  </code>
                  .
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveGithubConfirmation} className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="confirm-path">Repository Path</Label>
                  <Input
                    id="confirm-path"
                    value={confirmTargetPath}
                    onChange={(e) => setConfirmTargetPath(e.target.value)}
                    placeholder="skills/example-skill/SKILL.md"
                    className="font-mono text-xs"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="confirm-url">Confirmed GitHub File URL</Label>
                  <Input
                    id="confirm-url"
                    type="url"
                    value={confirmGithubUrl}
                    onChange={(e) => setConfirmGithubUrl(e.target.value)}
                    placeholder="https://github.com/sombokipsmthn/Edit-Central/blob/master/skills/..."
                    className="text-xs"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="confirm-sha">Confirmed Commit SHA</Label>
                  <Input
                    id="confirm-sha"
                    value={confirmCommitSha}
                    onChange={(e) => setConfirmCommitSha(e.target.value)}
                    placeholder="e.g., 7a9f2d4c..."
                    className="font-mono text-xs"
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConfirmPublishSkill(null)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isActionBusy}
                    className="cursor-pointer"
                  >
                    Save Confirmation
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* API & Schema Reference Modal */}
      <Dialog open={isApiGuideOpen} onOpenChange={setIsApiGuideOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-semibold">
              External AI Assistant Intake API
            </DialogTitle>
            <DialogDescription>
              Provider-independent JSON endpoints for ChatGPT, Claude, Gemini,
              or custom scripts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs leading-relaxed">
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5">
              <div className="font-medium text-foreground">
                1. Submit Analysis &amp; Proposed Skills
              </div>
              <div className="font-mono text-foreground">
                POST /api/intake
              </div>
              <div className="font-mono text-muted-foreground">
                Authorization: Bearer &lt;EDIT_CENTRAL_INTAKE_TOKEN&gt;
              </div>
              <p className="text-muted-foreground">
                Validates and persists resource details, extracted knowledge,
                skill Markdown, approval status, and confirmed GitHub publishing
                links. Duplicate <code className="font-mono">submission_id</code>{" "}
                values are rejected with <code className="font-mono">409</code>.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5">
              <div className="font-medium text-foreground">
                2. Report GitHub Publishing Confirmation
              </div>
              <div className="font-mono text-foreground">
                PATCH /api/intake
              </div>
              <p className="text-muted-foreground">
                Once the external assistant publishes an approved skill to{" "}
                <code className="font-mono">
                  {config.targetRepository} ({config.targetBranch})
                </code>
                , send <code className="font-mono">skill_id</code> (or{" "}
                <code className="font-mono">record_id</code>) with{" "}
                <code className="font-mono">
                  publishing: {"{ status: 'published', commit_sha, github_url, target_path }"}
                </code>
                .
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsApiGuideOpen(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Intake Error Logs Modal */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[82vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-semibold">
              Intake Validation &amp; Error Log
            </DialogTitle>
            <DialogDescription>
              Invalid, unauthorized, or duplicate external submission attempts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {intakeErrors.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">
                No intake errors recorded.
              </p>
            ) : (
              intakeErrors.map((err) => (
                <div
                  key={err.id}
                  className="rounded-xl border border-border bg-muted/30 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-medium text-destructive">
                      HTTP {err.status_code}
                    </span>
                    <span className="font-mono text-muted-foreground tabular-nums">
                      {err.timestamp}
                    </span>
                  </div>
                  <div className="text-foreground">{err.reason}</div>
                  {err.details.length > 0 && (
                    <ul className="list-disc pl-4 text-muted-foreground">
                      {err.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
