"use client";

import * as React from "react";
import {
  type CustomCollection,
  INITIAL_COLLECTIONS,
  INITIAL_RESOURCES,
  INITIAL_SKILLS,
  type ResourceItem,
  type SkillItem,
  type SkillVersion,
  slugifyTitle,
} from "@/lib/skills-data";

export interface WorkspaceState {
  skills: SkillItem[];
  resources: ResourceItem[];
  collections: CustomCollection[];
}

const INITIAL_WORKSPACE: WorkspaceState = {
  skills: INITIAL_SKILLS,
  resources: INITIAL_RESOURCES,
  collections: INITIAL_COLLECTIONS,
};

export function useWorkspaceStore() {
  const [workspace, setWorkspace] =
    React.useState<WorkspaceState>(INITIAL_WORKSPACE);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const refreshWorkspace = React.useCallback(async () => {
    try {
      const res = await fetch("/api/workspace", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as Partial<WorkspaceState>;
      if (
        Array.isArray(data.skills) &&
        Array.isArray(data.resources) &&
        Array.isArray(data.collections)
      ) {
        setWorkspace({
          skills: data.skills,
          resources: data.resources,
          collections: data.collections,
        });
      }
    } catch {
      // Keep current snapshot if offline
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/workspace", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<WorkspaceState>;
        if (
          !cancelled &&
          Array.isArray(data.skills) &&
          Array.isArray(data.resources) &&
          Array.isArray(data.collections)
        ) {
          setWorkspace({
            skills: data.skills,
            resources: data.resources,
            collections: data.collections,
          });
        }
      } catch {
        // Fallback to initial seed snapshot
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const createSkill = React.useCallback(
    (
      draft: Omit<SkillItem, "id" | "created_at" | "updated_at" | "versions"> & {
        slug?: string;
      },
      versionNote = "Initial version"
    ): SkillItem => {
      const today = new Date().toISOString().slice(0, 10);
      const tempId = `skill-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      const slug = draft.slug?.trim() || slugifyTitle(draft.title);
      const optimistic: SkillItem = {
        ...draft,
        id: tempId,
        slug,
        discipline: draft.discipline || "general",
        collections: draft.collections || [],
        approval_status: draft.approval_status || "pending",
        publishing_status: draft.publishing_status || "not_ready",
        github_repository:
          draft.github_repository || "sombokipsmthn/Edit-Central",
        github_branch: draft.github_branch || "master",
        github_path: draft.github_path || `skills/${slug}/SKILL.md`,
        created_at: today,
        updated_at: today,
        versions: [
          {
            id: `ver-${Date.now()}`,
            version_number: 1,
            timestamp: today,
            note: versionNote,
            title: draft.title,
            description: draft.description,
            content_markdown: draft.content_markdown,
          },
        ],
      };

      setWorkspace((prev) => ({
        ...prev,
        skills: [optimistic, ...prev.skills],
      }));

      setIsSyncing(true);
      void fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          draft: { ...draft, id: tempId, slug },
          versionNote,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { skill?: SkillItem } | null) => {
          if (data?.skill) {
            setWorkspace((prev) => ({
              ...prev,
              skills: prev.skills.map((s) =>
                s.id === tempId ? data.skill! : s
              ),
            }));
          }
        })
        .finally(() => setIsSyncing(false));

      return optimistic;
    },
    []
  );

  const updateSkill = React.useCallback(
    (
      skillId: string,
      updates: Partial<Omit<SkillItem, "id" | "created_at" | "versions">>,
      options?: { recordVersion?: boolean; versionNote?: string }
    ) => {
      const today = new Date().toISOString().slice(0, 10);
      setWorkspace((prev) => ({
        ...prev,
        skills: prev.skills.map((skill) => {
          if (skill.id !== skillId) return skill;
          const merged: SkillItem = {
            ...skill,
            ...updates,
            updated_at: today,
          };
          const contentChanged =
            merged.content_markdown !== skill.content_markdown ||
            merged.title !== skill.title ||
            merged.description !== skill.description;

          if ((options?.recordVersion ?? contentChanged) && contentChanged) {
            const nextNumber =
              (skill.versions[0]?.version_number ?? skill.versions.length) + 1;
            merged.versions = [
              {
                id: `ver-${Date.now()}`,
                version_number: nextNumber,
                timestamp: today,
                note: options?.versionNote?.trim() || `Updated v${nextNumber}`,
                title: merged.title,
                description: merged.description,
                content_markdown: merged.content_markdown,
              },
              ...skill.versions,
            ];
          }
          return merged;
        }),
      }));

      setIsSyncing(true);
      void fetch(`/api/skills/${encodeURIComponent(skillId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          updates,
          options,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { skill?: SkillItem } | null) => {
          if (data?.skill) {
            setWorkspace((prev) => ({
              ...prev,
              skills: prev.skills.map((s) =>
                s.id === skillId ? data.skill! : s
              ),
            }));
          }
        })
        .finally(() => setIsSyncing(false));
    },
    []
  );

  const restoreSkillVersion = React.useCallback(
    (skillId: string, version: SkillVersion) => {
      const today = new Date().toISOString().slice(0, 10);
      setWorkspace((prev) => ({
        ...prev,
        skills: prev.skills.map((skill) => {
          if (skill.id !== skillId) return skill;
          const nextNumber =
            (skill.versions[0]?.version_number ?? skill.versions.length) + 1;
          return {
            ...skill,
            title: version.title,
            description: version.description,
            content_markdown: version.content_markdown,
            updated_at: today,
            versions: [
              {
                id: `ver-${Date.now()}`,
                version_number: nextNumber,
                timestamp: today,
                note: `Restored from v${version.version_number}`,
                title: version.title,
                description: version.description,
                content_markdown: version.content_markdown,
              },
              ...skill.versions,
            ],
          };
        }),
      }));

      void fetch(`/api/skills/${encodeURIComponent(skillId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore_version",
          version,
        }),
      }).then(() => void refreshWorkspace());
    },
    [refreshWorkspace]
  );

  const duplicateSkill = React.useCallback(
    (skill: SkillItem): SkillItem => {
      const today = new Date().toISOString().slice(0, 10);
      const tempId = `skill-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      const copyTitle = `${skill.title} (Copy)`;
      const copySlug = slugifyTitle(copyTitle);
      const copy: SkillItem = {
        ...skill,
        id: tempId,
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
            note: `Duplicated from "${skill.title}"`,
            title: copyTitle,
            description: skill.description,
            content_markdown: skill.content_markdown,
          },
        ],
      };

      setWorkspace((prev) => ({
        ...prev,
        skills: [copy, ...prev.skills],
      }));

      void fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "duplicate",
          sourceSkillId: skill.id,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { skill?: SkillItem } | null) => {
          if (data?.skill) {
            setWorkspace((prev) => ({
              ...prev,
              skills: prev.skills.map((s) =>
                s.id === tempId ? data.skill! : s
              ),
            }));
          }
        });

      return copy;
    },
    []
  );

  const deleteSkill = React.useCallback((skillId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== skillId),
    }));
    void fetch(`/api/skills/${encodeURIComponent(skillId)}`, {
      method: "DELETE",
    });
  }, []);

  const createResource = React.useCallback(
    (
      draft: Omit<ResourceItem, "id" | "created_at" | "updated_at">,
      attachToSkillId?: string
    ): ResourceItem => {
      const today = new Date().toISOString().slice(0, 10);
      const tempId = `res-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      const optimistic: ResourceItem = {
        ...draft,
        id: tempId,
        created_at: today,
        updated_at: today,
      };

      setWorkspace((prev) => ({
        ...prev,
        resources: [optimistic, ...prev.resources],
        skills: attachToSkillId
          ? prev.skills.map((s) =>
              s.id === attachToSkillId && !s.resource_ids.includes(tempId)
                ? {
                    ...s,
                    resource_ids: [...s.resource_ids, tempId],
                    updated_at: today,
                  }
                : s
            )
          : prev.skills,
      }));

      void fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: { ...draft, id: tempId },
          attachToSkillId,
        }),
      }).then(() => void refreshWorkspace());

      return optimistic;
    },
    [refreshWorkspace]
  );

  const updateResource = React.useCallback(
    (
      resourceId: string,
      updates: Partial<Omit<ResourceItem, "id" | "created_at">>
    ) => {
      const today = new Date().toISOString().slice(0, 10);
      setWorkspace((prev) => ({
        ...prev,
        resources: prev.resources.map((r) =>
          r.id === resourceId ? { ...r, ...updates, updated_at: today } : r
        ),
      }));

      void fetch(`/api/resources/${encodeURIComponent(resourceId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
    },
    []
  );

  const deleteResource = React.useCallback((resourceId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== resourceId),
      skills: prev.skills.map((s) => ({
        ...s,
        resource_ids: s.resource_ids.filter((id) => id !== resourceId),
      })),
    }));

    void fetch(`/api/resources/${encodeURIComponent(resourceId)}`, {
      method: "DELETE",
    });
  }, []);

  const toggleSkillResource = React.useCallback(
    (skillId: string, resourceId: string) => {
      const today = new Date().toISOString().slice(0, 10);
      setWorkspace((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => {
          if (s.id !== skillId) return s;
          const exists = s.resource_ids.includes(resourceId);
          return {
            ...s,
            updated_at: today,
            resource_ids: exists
              ? s.resource_ids.filter((id) => id !== resourceId)
              : [...s.resource_ids, resourceId],
          };
        }),
      }));

      void fetch(`/api/skills/${encodeURIComponent(skillId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_resource",
          resourceId,
        }),
      });
    },
    []
  );

  const createCollection = React.useCallback(
    async (draft: { name: string; description?: string }) => {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { collection?: CustomCollection };
      if (data.collection) {
        setWorkspace((prev) => ({
          ...prev,
          collections: [...prev.collections, data.collection!].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }));
        return data.collection;
      }
      return null;
    },
    []
  );

  const deleteCollection = React.useCallback(async (collectionId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c.id !== collectionId),
      skills: prev.skills.map((s) => ({
        ...s,
        collections: s.collections.filter((id) => id !== collectionId),
      })),
    }));
    await fetch(`/api/collections?id=${encodeURIComponent(collectionId)}`, {
      method: "DELETE",
    });
  }, []);

  return {
    skills: workspace.skills,
    resources: workspace.resources,
    collections: workspace.collections,
    isSyncing,
    refreshWorkspace,
    createSkill,
    updateSkill,
    restoreSkillVersion,
    duplicateSkill,
    deleteSkill,
    createResource,
    updateResource,
    deleteResource,
    toggleSkillResource,
    createCollection,
    deleteCollection,
  };
}
