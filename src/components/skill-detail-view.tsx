"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconBraces,
  IconBrandGithub,
  IconCheck,
  IconCopy,
  IconDownload,
  IconExternalLink,
  IconFileText,
  IconLink,
  IconRefresh,
  IconRobot,
  IconTerminal2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { SkillVisualPreview } from "@/components/skill-visual-preview";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  AI_PROVIDERS,
  type AgentCopyFormat,
  formatSkillAsMarkdown,
  formatSkillForAgent,
  inferSkillVisualType,
  type ResourceItem,
  SKILL_CATEGORY_LABELS,
  SKILL_VISUAL_TYPE_LABELS,
  type SkillItem,
  slugifyTitle,
} from "@/lib/skills-data";

const AGENT_FORMAT_OPTIONS: {
  id: AgentCopyFormat;
  label: string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "prompt",
    label: "Agent Prompt",
    helper: "Paste directly into Claude, ChatGPT, Codex, Gemini, or any agent chat.",
    icon: IconRobot,
  },
  {
    id: "skill-md",
    label: "SKILL.md",
    helper: "Standard YAML frontmatter + instructions for .claude/skills/ or .agents/skills/.",
    icon: IconFileText,
  },
  {
    id: "cli",
    label: "CLI Install",
    helper: "Run in your workspace terminal to create .agents/skills/<slug>/SKILL.md.",
    icon: IconTerminal2,
  },
  {
    id: "json",
    label: "JSON",
    helper: "Structured JSON skill specification for custom agent pipelines.",
    icon: IconBraces,
  },
];

export function SkillDetailView({
  skill,
  allResources,
  onBack,
}: {
  skill: SkillItem;
  allResources: ResourceItem[];
  onBack: () => void;
}) {
  const [showRawMarkdown, setShowRawMarkdown] = React.useState(false);
  const [replayKey, setReplayKey] = React.useState(0);
  const [agentFormat, setAgentFormat] = React.useState<AgentCopyFormat>("prompt");
  const [copiedMode, setCopiedMode] = React.useState<
    "agent" | "markdown" | null
  >(null);

  const linkedResources = React.useMemo(() => {
    return skill.resource_ids
      .map((id) => allResources.find((r) => r.id === id))
      .filter((r): r is ResourceItem => Boolean(r));
  }, [skill.resource_ids, allResources]);

  const resolvedVisualType = React.useMemo(
    () => inferSkillVisualType(skill),
    [skill]
  );

  const providersLabel = React.useMemo(() => {
    if (skill.compatibility.providers.length === 0) return "ChatGPT, Claude";
    return skill.compatibility.providers
      .map((id) => AI_PROVIDERS.find((p) => p.id === id)?.label ?? id)
      .join(", ");
  }, [skill.compatibility.providers]);

  const appsLabel = React.useMemo(() => {
    if (skill.compatibility.apps.length === 0) return "";
    return skill.compatibility.apps.join(", ");
  }, [skill.compatibility.apps]);

  const primarySourceUrl = React.useMemo(() => {
    return linkedResources.find((r) => Boolean(r.url))?.url || null;
  }, [linkedResources]);

  const isPublishedOnGithub =
    skill.publishing_status === "published" && Boolean(skill.github_url);

  const agentPayload = React.useMemo(
    () => formatSkillForAgent(skill, linkedResources, agentFormat),
    [skill, linkedResources, agentFormat]
  );

  const activeAgentOption = React.useMemo(
    () =>
      AGENT_FORMAT_OPTIONS.find((opt) => opt.id === agentFormat) ??
      AGENT_FORMAT_OPTIONS[0],
    [agentFormat]
  );

  const handleCopyForAgent = async (overrideFormat?: AgentCopyFormat) => {
    const targetFormat = overrideFormat ?? agentFormat;
    const payload =
      targetFormat === agentFormat
        ? agentPayload
        : formatSkillForAgent(skill, linkedResources, targetFormat);
    const copied = await copyTextToClipboard(payload);
    if (!copied) {
      toast.error("Unable to access clipboard");
      return;
    }
    const formatLabel =
      AGENT_FORMAT_OPTIONS.find((opt) => opt.id === targetFormat)?.label ??
      "Agent";
    setCopiedMode("agent");
    toast.success(`Copied "${skill.title}" (${formatLabel}) to use in an agent`);
    window.setTimeout(() => setCopiedMode((prev) => (prev === "agent" ? null : prev)), 1800);
  };

  const handleCopyMarkdown = async () => {
    const payload = formatSkillAsMarkdown(skill, linkedResources, true);
    const copied = await copyTextToClipboard(payload);
    if (!copied) {
      toast.error("Unable to access clipboard");
      return;
    }
    setCopiedMode("markdown");
    toast.success(`Copied "${skill.title}" as Markdown`);
    window.setTimeout(() => setCopiedMode((prev) => (prev === "markdown" ? null : prev)), 1800);
  };

  const handleDownloadMarkdown = () => {
    const payload = formatSkillAsMarkdown(skill, linkedResources, true);
    const blob = new Blob([payload], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.slug || slugifyTitle(skill.title)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${skill.slug || slugifyTitle(skill.title)}.md`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Action Strip */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer self-start"
        >
          <IconArrowLeft className="size-4" />
          Back to Skill Library
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="lg"
            onClick={() => void handleCopyForAgent()}
            className="cursor-pointer whitespace-nowrap"
          >
            {copiedMode === "agent" ? (
              <>
                <IconCheck className="size-4" />
                Copied for Agent
              </>
            ) : (
              <>
                <IconCopy className="size-4" />
                Copy for Agent
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => void handleCopyMarkdown()}
            className="cursor-pointer whitespace-nowrap"
          >
            {copiedMode === "markdown" ? (
              <>
                <IconCheck className="size-4" />
                Copied .md
              </>
            ) : (
              <>
                <IconCopy className="size-4" />
                Copy Markdown
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleDownloadMarkdown}
            className="cursor-pointer whitespace-nowrap"
          >
            <IconDownload className="size-4" />
            Download .md
          </Button>
        </div>
      </div>

      {/* Main Skill Card */}
      <article className="rounded-3xl border border-border bg-card p-6 sm:p-10 space-y-8">
        {/* Header & Unboxed Metadata */}
        <header className="space-y-3 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {SKILL_CATEGORY_LABELS[skill.category]}
            </span>
            <span aria-hidden="true">·</span>
            <span>{SKILL_VISUAL_TYPE_LABELS[resolvedVisualType]}</span>
            <span aria-hidden="true">·</span>
            <span>{providersLabel}</span>
            {appsLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span>{appsLabel}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Created {skill.created_at}
            </span>
          </div>

          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
            {skill.title}
          </h1>

          {skill.description && (
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base max-w-3xl">
              {skill.description}
            </p>
          )}
        </header>

        {/* Visual Representation Stage */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Visual Preview
            </h2>
            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <IconRefresh className="size-3.5" />
              Replay
            </button>
          </div>
          <SkillVisualPreview
            skill={skill}
            variant="stage"
            replayKey={replayKey}
          />
        </section>

        {/* Copy Skill for an Agent */}
        <section className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Copy Skill for an Agent
              </h2>
              <p className="text-xs text-muted-foreground">
                {activeAgentOption.helper}
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => void handleCopyForAgent()}
              className="cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              {copiedMode === "agent" ? (
                <>
                  <IconCheck className="size-3.5" />
                  Copied {activeAgentOption.label}
                </>
              ) : (
                <>
                  <IconCopy className="size-3.5" />
                  Copy {activeAgentOption.label}
                </>
              )}
            </Button>
          </div>

          <div
            role="tablist"
            aria-label="Agent export format"
            className="flex flex-wrap items-center gap-1.5"
          >
            {AGENT_FORMAT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = opt.id === agentFormat;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setAgentFormat(opt.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "border-foreground/30 bg-background text-foreground shadow-2xs"
                      : "border-border bg-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>

          <pre className="max-h-52 overflow-auto rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground">
            {agentPayload}
          </pre>
        </section>

        {/* Original Learning Resource & GitHub Source */}
        {(primarySourceUrl ||
          linkedResources.length > 0 ||
          skill.source_and_attribution ||
          isPublishedOnGithub) && (
          <section className="space-y-3 border-b border-border pb-6 text-sm">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Original Learning Resource &amp; Source
            </h2>

            {linkedResources.length > 0 && (
              <ul className="space-y-2">
                {linkedResources.map((res) => (
                  <li key={res.id} className="text-xs leading-relaxed">
                    <div className="font-medium text-foreground">
                      {res.title}
                    </div>
                    {res.url && (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline break-all mt-0.5"
                      >
                        <IconLink className="size-3.5 shrink-0" />
                        {res.url}
                        <IconExternalLink className="size-3 shrink-0" />
                      </a>
                    )}
                    {!res.url && res.summary && (
                      <p className="text-muted-foreground mt-0.5">
                        {res.summary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {skill.source_and_attribution && (
              <p className="text-xs text-muted-foreground">
                Attribution:{" "}
                <span className="text-foreground">
                  {skill.source_and_attribution}
                </span>
              </p>
            )}

            {isPublishedOnGithub && skill.github_url && (
              <div>
                <a
                  href={skill.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <IconBrandGithub className="size-3.5" />
                  View Markdown on GitHub
                  <IconExternalLink className="size-3" />
                </a>
              </div>
            )}
          </section>
        )}

        {/* Complete Skill Instructions (Markdown) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Skill Instructions
            </h2>
            <button
              type="button"
              onClick={() => setShowRawMarkdown((prev) => !prev)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showRawMarkdown ? "Rendered View" : "Raw Markdown"}
            </button>
          </div>

          {showRawMarkdown ? (
            <pre className="max-h-[560px] overflow-auto rounded-2xl border border-border bg-muted/35 p-5 font-mono text-xs leading-relaxed text-foreground">
              {skill.content_markdown}
            </pre>
          ) : (
            <MarkdownViewer content={skill.content_markdown} />
          )}
        </section>

        {/* Additional Context & Tags */}
        {(skill.purpose ||
          (skill.when_to_use && skill.when_to_use.length > 0) ||
          (skill.constraints_and_limitations &&
            skill.constraints_and_limitations.length > 0) ||
          skill.tags.length > 0) && (
          <footer className="space-y-4 border-t border-border pt-6 text-xs leading-relaxed">
            {skill.purpose && (
              <div className="space-y-1">
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Purpose
                </h3>
                <p className="text-muted-foreground">{skill.purpose}</p>
              </div>
            )}

            {skill.when_to_use && skill.when_to_use.length > 0 && (
              <div className="space-y-1">
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  When to Use
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  {skill.when_to_use.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {skill.constraints_and_limitations &&
              skill.constraints_and_limitations.length > 0 && (
                <div className="space-y-1">
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    Constraints
                  </h3>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {skill.constraints_and_limitations.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

            {skill.tags.length > 0 && (
              <div className="pt-2 text-muted-foreground">
                Tags:{" "}
                <span className="text-foreground">
                  {skill.tags.join(" · ")}
                </span>
              </div>
            )}
          </footer>
        )}
      </article>
    </div>
  );
}
