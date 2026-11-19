export type SkillCategory =
  | "text"
  | "transitions"
  | "graphics"
  | "pacing"
  | "styles"
  | "general";

export type SkillDiscipline =
  | "typography-motion"
  | "editorial-pacing"
  | "transitions-vfx"
  | "color-finishing"
  | "audio-dialogue"
  | "workflow-research"
  | "general";

export type SkillVisualType =
  | "text-transition"
  | "text-animation"
  | "audio-skill"
  | "graphic-animation"
  | "graphic-style"
  | "pacing"
  | "general";

export type SkillStatus = "ready" | "draft" | "archived";

export type SkillApprovalStatus = "pending" | "approved" | "rejected";

export type SkillPublishingStatus =
  | "not_ready"
  | "awaiting_publish"
  | "publishing"
  | "published"
  | "failed";

export type AIProviderId = "any" | "chatgpt" | "claude" | "gemini" | "codex";

export interface SkillVersion {
  id: string;
  version_number: number;
  timestamp: string;
  note: string;
  title: string;
  description: string;
  content_markdown: string;
}

export interface SkillCompatibility {
  providers: AIProviderId[];
  apps: string[];
  requirements: string;
  notes: string;
}

export interface SkillItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: SkillCategory;
  discipline: SkillDiscipline;
  visual_type?: SkillVisualType;
  tags: string[];
  collections: string[];
  status: SkillStatus;
  approval_status: SkillApprovalStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  publishing_status: SkillPublishingStatus;
  github_repository?: string;
  github_branch?: string;
  github_path?: string;
  github_commit_sha?: string | null;
  github_blob_sha?: string | null;
  github_url?: string | null;
  published_at?: string | null;
  purpose?: string;
  when_to_use?: string[];
  required_inputs?: string[];
  expected_outputs?: string[];
  quality_standards?: string[];
  constraints_and_limitations?: string[];
  source_and_attribution?: string;
  source_submission_id?: string | null;
  content_markdown: string;
  preferred_provider: AIProviderId;
  provider_note: string;
  compatibility: SkillCompatibility;
  resource_ids: string[];
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  versions: SkillVersion[];
}

export type ResourceType = "link" | "note" | "checklist" | "file";

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  creator?: string;
  resource_type_label?: string;
  subject?: string;
  summary?: string;
  extracted_knowledge?: string[];
  content: string;
  file_name?: string;
  tags: string[];
  source_submission_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomCollection {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  text: "Text",
  transitions: "Transitions",
  graphics: "Graphics",
  pacing: "Pacing",
  styles: "Styles",
  general: "General",
};

export const SKILL_DISCIPLINE_LABELS: Record<SkillDiscipline, string> = {
  "typography-motion": "Typography & Motion",
  "editorial-pacing": "Editorial Pacing",
  "transitions-vfx": "Transitions & VFX",
  "color-finishing": "Color & Finishing",
  "audio-dialogue": "Audio & Dialogue",
  "workflow-research": "Research & Workflow",
  general: "General Craft",
};

export const SKILL_VISUAL_TYPE_LABELS: Record<SkillVisualType, string> = {
  "text-transition": "Text Transitions",
  "text-animation": "Text Animations",
  "audio-skill": "Audio Skills",
  "graphic-animation": "Graphic Animations",
  "graphic-style": "Graphic Styles",
  pacing: "Editorial Pacing",
  general: "General Skill",
};

export const SKILL_STATUS_LABELS: Record<SkillStatus, string> = {
  ready: "Ready",
  draft: "Draft",
  archived: "Archived",
};

export const SKILL_APPROVAL_LABELS: Record<SkillApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const SKILL_PUBLISHING_LABELS: Record<SkillPublishingStatus, string> = {
  not_ready: "Not Ready",
  awaiting_publish: "Awaiting Publish",
  publishing: "Publishing",
  published: "Published",
  failed: "Failed",
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  link: "Link",
  note: "Note",
  checklist: "Checklist",
  file: "File",
};

export const AI_PROVIDERS: {
  id: AIProviderId;
  label: string;
  destinationUrl?: string;
}[] = [
  { id: "any", label: "Any Assistant" },
  { id: "chatgpt", label: "ChatGPT", destinationUrl: "https://chatgpt.com/" },
  { id: "claude", label: "Claude", destinationUrl: "https://claude.ai/" },
  { id: "gemini", label: "Gemini", destinationUrl: "https://gemini.google.com/" },
  { id: "codex", label: "Codex", destinationUrl: "https://chatgpt.com/codex" },
];

export const VISUAL_PRESETS: { label: string; url: string }[] = [
  { label: "None (Text-only)", url: "" },
  { label: "Kinetic Typography", url: "/images/effect_kinetic_text_1794988909749.jpg" },
  { label: "Timeline & Pacing", url: "/images/effect_pre_hook_1794988910097.jpg" },
  { label: "Whip-Pan Motion", url: "/images/effect_whip_pan_1794988911386.jpg" },
  { label: "Vector HUD Overlay", url: "/images/effect_graphics_overlay_1794991149283.jpg" },
  { label: "16mm Film Corridor", url: "/images/effect_halation_grade_1794988910723.jpg" },
  { label: "Studio Mic Captions", url: "/images/effect_split_caption_1794988912894.jpg" },
];

export const INITIAL_COLLECTIONS: CustomCollection[] = [
  {
    id: "col-shortform-retention",
    name: "Short-Form Retention",
    description: "Hooks, kinetic captions, and rapid visual bridges for 9:16 social edits.",
    created_at: "2026-11-10",
    updated_at: "2026-11-18",
  },
  {
    id: "col-documentary-finishing",
    name: "Documentary & Finishing",
    description: "Color grading pipelines, HUD callouts, and structured research briefs.",
    created_at: "2026-11-04",
    updated_at: "2026-11-15",
  },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res-resolve-textplus-notes",
    title: "DaVinci Resolve Text+ Shading & Keyframe Reference",
    type: "note",
    creator: "Edit Central Notes",
    resource_type_label: "technical note",
    subject: "DaVinci Resolve Fusion Text+",
    summary:
      "Reference mapping for Text+ shading layers, Character Level Styling, and downstream Transform bezier easing.",
    extracted_knowledge: [
      "Shading Element 1 = Primary Fill, Element 2 = Outline, Element 3 = Drop Shadow.",
      "Use Character Level Styling for per-word color accents.",
      "Animate scale on a downstream Transform node with flattened Spline curves.",
    ],
    content:
      "In DaVinci Resolve Fusion Text+:\n- Shading Element 1 = Primary Fill\n- Shading Element 2 = Outline\n- Shading Element 3 = Drop Shadow\n- Use Character Level Styling (right-click text box -> Character Level Styling) for per-word color highlights.\n- Use a downstream Transform node when animating scale ratios (0.88 -> 1.08 -> 1.00) and press F in the Spline panel to flatten ease curves.",
    tags: ["davinci-resolve", "fusion", "text+"],
    created_at: "2026-11-10",
    updated_at: "2026-11-18",
  },
  {
    id: "res-shortform-qa-checklist",
    title: "9:16 Vertical Delivery QA Checklist",
    type: "checklist",
    creator: "Edit Central Standards",
    resource_type_label: "checklist",
    subject: "Vertical short-form QA",
    summary:
      "Delivery checklist covering safe margins, contrast ratios, audio transient sync, and -14 LUFS loudness.",
    extracted_knowledge: [
      "Keep primary text inside the center 70% vertical band.",
      "Maintain >= 4.5:1 contrast ratio over variable footage luminance.",
      "Target -14 LUFS integrated loudness for social feeds.",
    ],
    content:
      "- [ ] Safe margins verified: keep primary text inside center 70% vertical band.\n- [ ] Contrast ratio >= 4.5:1 over variable footage luminance.\n- [ ] Audio J-cut / transient alignment checked at 24fps or 30fps.\n- [ ] Loudness normalized around -14 LUFS integrated for social feeds.\n- [ ] First 0.5s frame delivers visual or vocal hook.",
    tags: ["qa", "vertical", "delivery"],
    created_at: "2026-11-08",
    updated_at: "2026-11-15",
  },
  {
    id: "res-fusion-clipboard-example",
    title: "Fusion Text+ Pop-Bounce Node Snippet (.setting)",
    type: "file",
    creator: "Edit Central Snippets",
    resource_type_label: "fusion macro",
    subject: "DaVinci Resolve Fusion macro",
    summary:
      "Copy-pasteable Fusion Text+ and Transform BezierSpline node snippet for kinetic pop-bounce headlines.",
    extracted_knowledge: [
      "Sets 0.88 -> 1.08 -> 1.00 Transform BezierSpline keyframes across frames 0, 4, and 7.",
    ],
    file_name: "kinetic_pop_bounce.setting",
    content: `{
	Tools = ordered() {
		KineticText = TextPlus {
			Inputs = {
				UseFrameFormatSettings = Input { Value = 1, },
				StyledText = Input { Value = "KINETIC POP", },
				Font = Input { Value = "Arial", },
				Style = Input { Value = "Bold", },
				Size = Input { Value = 0.085, },
				Red1 = Input { Value = 0.961, },
				Green1 = Input { Value = 0.961, },
				Blue1 = Input { Value = 0.961, },
				Enabled3 = Input { Value = 1, },
				Alpha3 = Input { Value = 0.45, },
				SoftnessX3 = Input { Value = 4, },
				SoftnessY3 = Input { Value = 4, },
				Offset3 = Input { Value = { 0.003, -0.005 }, }
			}
		},
		PopBounce = Transform {
			Inputs = {
				Input = Input { SourceOp = "KineticText", Source = "Output" },
				Size = Input { SourceOp = "PopBounceSize", Source = "Value" }
			}
		},
		PopBounceSize = BezierSpline {
			KeyFrames = {
				[0] = { 0.88, RH = { 1.3, 1.04 }, Flags = { Linear = false } },
				[4] = { 1.08, LH = { 2.7, 1.08 }, RH = { 5.0, 1.04 }, Flags = { Linear = false } },
				[7] = { 1.00, LH = { 6.0, 1.00 }, Flags = { Linear = false } }
			}
		}
	}
}`,
    tags: ["fusion", "macro", "davinci-resolve"],
    created_at: "2026-11-18",
    updated_at: "2026-11-18",
  },
  {
    id: "res-halation-reference-link",
    title: "16mm Film Stock & Halation Contrast Reference",
    type: "link",
    url: "https://youtube.com/shorts/halation-film-grade",
    creator: "Color Craft Reference",
    resource_type_label: "video",
    subject: "16mm halation & slate shadow grading",
    summary:
      "Reference breakdown of secondary-only halation thresholds (0.70-0.75) paired with cool slate shadow lift and 250D grain density.",
    extracted_knowledge: [
      "Secondary-only halation keeps midtones clean while blooming practical highlights.",
      "Threshold 0.72 and Spread 18% avoid spilling red bloom onto skin tones.",
    ],
    content:
      "Reference breakdown of secondary-only halation thresholds (0.70-0.75) paired with cool slate shadow lift and 250D grain density.",
    tags: ["color", "film", "halation"],
    created_at: "2026-11-04",
    updated_at: "2026-11-04",
  },
  {
    id: "res-whip-pan-reference-link",
    title: "Directional Optical Motion Blur Reference Clip",
    type: "link",
    url: "https://youtube.com/shorts/whip-pan-transition",
    creator: "Motion Reference Archive",
    resource_type_label: "video",
    subject: "Directional whip-pan transitions",
    summary:
      "8-frame bridge transition combining directional blur peaks with edge-mirrored motion tile to prevent black frame gaps.",
    extracted_knowledge: [
      "Mirror frame edges before directional blur to prevent dark boundary artifacts.",
      "Peak blur at frame 4 (cut boundary) and resolve to 0px by frame 8.",
    ],
    content:
      "8-frame bridge transition combining directional blur peaks with edge-mirrored motion tile to prevent black frame gaps.",
    tags: ["transition", "motion-blur"],
    created_at: "2026-11-08",
    updated_at: "2026-11-08",
  },
];

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: "skill-kinetic-pop-bounce",
    slug: "kinetic-pop-bounce-title",
    title: "Kinetic Pop-Bounce Title",
    description:
      "High-retention kinetic headline with 4-frame scale overshoot, emphasized action verbs, and soft contrast drop shadow.",
    category: "text",
    discipline: "typography-motion",
    visual_type: "text-animation",
    tags: ["retention", "kinetic-type", "captions"],
    collections: ["col-shortform-retention"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-18T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/kinetic-pop-bounce-title/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Create a punchy, readable kinetic title reveal that draws eye focus on key spoken verbs without cluttering a 9:16 frame.",
    when_to_use: [
      "Opening 0-3 second hook phrases in vertical edits",
      "Emphasizing 2-4 word spoken callouts over B-roll",
    ],
    required_inputs: [
      "Target canvas dimensions (e.g., 1080x1920)",
      "Timeline frame rate (24fps or 30fps)",
      "Spoken phrase broken into 2-4 word beats",
    ],
    expected_outputs: [
      "Clean title preset, Fusion Text+ macro, or keyframed text layer ready to duplicate",
    ],
    quality_standards: [
      "Minimum 4.5:1 text contrast over moving footage",
      "Smooth ease-out overshoot with zero bounce on body paragraphs",
    ],
    constraints_and_limitations: [
      "Keep text inside center 70% vertical safe zone to avoid platform UI clipping.",
      "Do not apply pop timing to multi-line explanatory paragraphs.",
    ],
    source_and_attribution:
      "Edit Central Base Library — DaVinci Resolve Text+ & Vertical QA Reference",
    preferred_provider: "claude",
    provider_note:
      "Works reliably when handing off to an assistant with DaVinci Resolve Fusion or After Effects scripting access.",
    compatibility: {
      providers: ["claude", "chatgpt", "gemini", "codex"],
      apps: ["DaVinci Resolve", "After Effects", "Premiere Pro"],
      requirements: "Keyframeable transform scale and per-word styling",
      notes:
        "In DaVinci Resolve, use Shading Element 3 for drop shadow and Character Level Styling for verb accents; avoid CSS cubic-bezier syntax in Fusion.",
    },
    resource_ids: [
      "res-resolve-textplus-notes",
      "res-fusion-clipboard-example",
      "res-shortform-qa-checklist",
    ],
    thumbnail_url: "/images/effect_kinetic_text_1794988909749.jpg",
    created_at: "2026-11-12",
    updated_at: "2026-11-18",
    content_markdown: `## Purpose
Create a punchy, readable kinetic title reveal that draws eye focus on key spoken verbs without cluttering a 9:16 frame.

## Inputs & Context
- Target canvas: 1080x1920 (or project native vertical aspect ratio)
- Frame rate: 24fps or 30fps
- Spoken phrase: 2 to 4 words per beat

## Instructions
1. Set primary typography in a bold geometric sans-serif at roughly 8% of frame height.
2. Style base fill in crisp off-white (\`#F5F5F5\`) and add a subtle soft drop shadow (45% opacity) for legibility across bright footage.
3. Accentuate the primary action verb in cyan (\`#38BDF8\`).
4. Animate scale with a fast overshoot curve:
   - Frame 0: \`0.88\` scale
   - Frame 4: \`1.08\` scale (ease out)
   - Frame 7: \`1.00\` scale (settled)

## Constraints
- Keep text inside the center safe zone so platform UI overlays do not clip characters.
- Do not add bounce to multi-line body paragraphs; reserve pop timing for hook phrases.

## Expected Output
A clean title preset, node macro, or keyframed text layer ready to duplicate across emphasis beats.`,
    versions: [
      {
        id: "ver-kinetic-v2",
        version_number: 2,
        timestamp: "2026-11-18",
        note: "Refined Resolve Shading Element 3 & Transform scale guidance",
        title: "Kinetic Pop-Bounce Title",
        description:
          "High-retention kinetic headline with 4-frame scale overshoot, emphasized action verbs, and soft contrast drop shadow.",
        content_markdown: `## Purpose
Create a punchy, readable kinetic title reveal that draws eye focus on key spoken verbs without cluttering a 9:16 frame.

## Inputs & Context
- Target canvas: 1080x1920 (or project native vertical aspect ratio)
- Frame rate: 24fps or 30fps
- Spoken phrase: 2 to 4 words per beat

## Instructions
1. Set primary typography in a bold geometric sans-serif at roughly 8% of frame height.
2. Style base fill in crisp off-white (\`#F5F5F5\`) and add a subtle soft drop shadow (45% opacity) for legibility across bright footage.
3. Accentuate the primary action verb in cyan (\`#38BDF8\`).
4. Animate scale with a fast overshoot curve:
   - Frame 0: \`0.88\` scale
   - Frame 4: \`1.08\` scale (ease out)
   - Frame 7: \`1.00\` scale (settled)

## Constraints
- Keep text inside the center safe zone so platform UI overlays do not clip characters.
- Do not add bounce to multi-line body paragraphs; reserve pop timing for hook phrases.

## Expected Output
A clean title preset, node macro, or keyframed text layer ready to duplicate across emphasis beats.`,
      },
      {
        id: "ver-kinetic-v1",
        version_number: 1,
        timestamp: "2026-11-12",
        note: "Initial kinetic pop-bounce draft",
        title: "The Kinetic Pop-Bounce",
        description: "Initial kinetic text overshoot specification.",
        content_markdown: `## Instructions
Generate a Text+ title node with base fill #F5F5F5, active verb highlight #38BDF8, and scale overshoot 0.88 -> 1.08 -> 1.00 over 7 frames.`,
      },
    ],
  },
  {
    id: "skill-pre-hook-pacing",
    slug: "pre-hook-cut-sequence",
    title: "0.5s Pre-Hook Cut Sequence",
    description:
      "Three rapid 4-frame visual pattern interrupts paired with an early audio J-cut before the primary spoken hook.",
    category: "pacing",
    discipline: "editorial-pacing",
    visual_type: "pacing",
    tags: ["hook", "retention", "rhythm"],
    collections: ["col-shortform-retention"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-14T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/pre-hook-cut-sequence/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Establish immediate visual momentum in the first half-second of a short-form edit before the main narration begins.",
    when_to_use: [
      "Opening 12 frames of talking-head or documentary shorts",
      "Re-engaging viewers before a story payoff",
    ],
    required_inputs: [
      "Three high-contrast B-roll payoff frames",
      "A-roll vocal intro track and riser SFX",
    ],
    expected_outputs: [
      "12-frame pre-hook timeline sequence with 3-frame J-cut audio lead",
    ],
    quality_standards: [
      "Clear focal silhouette in every 4-frame micro-cut",
      "Riser peaks accurately on the entry cut of the main hook",
    ],
    constraints_and_limitations: [
      "Avoid cutting on empty transition frames or low-contrast motion blur.",
      "Adjust from 4-frame to 5-frame cuts on 30fps timelines.",
    ],
    source_and_attribution: "Edit Central Base Library — Vertical QA Standards",
    preferred_provider: "any",
    provider_note:
      "Provider-agnostic assembly guide; paste transcript timestamps alongside this skill.",
    compatibility: {
      providers: ["chatgpt", "claude", "gemini"],
      apps: ["App-Agnostic", "Premiere Pro", "DaVinci Resolve", "Final Cut Pro"],
      requirements: "Timeline trim + audio track offset",
      notes: "Best suited for 24fps timelines; adjust to 5-frame cuts at 30fps.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    thumbnail_url: "/images/effect_pre_hook_1794988910097.jpg",
    created_at: "2026-11-10",
    updated_at: "2026-11-14",
    content_markdown: `## Purpose
Establish immediate visual momentum in the first half-second of a short-form edit before the main narration begins.

## Instructions
1. Select three high-contrast B-roll moments representing the payoff of the story.
2. Trim each clip to 4 frames (total 12 frames / 0.50s at 24fps).
3. Apply a subtle +12% punch-in on the middle clip to vary framing geometry.
4. Offset the A-roll vocal track 3 frames earlier (J-cut) under a -4dB riser sound effect that peaks cleanly on frame 12.

## Constraints
- Ensure every micro-cut shows a clear silhouette or subject so it reads cleanly without motion sickness.
- Avoid cutting on empty transition frames.`,
    versions: [
      {
        id: "ver-prehook-v1",
        version_number: 1,
        timestamp: "2026-11-10",
        note: "Initial 12-frame pre-hook pacing recipe",
        title: "0.5s Pre-Hook Cut Sequence",
        description:
          "Three rapid 4-frame visual pattern interrupts paired with an early audio J-cut before the primary spoken hook.",
        content_markdown: `## Purpose
Establish immediate visual momentum in the first half-second of a short-form edit before the main narration begins.

## Instructions
1. Select three high-contrast B-roll moments representing the payoff of the story.
2. Trim each clip to 4 frames (total 12 frames / 0.50s at 24fps).
3. Apply a subtle +12% punch-in on the middle clip to vary framing geometry.
4. Offset the A-roll vocal track 3 frames earlier (J-cut) under a -4dB riser sound effect that peaks cleanly on frame 12.

## Constraints
- Ensure every micro-cut shows a clear silhouette or subject so it reads cleanly without motion sickness.
- Avoid cutting on empty transition frames.`,
      },
    ],
  },
  {
    id: "skill-optical-whip-pan",
    slug: "optical-whip-pan-bridge",
    title: "Optical Whip-Pan Bridge",
    description:
      "8-frame directional blur and lens distortion bridge that masks scene cuts without jarring jump frames.",
    category: "transitions",
    discipline: "transitions-vfx",
    visual_type: "graphic-animation",
    tags: ["motion", "seamless", "blur"],
    collections: ["col-shortform-retention"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-08T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/optical-whip-pan-bridge/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Connect two spatially unrelated shots with natural lateral camera inertia.",
    when_to_use: [
      "Bridging B-roll location changes with matched lateral movement",
    ],
    required_inputs: [
      "Cut boundary between outgoing and incoming clips",
      "Desired pan direction (left-to-right or right-to-left)",
    ],
    expected_outputs: [
      "Reusable 8-frame adjustment preset centered over the cut",
    ],
    quality_standards: [
      "Zero black border gaps during maximum lateral displacement",
    ],
    constraints_and_limitations: [
      "Enable mirror/repeat edge pixels prior to applying directional blur.",
    ],
    source_and_attribution: "Motion Reference Archive — Directional Optical Motion Blur",
    preferred_provider: "chatgpt",
    provider_note:
      "Include clip directional movement (left-to-right or right-to-left) when prompting.",
    compatibility: {
      providers: ["chatgpt", "claude", "gemini"],
      apps: ["After Effects", "DaVinci Resolve", "Premiere Pro"],
      requirements: "Adjustment layer, directional blur, edge mirroring",
      notes:
        "Enable mirror/repeat edge pixels before applying directional blur to avoid black frame edges.",
    },
    resource_ids: ["res-whip-pan-reference-link"],
    thumbnail_url: "/images/effect_whip_pan_1794988911386.jpg",
    created_at: "2026-11-08",
    updated_at: "2026-11-08",
    content_markdown: `## Purpose
Connect two spatially unrelated shots with natural lateral camera inertia.

## Instructions
1. Place an adjustment layer spanning 4 frames before and 4 frames after the cut point.
2. Enable edge mirroring (Motion Tile / Mirror Edges) so lateral displacement never reveals empty canvas.
3. Keyframe horizontal Directional Blur: \`0px\` -> \`145px\` (at cut point) -> \`0px\`.
4. Pair with subtle optical lens curvature (\`0\` -> \`35\` FOV peak at the cut) and a gentle horizontal slide offset matching camera pan direction.

## Expected Output
A reusable 8-frame adjustment preset positioned centered over the edit cut.`,
    versions: [
      {
        id: "ver-whip-v1",
        version_number: 1,
        timestamp: "2026-11-08",
        note: "Initial whip-pan specification",
        title: "Optical Whip-Pan Bridge",
        description:
          "8-frame directional blur and lens distortion bridge that masks scene cuts without jarring jump frames.",
        content_markdown: `## Purpose
Connect two spatially unrelated shots with natural lateral camera inertia.

## Instructions
1. Place an adjustment layer spanning 4 frames before and 4 frames after the cut point.
2. Enable edge mirroring (Motion Tile / Mirror Edges) so lateral displacement never reveals empty canvas.
3. Keyframe horizontal Directional Blur: \`0px\` -> \`145px\` (at cut point) -> \`0px\`.
4. Pair with subtle optical lens curvature (\`0\` -> \`35\` FOV peak at the cut) and a gentle horizontal slide offset matching camera pan direction.

## Expected Output
A reusable 8-frame adjustment preset positioned centered over the edit cut.`,
      },
    ],
  },
  {
    id: "skill-vector-callout-overlay",
    slug: "tracked-vector-callout-line",
    title: "Tracked Vector Callout Line",
    description:
      "Clean two-segment HUD leader line anchored to a moving subject with progressive path reveal.",
    category: "graphics",
    discipline: "transitions-vfx",
    visual_type: "graphic-animation",
    tags: ["hud", "callout", "tracking"],
    collections: ["col-documentary-finishing"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-15T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/tracked-vector-callout-line/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Point viewer attention toward a specific technical detail or product feature without obscuring the subject.",
    when_to_use: [
      "Highlighting hardware components, UI elements, or documentary evidence in motion",
    ],
    required_inputs: [
      "Moving footage clip with visible tracking anchor",
      "2-4 word callout label text",
    ],
    expected_outputs: [
      "Tracked polyline overlay with ease-out trim reveal and legible label",
    ],
    quality_standards: [
      "Stroke stays locked within 2px of anchor target without jitter",
    ],
    constraints_and_limitations: [
      "Keep labels concise (2-4 words max); avoid heavy box borders around callout text.",
    ],
    source_and_attribution: "Edit Central Base Library",
    preferred_provider: "claude",
    provider_note:
      "Specify whether the subject moves rapidly; rapid motion requires planar tracking before line draw.",
    compatibility: {
      providers: ["claude", "chatgpt", "codex"],
      apps: ["DaVinci Resolve", "After Effects"],
      requirements: "2D point/planar tracker + animated stroke path",
      notes: "Use Resolve Fusion PlanarTracker or AE Trim Paths.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    thumbnail_url: "/images/effect_graphics_overlay_1794991149283.jpg",
    created_at: "2026-11-15",
    updated_at: "2026-11-15",
    content_markdown: `## Purpose
Point viewer attention toward a specific technical detail or product feature without obscuring the subject.

## Instructions
1. Track the anchor point on the subject across the clip duration.
2. Create a two-segment vector polyline from the tracked anchor out to a clear negative-space area.
3. Style the stroke at 1.5px-2px in \`#38BDF8\` with crisp rounded caps.
4. Animate stroke trim length from \`0%\` to \`100%\` over frames 0-10 using an ease-out curve.
5. Fade in the label title over frames 6-12 once the leader elbow clears the subject.

## Constraints
- Keep labels concise (2-4 words max).
- Avoid busy box borders around the callout label.`,
    versions: [
      {
        id: "ver-callout-v1",
        version_number: 1,
        timestamp: "2026-11-15",
        note: "Initial HUD callout skill",
        title: "Tracked Vector Callout Line",
        description:
          "Clean two-segment HUD leader line anchored to a moving subject with progressive path reveal.",
        content_markdown: `## Purpose
Point viewer attention toward a specific technical detail or product feature without obscuring the subject.

## Instructions
1. Track the anchor point on the subject across the clip duration.
2. Create a two-segment vector polyline from the tracked anchor out to a clear negative-space area.
3. Style the stroke at 1.5px-2px in \`#38BDF8\` with crisp rounded caps.
4. Animate stroke trim length from \`0%\` to \`100%\` over frames 0-10 using an ease-out curve.
5. Fade in the label title over frames 6-12 once the leader elbow clears the subject.

## Constraints
- Keep labels concise (2-4 words max).
- Avoid busy box borders around the callout label.`,
      },
    ],
  },
  {
    id: "skill-halation-film-grade",
    slug: "16mm-halation-slate-grade",
    title: "16mm Halation & Slate Grade",
    description:
      "Restrained 4-stage color pipeline combining cool slate shadows, secondary-only halation bloom, and fine 250D grain.",
    category: "styles",
    discipline: "color-finishing",
    visual_type: "graphic-style",
    tags: ["color", "analog", "16mm"],
    collections: ["col-documentary-finishing"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-04T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/16mm-halation-slate-grade/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Deliver a tactile 16mm documentary aesthetic with controlled highlight glow and deep neutral-cool shadows.",
    when_to_use: [
      "Documentary interviews, architectural b-roll, and filmic short-form essays",
    ],
    required_inputs: [
      "Source camera color space (LogC, S-Log3, DaVinci Wide Gamut, or Rec.709)",
    ],
    expected_outputs: [
      "4-stage color node tree order and parameter targets",
    ],
    quality_standards: [
      "Natural skin-tone vectorscope alignment without red halation spill",
    ],
    constraints_and_limitations: [
      "Halation OFX requires DaVinci Resolve Studio or equivalent third-party plugin.",
    ],
    source_and_attribution: "Color Craft Reference — 16mm Film Stock & Halation Contrast",
    preferred_provider: "gemini",
    provider_note:
      "Provide source camera color space (LogC, S-Log3, DaVinci Wide Gamut, or Rec.709) before applying.",
    compatibility: {
      providers: ["gemini", "chatgpt", "claude"],
      apps: ["DaVinci Resolve", "App-Agnostic"],
      requirements: "Color wheels, Halation OFX (or red-channel glow), Film Grain",
      notes:
        "Halation plugin requires Resolve Studio or third-party film emulation in other NLEs.",
    },
    resource_ids: ["res-halation-reference-link"],
    thumbnail_url: "/images/effect_halation_grade_1794988910723.jpg",
    created_at: "2026-11-04",
    updated_at: "2026-11-04",
    content_markdown: `## Purpose
Deliver a tactile 16mm documentary aesthetic with controlled highlight glow and deep neutral-cool shadows.

## Instructions
1. **Exposure & Balance**: Normalize white balance, then nudge shadow lift subtly toward cool slate without crushing blacks.
2. **Halation**: Apply Halation in Secondary Only mode with Threshold \`0.72\` and Spread \`18%\` so only practical light edges bloom.
3. **Grain**: Overlay 16mm 250D texture at \`0.24\` opacity in Overlay/Soft Light blend mode.
4. **Highlight Roll-Off**: Add a gentle top-end curve shoulder to prevent digital clipping on tungsten fixtures.

## Constraints
- Preserve natural skin-tone saturation around the center vectorscope line.`,
    versions: [
      {
        id: "ver-halation-v1",
        version_number: 1,
        timestamp: "2026-11-04",
        note: "Initial 4-node color pipeline",
        title: "16mm Halation & Slate Grade",
        description:
          "Restrained 4-stage color pipeline combining cool slate shadows, secondary-only halation bloom, and fine 250D grain.",
        content_markdown: `## Purpose
Deliver a tactile 16mm documentary aesthetic with controlled highlight glow and deep neutral-cool shadows.

## Instructions
1. **Exposure & Balance**: Normalize white balance, then nudge shadow lift subtly toward cool slate without crushing blacks.
2. **Halation**: Apply Halation in Secondary Only mode with Threshold \`0.72\` and Spread \`18%\` so only practical light edges bloom.
3. **Grain**: Overlay 16mm 250D texture at \`0.24\` opacity in Overlay/Soft Light blend mode.
4. **Highlight Roll-Off**: Add a gentle top-end curve shoulder to prevent digital clipping on tungsten fixtures.

## Constraints
- Preserve natural skin-tone saturation around the center vectorscope line.`,
      },
    ],
  },
  {
    id: "skill-dual-split-caption",
    slug: "dual-layer-split-caption",
    title: "Dual-Layer Split Caption",
    description:
      "Documentary lower-third caption format contrasting active spoken words at 100% opacity over muted upcoming context.",
    category: "text",
    discipline: "typography-motion",
    visual_type: "text-transition",
    tags: ["captions", "documentary", "accessibility"],
    collections: ["col-documentary-finishing"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-02T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/dual-layer-split-caption/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Keep spoken captions scannable in documentary and talking-head edits without noisy bouncing word pills.",
    when_to_use: [
      "Talking-head explainers, podcasts, and editorial storytelling",
    ],
    required_inputs: [
      "Timestamped SRT or word-level transcript JSON",
    ],
    expected_outputs: [
      "Dual-line lower-third caption layout with 6-frame wipe reveal",
    ],
    quality_standards: [
      "Active line 100% opacity; upcoming preview line 48% opacity",
    ],
    constraints_and_limitations: [
      "Avoid overlapping lower platform description zones on vertical social feeds.",
    ],
    source_and_attribution: "Edit Central Base Library",
    preferred_provider: "any",
    provider_note: "Pair with timestamped SRT or word-level transcript JSON.",
    compatibility: {
      providers: ["chatgpt", "claude", "gemini", "codex"],
      apps: ["App-Agnostic", "Premiere Pro", "DaVinci Resolve", "After Effects"],
      requirements: "Two synced text layers + vertical wipe mask",
      notes: "Works across all modern editors.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    thumbnail_url: "/images/effect_split_caption_1794988912894.jpg",
    created_at: "2026-11-02",
    updated_at: "2026-11-02",
    content_markdown: `## Purpose
Keep spoken captions scannable in documentary and talking-head edits without noisy bouncing word pills.

## Instructions
1. Anchor two-word caption chunks at roughly \`68%\` vertical screen height.
2. Render the active spoken phrase at \`100%\` opacity in clean medium-weight sans-serif.
3. Display the next phrase subtly below at \`48%\` opacity so viewers anticipate cadence.
4. Reveal transitions with a crisp 6-frame vertical mask wipe.`,
    versions: [
      {
        id: "ver-caption-v1",
        version_number: 1,
        timestamp: "2026-11-02",
        note: "Initial documentary caption layout",
        title: "Dual-Layer Split Caption",
        description:
          "Documentary lower-third caption format contrasting active spoken words at 100% opacity over muted upcoming context.",
        content_markdown: `## Purpose
Keep spoken captions scannable in documentary and talking-head edits without noisy bouncing word pills.

## Instructions
1. Anchor two-word caption chunks at roughly \`68%\` vertical screen height.
2. Render the active spoken phrase at \`100%\` opacity in clean medium-weight sans-serif.
3. Display the next phrase subtly below at \`48%\` opacity so viewers anticipate cadence.
4. Reveal transitions with a crisp 6-frame vertical mask wipe.`,
      },
    ],
  },
  {
    id: "skill-reference-breakdown",
    slug: "creative-reference-breakdown",
    title: "Creative Reference Breakdown",
    description:
      "Provider-agnostic skill to turn any raw script, rough cut notes, or external reference link into a repeatable editing brief.",
    category: "general",
    discipline: "workflow-research",
    tags: ["research", "briefing", "provider-agnostic"],
    collections: ["col-documentary-finishing"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-18T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/creative-reference-breakdown/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Extract repeatable pacing, typography, framing, and audio structure from a user-provided creative reference into clean production guidance.",
    when_to_use: [
      "Analyzing an external video tutorial, rough cut, or reference script inside ChatGPT/Claude",
    ],
    required_inputs: [
      "Reference link, transcript, or observation notes",
      "Target delivery aspect ratio (9:16, 16:9)",
    ],
    expected_outputs: [
      "Structured Markdown production brief ready to store in Edit Central",
    ],
    quality_standards: [
      "Only cite timestamps and technical claims verified in the supplied input",
    ],
    constraints_and_limitations: [
      "Edit Central stores this skill and your supporting references; your chosen AI assistant performs the actual analysis.",
    ],
    source_and_attribution: "Edit Central Platform Direction",
    visual_type: "general",
    preferred_provider: "any",
    provider_note:
      "Paste the target URL, transcript, or rough cut notes below the skill when handing off to ChatGPT, Claude, or Gemini.",
    compatibility: {
      providers: ["chatgpt", "claude", "gemini", "codex"],
      apps: ["App-Agnostic"],
      requirements: "AI assistant capable of reading user-supplied links, transcripts, or notes",
      notes:
        "Edit Central stores this skill and your supporting references; your chosen AI assistant performs the actual analysis.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    created_at: "2026-11-18",
    updated_at: "2026-11-18",
    content_markdown: `## Purpose
Extract repeatable pacing, typography, framing, and audio structure from a user-provided creative reference into clean production guidance.

## Inputs & Context
- Reference link, transcript, or observation notes provided by the user
- Target output format (e.g., 9:16 short, 16:9 essay, product demo)

## Instructions
1. Identify the opening hook mechanism in the first 3 seconds (visual interrupt, question, or audio lead).
2. Summarize cut cadence (average shot length and where rhythmic breaks happen).
3. Document text hierarchy, placement, and contrast treatment.
4. List transition motifs and audio layering cues (SFX risers, ducking, room tone).
5. Output a concise, app-agnostic execution checklist plus optional notes for the user's editing tool.

## Constraints
- Do not invent timestamps or technical values not supported by the supplied input.
- Keep recommendations actionable and portable across editors.

## Expected Output
A structured Markdown brief ready to save back into Edit Central as a new skill or supporting resource.`,
    versions: [
      {
        id: "ver-breakdown-v1",
        version_number: 1,
        timestamp: "2026-11-18",
        note: "Initial tool-agnostic reference breakdown skill",
        title: "Creative Reference Breakdown",
        description:
          "Provider-agnostic skill to turn any raw script, rough cut notes, or external reference link into a repeatable editing brief.",
        content_markdown: `## Purpose
Extract repeatable pacing, typography, framing, and audio structure from a user-provided creative reference into clean production guidance.

## Inputs & Context
- Reference link, transcript, or observation notes provided by the user
- Target output format (e.g., 9:16 short, 16:9 essay, product demo)

## Instructions
1. Identify the opening hook mechanism in the first 3 seconds (visual interrupt, question, or audio lead).
2. Summarize cut cadence (average shot length and where rhythmic breaks happen).
3. Document text hierarchy, placement, and contrast treatment.
4. List transition motifs and audio layering cues (SFX risers, ducking, room tone).
5. Output a concise, app-agnostic execution checklist plus optional notes for the user's editing tool.

## Constraints
- Do not invent timestamps or technical values not supported by the supplied input.
- Keep recommendations actionable and portable across editors.

## Expected Output
A structured Markdown brief ready to save back into Edit Central as a new skill or supporting resource.`,
      },
    ],
  },
  {
    id: "skill-jcut-audio-ducking",
    slug: "audio-jcut-dialogue-ducking",
    title: "Audio-Led J-Cut & Dialogue Ducking",
    description:
      "Smooths harsh scene cuts by leading incoming dialogue 4 frames early while ducking music beds to -22 LUFS.",
    category: "pacing",
    discipline: "audio-dialogue",
    visual_type: "audio-skill",
    tags: ["audio", "j-cut", "ducking", "davinci-resolve"],
    collections: ["col-shortform-retention"],
    status: "ready",
    approval_status: "approved",
    approved_by: "Editorial Library Seed",
    approved_at: "2026-11-18T00:00:00Z",
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/audio-jcut-dialogue-ducking/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Eliminate jarring dead-air gaps between cuts and keep spoken narration cleanly separated from background music.",
    when_to_use: [
      "Talking-head interviews, documentary B-roll transitions, and vertical explainers",
    ],
    required_inputs: [
      "Dialogue track (A1) with trimmed breaths",
      "Music or ambient room-tone bed (A2)",
    ],
    expected_outputs: [
      "DaVinci Resolve Fairlight / Edit timeline audio offsets, crossfades, and sidechain ducking targets",
    ],
    quality_standards: [
      "Dialogue peaks normalized between -6 dBFS and -3 dBFS; integrated mix at -14 LUFS",
      "3-frame exponential crossfade on all split edits to avoid clicks",
    ],
    constraints_and_limitations: [
      "Do not lead audio over an active vocal syllable on the outgoing clip.",
    ],
    source_and_attribution: "Edit Central Base Library — Fairlight & Vertical QA",
    preferred_provider: "claude",
    provider_note:
      "Ready to hand off to Claude for DaVinci Resolve Fairlight or Edit Page scripting.",
    compatibility: {
      providers: ["claude", "chatgpt", "gemini"],
      apps: ["DaVinci Resolve", "Premiere Pro", "Final Cut Pro"],
      requirements: "Multi-track audio timeline + Fairlight compressor/keyframing",
      notes: "Use Resolve Fairlight sidechain compressor or keyframes on A2 music bus.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    created_at: "2026-11-16",
    updated_at: "2026-11-18",
    content_markdown: `## Purpose
Eliminate jarring dead-air gaps between cuts and keep spoken narration cleanly separated from background music.

## Instructions
1. Trim dead air on the incoming dialogue track (A1), leaving a 2-frame breath margin before the first transient.
2. Unlink audio and slip the incoming A1 clip 4 frames earlier than the V1 video cut (J-cut).
3. Apply a 3-frame Constant Power crossfade at every audio edit point.
4. Route A1 as the sidechain key for A2 music ducking: Threshold \`-28 dB\`, Ratio \`3:1\`, Attack \`15ms\`, Release \`220ms\` so music dips to \`-22 LUFS\` under speech.
5. Bridge silent gaps with continuous \`-24 dB\` room tone.

## Expected Output
Clean timeline audio spacing and Fairlight/NLE ducking parameters ready to apply.`,
    versions: [
      {
        id: "ver-jcut-v1",
        version_number: 1,
        timestamp: "2026-11-16",
        note: "Initial J-cut and Fairlight ducking skill",
        title: "Audio-Led J-Cut & Dialogue Ducking",
        description:
          "Smooths harsh scene cuts by leading incoming dialogue 4 frames early while ducking music beds to -22 LUFS.",
        content_markdown: `## Purpose
Eliminate jarring dead-air gaps between cuts and keep spoken narration cleanly separated from background music.

## Instructions
1. Trim dead air on the incoming dialogue track (A1), leaving a 2-frame breath margin before the first transient.
2. Unlink audio and slip the incoming A1 clip 4 frames earlier than the V1 video cut (J-cut).
3. Apply a 3-frame Constant Power crossfade at every audio edit point.
4. Route A1 as the sidechain key for A2 music ducking: Threshold \`-28 dB\`, Ratio \`3:1\`, Attack \`15ms\`, Release \`220ms\` so music dips to \`-22 LUFS\` under speech.
5. Bridge silent gaps with continuous \`-24 dB\` room tone.`,
      },
    ],
  },
];

export function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "skill"
  );
}

export function inferSkillVisualType(skill: {
  visual_type?: SkillVisualType;
  category: SkillCategory;
  discipline: SkillDiscipline;
  tags?: string[];
  title?: string;
  content_markdown?: string;
}): SkillVisualType {
  if (skill.visual_type && skill.visual_type !== "general") {
    return skill.visual_type;
  }
  const titleAndTags = `${skill.title || ""} ${(skill.tags || []).join(" ")}`.toLowerCase();

  if (
    skill.discipline === "audio-dialogue" ||
    /\b(audio|j-cut|l-cut|ducking|lufs|sfx|dialogue|fairlight|waveform)\b/.test(
      titleAndTags
    )
  ) {
    return "audio-skill";
  }
  if (skill.discipline === "workflow-research") {
    return "general";
  }
  if (skill.category === "pacing" || skill.discipline === "editorial-pacing") {
    return "pacing";
  }
  if (skill.category === "text" || skill.discipline === "typography-motion") {
    if (/\b(transition|wipe|split|reveal)\b/.test(titleAndTags)) {
      return "text-transition";
    }
    return "text-animation";
  }
  if (skill.category === "styles" || skill.discipline === "color-finishing") {
    return "graphic-style";
  }
  if (
    skill.category === "graphics" ||
    skill.category === "transitions" ||
    skill.discipline === "transitions-vfx"
  ) {
    return "graphic-animation";
  }
  return skill.visual_type || "general";
}

export type AgentCopyFormat = "prompt" | "skill-md" | "cli" | "json";

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s+/g, " ").trim();
}

function buildAgentPromptPayload(
  skill: SkillItem,
  linkedResources: ResourceItem[] = []
): string {
  const appsList =
    skill.compatibility.apps.length > 0
      ? skill.compatibility.apps.join(", ")
      : "your active workspace / editing environment";
  const providersList =
    skill.compatibility.providers.length > 0
      ? skill.compatibility.providers
          .map((id) => AI_PROVIDERS.find((p) => p.id === id)?.label ?? id)
          .join(", ")
      : "Any AI Agent";

  const lines: string[] = [
    `# Agent Skill: ${skill.title}`,
    "",
    `Apply this reusable skill from Edit Central${
      skill.compatibility.apps.length > 0 ? ` in ${appsList}` : ""
    }. Follow the instructions, quality standards, and constraints below.`,
    "",
  ];

  if (skill.description.trim()) {
    lines.push(`> ${skill.description.trim()}`);
    lines.push("");
  }

  lines.push(`- **Skill ID:** \`${skill.slug || slugifyTitle(skill.title)}\``);
  lines.push(
    `- **Category:** ${SKILL_CATEGORY_LABELS[skill.category]} (${
      SKILL_VISUAL_TYPE_LABELS[inferSkillVisualType(skill)]
    })`
  );
  lines.push(`- **Compatible Agents:** ${providersList}`);
  if (skill.compatibility.apps.length > 0) {
    lines.push(`- **Target Applications:** ${appsList}`);
  }
  if (skill.purpose?.trim()) {
    lines.push(`- **Purpose:** ${skill.purpose.trim()}`);
  }
  if (skill.compatibility.requirements.trim()) {
    lines.push(`- **Requirements:** ${skill.compatibility.requirements.trim()}`);
  }
  if (skill.compatibility.notes.trim()) {
    lines.push(`- **Notes:** ${skill.compatibility.notes.trim()}`);
  }

  if (skill.when_to_use && skill.when_to_use.length > 0) {
    lines.push("", "## When to Use");
    for (const item of skill.when_to_use) {
      lines.push(`- ${item}`);
    }
  }

  if (skill.required_inputs && skill.required_inputs.length > 0) {
    lines.push("", "## Required Inputs");
    for (const item of skill.required_inputs) {
      lines.push(`- ${item}`);
    }
  }

  if (skill.expected_outputs && skill.expected_outputs.length > 0) {
    lines.push("", "## Expected Outputs");
    for (const item of skill.expected_outputs) {
      lines.push(`- ${item}`);
    }
  }

  lines.push("", "## Instructions", "", skill.content_markdown.trim());

  if (skill.quality_standards && skill.quality_standards.length > 0) {
    lines.push("", "## Quality Standards");
    for (const item of skill.quality_standards) {
      lines.push(`- ${item}`);
    }
  }

  if (
    skill.constraints_and_limitations &&
    skill.constraints_and_limitations.length > 0
  ) {
    lines.push("", "## Constraints & Limitations");
    for (const item of skill.constraints_and_limitations) {
      lines.push(`- ${item}`);
    }
  }

  if (linkedResources.length > 0) {
    lines.push("", "## Supporting Reference Resources");
    for (const res of linkedResources) {
      lines.push(`- **${res.title}**${res.url ? ` (${res.url})` : ""}`);
      if (res.content.trim()) {
        lines.push(`  \`\`\`\n  ${res.content.trim()}\n  \`\`\``);
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

function buildAgentSkillMarkdownFile(
  skill: SkillItem,
  linkedResources: ResourceItem[] = []
): string {
  const slug = skill.slug || slugifyTitle(skill.title);
  const compatParts = [
    ...skill.compatibility.providers.map(
      (id) => AI_PROVIDERS.find((p) => p.id === id)?.label ?? id
    ),
    ...skill.compatibility.apps,
  ];
  const primarySource =
    linkedResources.find((r) => Boolean(r.url))?.url ||
    skill.source_and_attribution ||
    "";

  const lines: string[] = [
    "---",
    `name: ${slug}`,
    `description: "${escapeYamlString(skill.description || skill.title)}"`,
    `category: ${skill.category}`,
  ];
  if (compatParts.length > 0) {
    lines.push(`compatibility: "${escapeYamlString(compatParts.join(", "))}"`);
  }
  if (skill.tags.length > 0) {
    lines.push(
      `tags: [${skill.tags.map((t) => `"${escapeYamlString(t)}"`).join(", ")}]`
    );
  }
  if (primarySource.trim()) {
    lines.push(`source: "${escapeYamlString(primarySource)}"`);
  }
  lines.push("---", "");

  const trimmedBody = skill.content_markdown.trim();
  if (!trimmedBody.startsWith("# ")) {
    lines.push(`# ${skill.title}`, "");
  }
  if (skill.purpose?.trim()) {
    lines.push(`**Purpose:** ${skill.purpose.trim()}`, "");
  }
  lines.push(trimmedBody);

  if (skill.when_to_use && skill.when_to_use.length > 0) {
    lines.push("", "## When to Use");
    for (const item of skill.when_to_use) {
      lines.push(`- ${item}`);
    }
  }

  if (skill.quality_standards && skill.quality_standards.length > 0) {
    lines.push("", "## Quality Standards");
    for (const item of skill.quality_standards) {
      lines.push(`- ${item}`);
    }
  }

  if (
    skill.constraints_and_limitations &&
    skill.constraints_and_limitations.length > 0
  ) {
    lines.push("", "## Constraints & Limitations");
    for (const item of skill.constraints_and_limitations) {
      lines.push(`- ${item}`);
    }
  }

  if (linkedResources.length > 0) {
    lines.push("", "## Reference Links");
    for (const res of linkedResources) {
      lines.push(`- ${res.title}${res.url ? `: ${res.url}` : ""}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function formatSkillForAgent(
  skill: SkillItem,
  linkedResources: ResourceItem[] = [],
  format: AgentCopyFormat = "prompt"
): string {
  if (format === "skill-md") {
    return buildAgentSkillMarkdownFile(skill, linkedResources);
  }

  if (format === "cli") {
    const slug = skill.slug || slugifyTitle(skill.title);
    const skillMd = buildAgentSkillMarkdownFile(skill, linkedResources).trimEnd();
    return [
      `mkdir -p .agents/skills/${slug}`,
      `cat << 'EDIT_CENTRAL_SKILL_EOF' > .agents/skills/${slug}/SKILL.md`,
      skillMd,
      "EDIT_CENTRAL_SKILL_EOF",
      "",
    ].join("\n");
  }

  if (format === "json") {
    const payload = {
      name: skill.title,
      slug: skill.slug || slugifyTitle(skill.title),
      description: skill.description,
      category: skill.category,
      visual_type: inferSkillVisualType(skill),
      purpose: skill.purpose || "",
      when_to_use: skill.when_to_use || [],
      required_inputs: skill.required_inputs || [],
      expected_outputs: skill.expected_outputs || [],
      instructions: skill.content_markdown.trim(),
      quality_standards: skill.quality_standards || [],
      constraints_and_limitations: skill.constraints_and_limitations || [],
      compatibility: skill.compatibility,
      tags: skill.tags,
      source_urls: linkedResources
        .map((r) => r.url)
        .filter((u): u is string => Boolean(u)),
      source_and_attribution: skill.source_and_attribution || "",
      github_url: skill.github_url || null,
    };
    return `${JSON.stringify(payload, null, 2)}\n`;
  }

  return buildAgentPromptPayload(skill, linkedResources);
}

export function formatClaudeDaVinciHandoff(
  skill: SkillItem,
  linkedResources: ResourceItem[] = []
): string {
  return formatSkillForAgent(skill, linkedResources, "prompt");
}

export function formatSkillAsMarkdown(
  skill: SkillItem,
  linkedResources: ResourceItem[] = [],
  includeContext = false
): string {
  const lines: string[] = [];

  lines.push(`# ${skill.title}`);
  lines.push("");

  if (skill.description.trim()) {
    lines.push(`> ${skill.description.trim()}`);
    lines.push("");
  }

  if (includeContext) {
    lines.push(`- **Category:** ${SKILL_CATEGORY_LABELS[skill.category]}`);
    lines.push(`- **Discipline:** ${SKILL_DISCIPLINE_LABELS[skill.discipline]}`);
    lines.push(`- **Approval:** ${SKILL_APPROVAL_LABELS[skill.approval_status]}`);
    lines.push(`- **Publishing:** ${SKILL_PUBLISHING_LABELS[skill.publishing_status]}`);
    if (skill.github_url && skill.publishing_status === "published") {
      lines.push(`- **GitHub URL:** ${skill.github_url}`);
    }
    if (skill.tags.length > 0) {
      lines.push(`- **Tags:** ${skill.tags.join(", ")}`);
    }
    if (skill.compatibility.apps.length > 0) {
      lines.push(
        `- **Compatible Applications:** ${skill.compatibility.apps.join(", ")}`
      );
    }
    if (skill.compatibility.providers.length > 0) {
      const providerLabels = skill.compatibility.providers.map(
        (p) => AI_PROVIDERS.find((item) => item.id === p)?.label ?? p
      );
      lines.push(`- **Tested AI Providers:** ${providerLabels.join(", ")}`);
    }
    if (skill.compatibility.requirements.trim()) {
      lines.push(
        `- **Requirements:** ${skill.compatibility.requirements.trim()}`
      );
    }
    if (skill.compatibility.notes.trim()) {
      lines.push(
        `- **Compatibility Notes:** ${skill.compatibility.notes.trim()}`
      );
    }
    if (skill.source_and_attribution?.trim()) {
      lines.push(
        `- **Source & Attribution:** ${skill.source_and_attribution.trim()}`
      );
    }
    if (skill.provider_note.trim()) {
      lines.push(`- **Hand-Off Note:** ${skill.provider_note.trim()}`);
    }
    lines.push("");
  }

  lines.push(skill.content_markdown.trim());

  if (includeContext && linkedResources.length > 0) {
    lines.push("");
    lines.push("## Attached Resources");
    for (const res of linkedResources) {
      lines.push("");
      lines.push(`### ${res.title} (${RESOURCE_TYPE_LABELS[res.type]})`);
      if (res.url) {
        lines.push(`URL: ${res.url}`);
      }
      if (res.file_name) {
        lines.push(`File: \`${res.file_name}\``);
      }
      if (res.content.trim()) {
        lines.push("");
        lines.push(res.content.trim());
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

export function parseImportedMarkdown(
  raw: string,
  fileName?: string
): {
  title: string;
  description: string;
  content_markdown: string;
  tags: string[];
} {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n");

  let title = fileName
    ? fileName.replace(/\.(md|markdown|txt)$/i, "").replace(/[-_]+/g, " ")
    : "Imported Skill";
  let description = "";
  let bodyStartIdx = 0;

  if (lines[0]?.startsWith("# ")) {
    title = lines[0].slice(2).trim() || title;
    bodyStartIdx = 1;
    while (bodyStartIdx < lines.length && lines[bodyStartIdx].trim() === "") {
      bodyStartIdx++;
    }
    if (lines[bodyStartIdx]?.startsWith("> ")) {
      description = lines[bodyStartIdx].slice(2).trim();
      bodyStartIdx++;
      while (bodyStartIdx < lines.length && lines[bodyStartIdx].trim() === "") {
        bodyStartIdx++;
      }
    }
  }

  const content_markdown =
    lines.slice(bodyStartIdx).join("\n").trim() || normalized;

  if (!description) {
    const firstNonHeading = content_markdown
      .split("\n")
      .find((line) => line.trim() && !line.startsWith("#"));
    description = firstNonHeading
      ? firstNonHeading.replace(/[*_`>#-]/g, "").trim().slice(0, 140)
      : "Imported Markdown skill.";
  }

  return {
    title,
    description,
    content_markdown,
    tags: ["imported", "markdown"],
  };
}
