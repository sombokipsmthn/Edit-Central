"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconAdjustments,
  IconCut,
  IconLayoutGrid,
  IconSparkles,
  IconTextSize,
  IconTransitionRight,
  IconVolume,
} from "@tabler/icons-react";
import {
  inferSkillVisualType,
  SKILL_VISUAL_TYPE_LABELS,
  type SkillItem,
  type SkillVisualType,
} from "@/lib/skills-data";

type PreviewableSkill = Pick<
  SkillItem,
  | "title"
  | "category"
  | "discipline"
  | "visual_type"
  | "tags"
  | "content_markdown"
  | "thumbnail_url"
>;

function extractHighlights(skill: PreviewableSkill): {
  framesLabel: string;
  keyParam: string;
  actionWord: string;
} {
  const source = `${skill.title} ${skill.content_markdown}`;
  const frameMatch = source.match(/\b(\d+\s*(?:f|frames?|ms|s))\b/i);
  const lufsOrDbMatch = source.match(/(-?\d+(?:\.\d+)?\s*(?:LUFS|dBFS|dB|%))/i);
  const scaleMatch = source.match(/(\d\.\d{2}\s*→\s*\d\.\d{2})/);

  const words = skill.title
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  return {
    framesLabel: frameMatch ? frameMatch[1] : "6f · 24fps",
    keyParam: lufsOrDbMatch
      ? lufsOrDbMatch[1]
      : scaleMatch
      ? scaleMatch[1]
      : "Ease Out",
    actionWord: (words[words.length - 1] || words[0] || "MOTION").toUpperCase(),
  };
}

function renderVisualTypeIcon(visualType: SkillVisualType) {
  const cls = "size-3.5 text-primary shrink-0";
  switch (visualType) {
    case "text-transition":
      return <IconTransitionRight className={cls} />;
    case "text-animation":
      return <IconTextSize className={cls} />;
    case "audio-skill":
      return <IconVolume className={cls} />;
    case "graphic-animation":
      return <IconLayoutGrid className={cls} />;
    case "graphic-style":
      return <IconAdjustments className={cls} />;
    case "pacing":
      return <IconCut className={cls} />;
    default:
      return <IconSparkles className={cls} />;
  }
}

export function SkillVisualPreview({
  skill,
  variant = "card",
  replayKey = 0,
}: {
  skill: PreviewableSkill;
  variant?: "card" | "stage";
  replayKey?: number;
}) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [showThumbnail, setShowThumbnail] = React.useState(false);
  const [animatedIn, setAnimatedIn] = React.useState(true);

  const visualType = React.useMemo(() => inferSkillVisualType(skill), [skill]);
  const highlights = React.useMemo(() => extractHighlights(skill), [skill]);

  React.useEffect(() => {
    if (replayKey === 0) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      setAnimatedIn(false);
      raf2 = window.requestAnimationFrame(() => {
        setAnimatedIn(true);
      });
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [replayKey]);

  const isStage = variant === "stage";
  const heightClass = isStage ? "h-48 sm:h-52" : "h-28";

  if (showThumbnail && skill.thumbnail_url && !imgFailed && isStage) {
    return (
      <div className="space-y-2">
        <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src={skill.thumbnail_url}
            alt={skill.title}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Reference Frame · {SKILL_VISUAL_TYPE_LABELS[visualType]}</span>
          <button
            type="button"
            onClick={() => setShowThumbnail(false)}
            className="font-medium text-foreground hover:underline cursor-pointer"
          >
            Show Skill Diagram
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-muted/35 ${heightClass} flex flex-col justify-between p-3 select-none`}
      >
        {/* Top Track Metadata Strip */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground truncate">
            {renderVisualTypeIcon(visualType)}
            <span className="truncate">{SKILL_VISUAL_TYPE_LABELS[visualType]}</span>
          </span>
          <span className="font-mono tabular-nums shrink-0">
            {highlights.framesLabel} · {highlights.keyParam}
          </span>
        </div>

        {/* Center Domain-Specific Visual Representation */}
        <div className="flex-1 flex items-center justify-center py-1.5">
          {visualType === "text-transition" && (
            <div className="relative w-full h-full max-h-24 rounded-xl border border-border bg-background/85 overflow-hidden flex items-center">
              <div className="w-1/2 h-full flex items-center justify-center border-r border-dashed border-primary/60 bg-muted/30 px-2">
                <span className="font-heading text-xs sm:text-sm font-semibold tracking-tight text-muted-foreground line-through decoration-primary/60">
                  SCENE A
                </span>
              </div>
              <div
                className={`w-1/2 h-full flex items-center justify-center px-2 transition-transform duration-500 motion-reduce:transition-none ${
                  animatedIn ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-40"
                }`}
              >
                <span className="font-heading text-xs sm:text-sm font-bold tracking-tight text-foreground">
                  {highlights.actionWord}
                </span>
              </div>
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-card border border-border px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums text-foreground">
                WIPE 0f → 6f
              </div>
            </div>
          )}

          {visualType === "text-animation" && (
            <div className="w-full h-full max-h-24 rounded-xl border border-border bg-zinc-950 text-zinc-100 px-3 flex flex-col items-center justify-center gap-1.5">
              <div
                className={`flex items-baseline gap-1.5 font-heading font-bold tracking-tight transition-transform duration-300 motion-reduce:transition-none ${
                  isStage ? "text-lg sm:text-xl" : "text-sm"
                } ${animatedIn ? "scale-100 opacity-100" : "scale-90 opacity-60"}`}
              >
                <span className="text-zinc-400">KEEP</span>
                <span className="text-amber-300 underline decoration-amber-400/70 underline-offset-4">
                  {highlights.actionWord}
                </span>
                <span className="text-zinc-400">LOCKED</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] tabular-nums text-zinc-400">
                <span>0.88</span>
                <span>→</span>
                <span className="text-amber-300">1.08</span>
                <span>→</span>
                <span>1.00</span>
              </div>
            </div>
          )}

          {visualType === "audio-skill" && (
            <div className="w-full h-full max-h-24 rounded-xl border border-border bg-background/85 px-2.5 py-2 flex flex-col justify-center gap-1.5">
              {/* V1 Track */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="w-6 text-muted-foreground shrink-0">V1</span>
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-2.5 w-1/2 rounded-sm bg-muted border border-border" />
                  <div className="h-3.5 w-px bg-primary shrink-0" />
                  <div className="h-2.5 w-1/2 rounded-sm bg-primary/20 border border-primary/40" />
                </div>
              </div>
              {/* A1 J-Cut Lead */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="w-6 text-muted-foreground shrink-0">A1</span>
                <div className="flex-1 flex items-center">
                  <div className="h-2.5 w-[38%] rounded-sm bg-muted/60 border border-border" />
                  <div className="h-3 flex-1 ml-0.5 rounded-sm bg-primary/30 border border-primary/60 flex items-center justify-around px-1">
                    <span className="h-1.5 w-0.5 bg-primary" />
                    <span className="h-2 w-0.5 bg-primary" />
                    <span className="h-1 w-0.5 bg-primary" />
                    <span className="h-2 w-0.5 bg-primary" />
                    <span className="h-1.5 w-0.5 bg-primary" />
                    <span className="h-2 w-0.5 bg-primary" />
                  </div>
                </div>
              </div>
              {/* A2 Music Duck */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="w-6 text-muted-foreground shrink-0">A2</span>
                <div className="flex-1 h-2.5 rounded-sm bg-muted/40 border border-border flex items-center px-1.5 justify-between text-[9px] text-muted-foreground tabular-nums">
                  <span>MUSIC BED</span>
                  <span>DUCK -22 LUFS</span>
                </div>
              </div>
            </div>
          )}

          {visualType === "graphic-animation" && (
            <div className="relative w-full h-full max-h-24 rounded-xl border border-border bg-background/85 px-3 py-2 flex items-center justify-between gap-3">
              <div className="relative flex items-center gap-2">
                <div
                  className={`size-7 rounded-lg border border-primary bg-primary/15 flex items-center justify-center transition-transform duration-500 motion-reduce:transition-none ${
                    animatedIn ? "translate-x-0" : "-translate-x-2"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                </div>
                <div className="h-px w-8 sm:w-14 border-t border-dashed border-primary/70" />
                <div className="rounded-md border border-border bg-card px-2 py-1 text-[10px] font-mono text-foreground">
                  HUD CALLOUT
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-muted-foreground tabular-nums shrink-0">
                <div>X/Y TRACK</div>
                <div className="text-foreground">BEZIER 0.2, 0.8</div>
              </div>
            </div>
          )}

          {visualType === "graphic-style" && (
            <div className="w-full h-full max-h-24 rounded-xl border border-border bg-background/85 p-2 flex flex-col justify-between gap-1.5">
              <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-8">
                <div className="rounded-md bg-slate-900 border border-border flex items-end p-1">
                  <span className="font-mono text-[9px] text-slate-300">SHADOW</span>
                </div>
                <div className="rounded-md bg-slate-600 border border-border flex items-end p-1">
                  <span className="font-mono text-[9px] text-slate-100">SLATE</span>
                </div>
                <div className="rounded-md bg-stone-300 border border-border flex items-end p-1">
                  <span className="font-mono text-[9px] text-stone-900">SKIN</span>
                </div>
                <div className="rounded-md bg-amber-300/80 border border-border flex items-end p-1">
                  <span className="font-mono text-[9px] text-amber-950">HALATION</span>
                </div>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground tabular-nums">
                <span>COLOR / LOOK PIPELINE</span>
                <span>CST → GRADE → BLOOM</span>
              </div>
            </div>
          )}

          {(visualType === "pacing" || visualType === "general") && (
            <div className="w-full h-full max-h-24 rounded-xl border border-border bg-background/85 px-3 py-2 flex flex-col justify-center gap-2">
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-5 rounded border border-border bg-muted/50 flex items-center justify-center font-mono text-[10px] tabular-nums text-foreground">
                  BEAT 01 · 4f
                </div>
                <div className="h-5 rounded border border-primary/50 bg-primary/15 flex items-center justify-center font-mono text-[10px] tabular-nums text-foreground">
                  BEAT 02 · 4f
                </div>
                <div className="h-5 rounded border border-border bg-muted/50 flex items-center justify-center font-mono text-[10px] tabular-nums text-foreground">
                  BEAT 03 · 4f
                </div>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>PORTABLE SPECIFICATION</span>
                <span>RESOLVE READY</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Caption Strip */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">
            {(skill.tags || []).slice(0, 3).map((t) => `#${t}`).join(" ") ||
              "#editing-skill"}
          </span>
          {isStage && skill.thumbnail_url && !imgFailed ? (
            <button
              type="button"
              onClick={() => setShowThumbnail(true)}
              className="text-[11px] font-medium text-foreground hover:underline cursor-pointer shrink-0"
            >
              View Reference Frame
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
