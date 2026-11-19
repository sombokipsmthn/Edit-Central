"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconChecklist,
  IconCopy,
  IconExternalLink,
  IconFileText,
  IconLink,
  IconNote,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
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
import {
  RESOURCE_TYPE_LABELS,
  type ResourceItem,
  type ResourceType,
  type SkillItem,
} from "@/lib/skills-data";

type ResourceFilter = "all" | ResourceType;

const RESOURCE_FILTERS: { value: ResourceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "link", label: "Links" },
  { value: "note", label: "Notes" },
  { value: "checklist", label: "Checklists" },
  { value: "file", label: "Files" },
];

function ResourceIcon({ type }: { type: ResourceType }) {
  switch (type) {
    case "link":
      return <IconLink className="size-4 text-muted-foreground shrink-0" />;
    case "checklist":
      return <IconChecklist className="size-4 text-muted-foreground shrink-0" />;
    case "file":
      return <IconFileText className="size-4 text-muted-foreground shrink-0" />;
    default:
      return <IconNote className="size-4 text-muted-foreground shrink-0" />;
  }
}

export function ResourceLibraryView({
  resources,
  skills,
  onCreateResource,
  onUpdateResource,
  onDeleteResource,
  onOpenSkill,
  openNewTrigger,
}: {
  resources: ResourceItem[];
  skills: SkillItem[];
  onCreateResource: (
    draft: Omit<ResourceItem, "id" | "created_at" | "updated_at">
  ) => ResourceItem;
  onUpdateResource: (
    resourceId: string,
    updates: Partial<Omit<ResourceItem, "id" | "created_at">>
  ) => void;
  onDeleteResource: (resourceId: string) => void;
  onOpenSkill: (skillId: string) => void;
  openNewTrigger: number;
}) {
  const [typeFilter, setTypeFilter] = React.useState<ResourceFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingResource, setEditingResource] =
    React.useState<ResourceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [draftTitle, setDraftTitle] = React.useState("");
  const [draftType, setDraftType] = React.useState<ResourceType>("note");
  const [draftCreator, setDraftCreator] = React.useState("");
  const [draftTypeLabel, setDraftTypeLabel] = React.useState("");
  const [draftSubject, setDraftSubject] = React.useState("");
  const [draftUrl, setDraftUrl] = React.useState("");
  const [draftFileName, setDraftFileName] = React.useState("");
  const [draftTags, setDraftTags] = React.useState("");
  const [draftSummary, setDraftSummary] = React.useState("");
  const [draftExtractedText, setDraftExtractedText] = React.useState("");
  const [draftContent, setDraftContent] = React.useState("");

  const openCreateModal = React.useCallback(() => {
    setEditingResource(null);
    setDraftTitle("");
    setDraftType("note");
    setDraftCreator("");
    setDraftTypeLabel("");
    setDraftSubject("");
    setDraftUrl("");
    setDraftFileName("");
    setDraftTags("");
    setDraftSummary("");
    setDraftExtractedText("");
    setDraftContent("");
    setIsModalOpen(true);
  }, []);

  const prevTrigger = React.useRef(openNewTrigger);
  React.useEffect(() => {
    if (openNewTrigger !== prevTrigger.current) {
      prevTrigger.current = openNewTrigger;
      openCreateModal();
    }
  }, [openNewTrigger, openCreateModal]);

  const openEditModal = (item: ResourceItem) => {
    setEditingResource(item);
    setDraftTitle(item.title);
    setDraftType(item.type);
    setDraftCreator(item.creator || "");
    setDraftTypeLabel(item.resource_type_label || "");
    setDraftSubject(item.subject || "");
    setDraftUrl(item.url || "");
    setDraftFileName(item.file_name || "");
    setDraftTags(item.tags.join(", "));
    setDraftSummary(item.summary || "");
    setDraftExtractedText((item.extracted_knowledge || []).join("\n"));
    setDraftContent(item.content);
    setIsModalOpen(true);
  };

  const counts = React.useMemo(() => {
    return {
      all: resources.length,
      link: resources.filter((r) => r.type === "link").length,
      note: resources.filter((r) => r.type === "note").length,
      checklist: resources.filter((r) => r.type === "checklist").length,
      file: resources.filter((r) => r.type === "file").length,
    };
  }, [resources]);

  const filteredResources = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((res) => {
      if (typeFilter !== "all" && res.type !== typeFilter) return false;
      if (!q) return true;
      return (
        res.title.toLowerCase().includes(q) ||
        (res.creator || "").toLowerCase().includes(q) ||
        (res.summary || "").toLowerCase().includes(q) ||
        (res.subject || "").toLowerCase().includes(q) ||
        (res.extracted_knowledge || []).some((k) => k.toLowerCase().includes(q)) ||
        res.content.toLowerCase().includes(q) ||
        (res.url || "").toLowerCase().includes(q) ||
        res.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [resources, typeFilter, searchQuery]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setDraftType("file");
      setDraftFileName(file.name);
      if (!draftTitle.trim()) {
        setDraftTitle(file.name.replace(/\.[^.]+$/, ""));
      }
      setDraftContent(text);
      toast.success(`Loaded "${file.name}"`);
    };
    reader.onerror = () => {
      toast.error("Unable to read selected file");
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) {
      toast.error("Provide a resource title");
      return;
    }
    const parsedTags = draftTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const parsedKnowledge = draftExtractedText
      .split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);

    const payload = {
      title: draftTitle.trim(),
      type: draftType,
      creator: draftCreator.trim() || undefined,
      resource_type_label: draftTypeLabel.trim() || undefined,
      subject: draftSubject.trim() || undefined,
      url: draftType === "link" || draftUrl.trim() ? draftUrl.trim() || undefined : undefined,
      file_name: draftType === "file" ? draftFileName.trim() : undefined,
      summary: draftSummary.trim() || undefined,
      extracted_knowledge: parsedKnowledge,
      content: draftContent.trim(),
      tags: parsedTags,
    };

    if (editingResource) {
      onUpdateResource(editingResource.id, payload);
      toast.success(`Updated "${payload.title}"`);
    } else {
      onCreateResource(payload);
      toast.success(`Added "${payload.title}" to Resource Library`);
    }
    setIsModalOpen(false);
  };

  const handleCopyResource = async (item: ResourceItem) => {
    const text = [
      `# ${item.title}`,
      item.creator ? `Creator: ${item.creator}` : "",
      item.url ? `URL: ${item.url}` : "",
      item.file_name ? `File: ${item.file_name}` : "",
      item.summary ? `Summary: ${item.summary}` : "",
      item.extracted_knowledge && item.extracted_knowledge.length > 0
        ? `Extracted Knowledge:\n${item.extracted_knowledge.map((k) => `- ${k}`).join("\n")}`
        : "",
      item.content,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied "${item.title}" to clipboard`);
    } catch {
      toast.error("Unable to access clipboard");
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
            Resource Library
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Reference material, source URLs, creators, and knowledge extracted
            by external AI assistants alongside their related skills.
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={openCreateModal}
          className="shrink-0 cursor-pointer"
        >
          <IconPlus className="size-4" />
          New Resource
        </Button>
      </section>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav
          aria-label="Resource type filter"
          className="flex flex-wrap items-center gap-1 rounded-2xl border border-border bg-card p-1"
        >
          {RESOURCE_FILTERS.map((opt) => {
            const isSelected = typeFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setTypeFilter(opt.value)}
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

        <div className="relative sm:w-80">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, creator, knowledge, or tags..."
            aria-label="Search resources"
            className="h-10 pl-9 bg-card border-border"
          />
        </div>
      </section>

      {filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[min(var(--radius-4xl),24px)] border border-border bg-card px-6 py-16 text-center">
          <IconNote className="size-8 text-muted-foreground mb-3" />
          <h2 className="font-heading text-lg font-medium text-foreground">
            No matching resources
          </h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Add a reference link, checklist, note, or file—or ingest a resource
            analysis from an external AI assistant.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {(typeFilter !== "all" || searchQuery) && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setTypeFilter("all");
                  setSearchQuery("");
                }}
                className="cursor-pointer"
              >
                Clear Filters
              </Button>
            )}
            <Button
              type="button"
              size="lg"
              onClick={openCreateModal}
              className="cursor-pointer"
            >
              Add Resource
            </Button>
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res) => {
            const linkedSkills = skills.filter((s) =>
              s.resource_ids.includes(res.id)
            );
            const knowledgeList = res.extracted_knowledge || [];
            return (
              <article
                key={res.id}
                className="flex flex-col justify-between gap-4 rounded-[min(var(--radius-4xl),24px)] border border-border bg-card p-6 transition-colors duration-150 hover:border-foreground/20"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <ResourceIcon type={res.type} />
                    <span>
                      {res.resource_type_label || RESOURCE_TYPE_LABELS[res.type]}
                    </span>
                    {res.creator && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{res.creator}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {res.updated_at}
                    </span>
                  </div>

                  <h2 className="font-heading text-lg font-semibold leading-snug text-foreground text-balance">
                    {res.title}
                  </h2>

                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline break-all"
                    >
                      <span>{res.url}</span>
                      <IconExternalLink className="size-3.5 shrink-0" />
                    </a>
                  )}

                  {res.file_name && (
                    <div className="font-mono text-xs text-muted-foreground">
                      File: {res.file_name}
                    </div>
                  )}

                  {(res.summary || res.content) && (
                    <p className="line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                      {res.summary || res.content}
                    </p>
                  )}

                  {knowledgeList.length > 0 && (
                    <div className="space-y-1 border-t border-border pt-2.5 text-xs">
                      <div className="font-medium text-foreground">
                        Extracted Knowledge ({knowledgeList.length})
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                        {knowledgeList.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="line-clamp-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {res.tags.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {res.tags.join(" · ")}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-border">
                  {linkedSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>Related skills:</span>
                      {linkedSkills.map((s, idx) => (
                        <React.Fragment key={s.id}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          <button
                            type="button"
                            onClick={() => onOpenSkill(s.id)}
                            className="font-medium text-foreground hover:underline cursor-pointer"
                          >
                            {s.title}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyResource(res)}
                        className="cursor-pointer"
                      >
                        <IconCopy className="size-3.5" />
                        Copy
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(res)}
                        className="cursor-pointer"
                      >
                        <IconPencil className="size-3.5" />
                        Edit
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${res.title}`}
                      onClick={() => {
                        onDeleteResource(res.id);
                        toast.success(`Deleted "${res.title}"`);
                      }}
                      className="text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-semibold">
              {editingResource ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
            <DialogDescription>
              Store reference URLs, creators, summaries, and extracted knowledge
              from external AI research alongside your skills.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="res-title">Title</Label>
              <Input
                id="res-title"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="e.g., DaVinci Resolve Fusion Node Reference"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="res-type">Storage Type</Label>
                <select
                  id="res-type"
                  value={draftType}
                  onChange={(e) => setDraftType(e.target.value as ResourceType)}
                  className="h-8 w-full rounded-2xl border border-transparent bg-input/50 px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <option value="note">Note</option>
                  <option value="link">Link</option>
                  <option value="checklist">Checklist</option>
                  <option value="file">File</option>
                </select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="res-creator">Creator / Publisher</Label>
                <Input
                  id="res-creator"
                  value={draftCreator}
                  onChange={(e) => setDraftCreator(e.target.value)}
                  placeholder="e.g., Editorial Craft Lab"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="res-kind">Source Format</Label>
                <Input
                  id="res-kind"
                  value={draftTypeLabel}
                  onChange={(e) => setDraftTypeLabel(e.target.value)}
                  placeholder="video, article, docs..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="res-url">Original URL</Label>
                <Input
                  id="res-url"
                  type="url"
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="res-tags">Tags (comma separated)</Label>
                <Input
                  id="res-tags"
                  value={draftTags}
                  onChange={(e) => setDraftTags(e.target.value)}
                  placeholder="davinci, qa, framing"
                />
              </div>
            </div>

            {draftType === "file" && (
              <div className="grid gap-1.5">
                <Label htmlFor="res-file">Load Text / Markdown / Setting File</Label>
                <label
                  htmlFor="res-file"
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <span className="truncate">
                    {draftFileName || "Choose .md, .txt, .json, .srt, or .setting"}
                  </span>
                  <IconUpload className="size-4 shrink-0 ml-2" />
                </label>
                <input
                  id="res-file"
                  type="file"
                  accept=".md,.markdown,.txt,.json,.srt,.csv,.setting,.lua"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="res-summary">Summary</Label>
              <Textarea
                id="res-summary"
                rows={2}
                value={draftSummary}
                onChange={(e) => setDraftSummary(e.target.value)}
                placeholder="Concise summary supplied by ChatGPT or author..."
                className="text-xs"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="res-knowledge">
                Extracted Knowledge (one point per line)
              </Label>
              <Textarea
                id="res-knowledge"
                rows={3}
                value={draftExtractedText}
                onChange={(e) => setDraftExtractedText(e.target.value)}
                placeholder="Key findings or techniques extracted from this resource..."
                className="text-xs"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="res-content">Full Notes / Reference Content</Label>
              <Textarea
                id="res-content"
                rows={5}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Write notes, guidelines, or paste file content..."
                className="font-mono text-xs leading-relaxed"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" className="cursor-pointer">
                {editingResource ? "Save Resource" : "Add Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
