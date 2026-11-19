"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  IconBook,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconLayoutGrid,
  IconLink,
  IconMoon,
  IconPlus,
  IconSearch,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SkillDetailView } from "@/components/skill-detail-view";
import { SkillVisualPreview } from "@/components/skill-visual-preview";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  AI_PROVIDERS,
  formatSkillForAgent,
  inferSkillVisualType,
  type ResourceItem,
  SKILL_CATEGORY_LABELS,
  SKILL_VISUAL_TYPE_LABELS,
  type SkillItem,
} from "@/lib/skills-data";
import type { GithubSyncState, ResourceLinkSubmission } from "@/lib/db";
import { useWorkspaceStore } from "@/lib/skills-store";

const emptySubscribe = () => () => {};

function formatSourceHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function EditCentralApp() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { skills, resources, refreshWorkspace } = useWorkspaceStore();

  const [selectedSkillId, setSelectedSkillId] = React.useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  // Add Skill (resource link submission) dialog
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [resourceUrl, setResourceUrl] = React.useState("");
  const [isSubmittingLink, setIsSubmittingLink] = React.useState(false);
  const [recentSubmissions, setRecentSubmissions] = React.useState<
    ResourceLinkSubmission[]
  >([]);
  const [lastSubmitted, setLastSubmitted] =
    React.useState<ResourceLinkSubmission | null>(null);
  const [copiedSubmissionId, setCopiedSubmissionId] = React.useState<
    string | null
  >(null);
  const [copiedSkillId, setCopiedSkillId] = React.useState<string | null>(null);

  // Silent background GitHub repo sync polling
  const [pollSeconds, setPollSeconds] = React.useState<number>(60);
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState<boolean>(true);
  const syncInFlightRef = React.useRef(false);

  React.useEffect(() => {
    let cancelled = false;
    async function loadSyncConfig() {
      try {
        const res = await fetch("/api/github-sync", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { state?: GithubSyncState };
        if (cancelled || !data.state) return;
        setAutoSyncEnabled(data.state.auto_sync_enabled);
        setPollSeconds(Math.max(15, data.state.poll_interval_seconds || 60));
      } catch {
        // Keep defaults
      }
    }
    void loadSyncConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!autoSyncEnabled) return;
    const intervalMs = Math.max(15, pollSeconds) * 1000;
    const timer = window.setInterval(() => {
      if (syncInFlightRef.current) return;
      syncInFlightRef.current = true;
      void fetch("/api/github-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then(
          (data: { added?: number; updated?: number } | null) => {
            if (data && ((data.added ?? 0) > 0 || (data.updated ?? 0) > 0)) {
              void refreshWorkspace();
              toast.success("New skill synced to your library");
            }
          }
        )
        .catch(() => {
          // Silent background poll
        })
        .finally(() => {
          syncInFlightRef.current = false;
        });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoSyncEnabled, pollSeconds, refreshWorkspace]);

  const loadRecentSubmissions = React.useCallback(async () => {
    try {
      const res = await fetch("/api/resource-submissions", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        submissions?: ResourceLinkSubmission[];
      };
      if (Array.isArray(data.submissions)) {
        setRecentSubmissions(data.submissions.slice(0, 5));
      }
    } catch {
      // Ignore fetch failure
    }
  }, []);

  const openAddSkillModal = () => {
    setResourceUrl("");
    setLastSubmitted(null);
    setIsAddOpen(true);
    void loadRecentSubmissions();
  };

  const handleSubmitResourceLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = resourceUrl.trim();
    if (!trimmed) {
      toast.error("Paste a resource link to submit");
      return;
    }

    setIsSubmittingLink(true);
    try {
      const res = await fetch("/api/resource-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        submission?: ResourceLinkSubmission;
        webhookConfigured?: boolean;
        error?: string;
      };
      if (!res.ok || !data.submission) {
        toast.error(data.error || "Unable to submit link");
        return;
      }

      setLastSubmitted(data.submission);
      setResourceUrl("");
      setRecentSubmissions((prev) =>
        [data.submission!, ...prev.filter((s) => s.id !== data.submission!.id)].slice(
          0,
          5
        )
      );
      toast.success(
        data.submission.status === "forwarded"
          ? `${data.submission.platform} link sent to your AI assistant`
          : `${data.submission.platform} link queued for ChatGPT / Claude`
      );
    } catch {
      toast.error("Unable to submit link");
    } finally {
      setIsSubmittingLink(false);
    }
  };

  const handleCopyForAssistant = async (sub: ResourceLinkSubmission) => {
    const prompt = `Research this ${sub.platform} resource and extract reusable skills for Edit Central:\n${sub.url}`;
    const copied = await copyTextToClipboard(prompt);
    if (!copied) {
      toast.error("Unable to access clipboard");
      return;
    }
    setCopiedSubmissionId(sub.id);
    toast.success("Copied link prompt for ChatGPT / Claude");
    window.setTimeout(() => {
      setCopiedSubmissionId((prev) => (prev === sub.id ? null : prev));
    }, 1800);
  };

  const handleQuickCopySkillForAgent = async (
    e: React.MouseEvent,
    skill: SkillItem,
    linkedResources: ResourceItem[]
  ) => {
    e.stopPropagation();
    const payload = formatSkillForAgent(skill, linkedResources, "prompt");
    const copied = await copyTextToClipboard(payload);
    if (!copied) {
      toast.error("Unable to access clipboard");
      return;
    }
    setCopiedSkillId(skill.id);
    toast.success(`Copied "${skill.title}" to use in an agent`);
    window.setTimeout(() => {
      setCopiedSkillId((prev) => (prev === skill.id ? null : prev));
    }, 1800);
  };

  const activeSkills = React.useMemo(
    () => skills.filter((s) => s.status !== "archived"),
    [skills]
  );

  const activeSkill = React.useMemo(
    () => activeSkills.find((s) => s.id === selectedSkillId) || null,
    [activeSkills, selectedSkillId]
  );

  const filteredSkills = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeSkills;

    return activeSkills.filter((skill) => {
      const categoryLabel = SKILL_CATEGORY_LABELS[skill.category].toLowerCase();
      const visualTypeLabel =
        SKILL_VISUAL_TYPE_LABELS[inferSkillVisualType(skill)].toLowerCase();
      const providerLabels = skill.compatibility.providers
        .map((id) => AI_PROVIDERS.find((p) => p.id === id)?.label ?? id)
        .join(" ")
        .toLowerCase();
      const linkedResourcesText = skill.resource_ids
        .map((id) => resources.find((r) => r.id === id))
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .map((r) => `${r.title} ${r.url || ""} ${r.creator || ""}`)
        .join(" ")
        .toLowerCase();

      return (
        skill.title.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q) ||
        categoryLabel.includes(q) ||
        visualTypeLabel.includes(q) ||
        skill.tags.some((t) => t.toLowerCase().includes(q)) ||
        skill.compatibility.apps.some((a) => a.toLowerCase().includes(q)) ||
        skill.compatibility.providers.some((p) => p.toLowerCase().includes(q)) ||
        providerLabels.includes(q) ||
        (skill.source_and_attribution || "").toLowerCase().includes(q) ||
        linkedResourcesText.includes(q)
      );
    });
  }, [activeSkills, resources, searchQuery]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Minimal Header: Logo + Name and Add Skill CTA */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
          <button
            type="button"
            onClick={() => {
              setSelectedSkillId(null);
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight text-foreground whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <IconLayoutGrid className="size-4" />
            </span>
            <span>Edit Central</span>
          </button>

          <Button
            type="button"
            size="lg"
            onClick={openAddSkillModal}
            className="whitespace-nowrap shrink-0 cursor-pointer"
          >
            <IconPlus className="size-4" />
            Add Skill
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 md:py-12">
        {activeSkill ? (
          <SkillDetailView
            skill={activeSkill}
            allResources={resources}
            onBack={() => setSelectedSkillId(null)}
          />
        ) : (
          <div className="space-y-10">
            {/* Prominent Search Bar */}
            <section className="mx-auto max-w-2xl space-y-3 text-center">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
                AI Skill Library
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Visual skills researched and structured by ChatGPT and Claude.
              </p>

              <div className="relative pt-2">
                <IconSearch className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 mt-1 text-muted-foreground" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by skill name, description, category, tags, or AI assistant..."
                  aria-label="Search skills"
                  className="h-12 rounded-2xl border-border bg-card pl-12 pr-10 text-sm shadow-xs"
                />
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 mt-1 rounded-lg p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <IconX className="size-4" />
                  </button>
                )}
              </div>

              {searchQuery.trim().length > 0 && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  Showing{" "}
                  <strong className="font-medium text-foreground">
                    {filteredSkills.length}
                  </strong>{" "}
                  of {activeSkills.length} skills
                </p>
              )}
            </section>

            {/* Visual Grid of Skill Cards */}
            {filteredSkills.length === 0 ? (
              <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl border border-border bg-card px-6 py-16 text-center">
                <IconBook className="size-8 text-muted-foreground mb-3" />
                <h2 className="font-heading text-lg font-medium text-foreground">
                  No matching skills
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery.trim()
                    ? "Try searching another keyword, category, tag, or AI assistant."
                    : "Click Add Skill to submit a YouTube, Instagram, or article link."}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  {searchQuery.trim() ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className="cursor-pointer"
                    >
                      Clear Search
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    onClick={openAddSkillModal}
                    className="cursor-pointer"
                  >
                    <IconPlus className="size-4" />
                    Add Skill
                  </Button>
                </div>
              </div>
            ) : (
              <section
                aria-label="Skill cards"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredSkills.map((skill) => {
                  const linkedResources = skill.resource_ids
                    .map((id) => resources.find((r) => r.id === id))
                    .filter((r): r is NonNullable<typeof r> => Boolean(r));
                  const sourceResource = linkedResources.find((r) =>
                    Boolean(r.url)
                  );

                  const providersText =
                    skill.compatibility.providers.length > 0
                      ? skill.compatibility.providers
                          .slice(0, 2)
                          .map(
                            (id) =>
                              AI_PROVIDERS.find((p) => p.id === id)?.label ?? id
                          )
                          .join(", ")
                      : "ChatGPT, Claude";
                  const primaryApp = skill.compatibility.apps[0];
                  const compatSummary = primaryApp
                    ? `${providersText} · ${primaryApp}`
                    : providersText;

                  return (
                    <article
                      key={skill.id}
                      onClick={() => setSelectedSkillId(skill.id)}
                      className="group flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-5 transition-colors duration-150 hover:border-foreground/30 cursor-pointer"
                    >
                      <div className="space-y-4">
                        <SkillVisualPreview skill={skill} variant="card" />

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/85">
                              {SKILL_CATEGORY_LABELS[skill.category]}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{compatSummary}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-[11px] tabular-nums shrink-0">
                              {skill.created_at}
                            </span>
                          </div>

                          <h2 className="font-heading text-lg font-semibold leading-snug text-foreground text-balance group-hover:text-primary transition-colors">
                            {skill.title}
                          </h2>

                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {skill.description || skill.content_markdown}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                        {sourceResource?.url ? (
                          <a
                            href={sourceResource.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex min-w-0 items-center gap-1.5 text-foreground/80 hover:text-primary hover:underline"
                          >
                            <IconLink className="size-3.5 shrink-0" />
                            <span className="truncate">
                              {formatSourceHostname(sourceResource.url)}
                            </span>
                            <IconExternalLink className="size-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="truncate">
                            {skill.source_and_attribution || "Skill Library"}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) =>
                            void handleQuickCopySkillForAgent(
                              e,
                              skill,
                              linkedResources
                            )
                          }
                          aria-label={`Copy ${skill.title} to use in an agent`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
                        >
                          {copiedSkillId === skill.id ? (
                            <>
                              <IconCheck className="size-3.5 text-primary" />
                              Copied
                            </>
                          ) : (
                            <>
                              <IconCopy className="size-3.5" />
                              Copy for Agent
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <p className="text-xs text-muted-foreground">
            Edit Central <span aria-hidden="true">·</span> Visual AI Skill
            Library
          </p>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={toggleTheme}
            aria-label={
              mounted && resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              mounted && resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="size-10 shrink-0 cursor-pointer"
          >
            {mounted && resolvedTheme === "dark" ? (
              <IconSun className="size-4" />
            ) : (
              <IconMoon className="size-4" />
            )}
          </Button>
        </div>
      </footer>

      {/* Add Skill (Paste Resource Link) Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-semibold">
              Add Skill from Resource
            </DialogTitle>
            <DialogDescription>
              Paste a YouTube, Instagram, website, article, tutorial, or
              documentation link. Your external ChatGPT or Claude workflow will
              research it and send the finished skill here.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitResourceLink} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="resource-link-input">Resource Link</Label>
              <Input
                id="resource-link-input"
                type="url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://instagram.com/reel/..."
                className="h-11"
                autoFocus
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsAddOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmittingLink}
                className="cursor-pointer"
              >
                {isSubmittingLink ? "Submitting..." : "Submit Link"}
              </Button>
            </DialogFooter>
          </form>

          {lastSubmitted && (
            <div className="rounded-2xl border border-border bg-muted/30 p-3.5 text-xs space-y-2">
              <div className="font-medium text-foreground">
                {lastSubmitted.status === "forwarded"
                  ? `${lastSubmitted.platform} link sent to your AI assistant`
                  : `${lastSubmitted.platform} link saved for ChatGPT / Claude`}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-muted-foreground">
                  {lastSubmitted.url}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCopyForAssistant(lastSubmitted)}
                  className="shrink-0 cursor-pointer"
                >
                  {copiedSubmissionId === lastSubmitted.id ? (
                    <>
                      <IconCheck className="size-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <IconCopy className="size-3.5" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {recentSubmissions.length > 0 && (
            <div className="border-t border-border pt-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Recently Submitted Links
              </div>
              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {recentSubmissions.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <a
                      href={sub.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-foreground hover:underline"
                    >
                      {sub.platform} · {formatSourceHostname(sub.url)}
                    </a>
                    <span className="text-muted-foreground capitalize shrink-0">
                      {sub.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
