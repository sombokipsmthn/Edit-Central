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
  // === NEW PREMIERE PRO WORKFLOW SKILLS ===
  {
    id: "skill-premiere-pro-workflow-controller",
    slug: "premiere-pro-workflow-controller",
    title: "Premiere Pro Workflow Controller",
    description:
      "Standardized project setup and bin organization for Premiere Pro video editing workflows",
    category: "general",
    discipline: "workflow-research",
    visual_type: "general",
    tags: ["premiere-pro", "project-setup", "organization", "bins"],
    collections: ["col-documentary-finishing"],
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/premiere-pro-workflow-controller/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Establish a professional, reusable project structure that separates raw footage, project assets, sequences, and exports. Ensures all editors follow the same organizational conventions.",
    when_to_use: [
      "Starting a new video project in Premiere Pro",
      "Setting up a project for collaborative editing",
      "Creating templates for repeatable workflow structures",
      "Onboarding new editors to team standards",
    ],
    required_inputs: [
      "Access to original video footage",
      "Adobe Premiere Pro CC 2020 or later installed",
      "Write access to project location",
    ],
    expected_outputs: [
      "Organized project folder structure",
      "Premiere project file saved in Project_Files",
      "Footage bin created and populated",
      "Scratch sequence created",
    ],
    quality_standards: [
      "All project files stored in Project_Files folder",
      "No media files in root project folder",
      "Consistent bin naming across projects",
      "Original footage never modified or moved",
    ],
    constraints_and_limitations: [
      "Do not store exports in project folder structure",
      "Media and project files should be on fast local storage",
      "Keep source footage separate from generated proxies",
      "Do not overwrite original media files",
    ],
    source_and_attribution:
      "Edit Central Premiere Pro Workflow Guidelines, Adobe Premiere Pro User Guide",
    preferred_provider: "any",
    provider_note:
      "Works with Premiere Pro's native bin and sequence tools. For DaVinci Resolve, use the Resolve project structure skill instead.",
    compatibility: {
      providers: ["any"],
      apps: ["Premiere Pro"],
      requirements: "Adobe Premiere Pro CC 2020 or later with file system access",
      notes: "Works with Premiere Pro's native bin and sequence tools. For DaVinci Resolve, use the Resolve project structure skill instead.",
    },
    resource_ids: [],
    created_at: "2026-11-27",
    updated_at: "2026-11-27",
    content_markdown: `## Purpose
Establish a professional, reusable project structure that separates raw footage, project assets, sequences, and exports. Ensures all editors follow the same organizational conventions.

## When to Use
- Starting a new video project in Premiere Pro
- Setting up a project for collaborative editing
- Creating templates for repeatable workflow structures
- Onboarding new editors to team standards

## Instructions

### 1. Project Folder Structure
Create this folder hierarchy in your project directory:

\`\`\`
PROJECT_NAME/
├── Project_Files/
│   ├── PROJECT.prproj
│   └── PROJECT.prin
├── Footage/
│   ├── Camera_A/
│   ├── Camera_B/
│   └── Audio/
├── Audio/
│   ├── Music/
│   ├── Sound_Effects/
│   └── Voiceover/
├── Graphics/
│   ├── Titles/
│   ├── Lower_Thirds/
│   ├── MOGRTs/
│   └── Assets/
├── Sequences/
│   ├── Scratch/
│   └── Final/
├── Exports/
│   ├── Master/
│   ├── Social/
│   │   ├── 9x16/
│   │   ├── 1x1/
│   │   └── 16x9/
│   └── Review/
└── References/
\`\`\`

### 2. Create Premiere Project
1. Open Adobe Premiere Pro
2. Go to **File → New → Project**
3. Navigate to your \`Project_Files/\` folder
4. Save as \`PROJECT_NAME.prproj\`

### 3. Create Footage Bin
1. In the Project panel, right-click → **New Bin**
2. Name: \`Footage\`
3. Import footage into this bin
4. For multi-camera projects, create sub-bins:
   - \`Camera_A/\`
   - \`Camera_B/\`
   - \`Audio/\`

### 4. Create Initial Sequence (Scratch)
1. In the Project panel root (outside Footage bin), right-click → **New Item → Sequence**
2. Name: \`Scratch\`
3. Choose format based on target:
   - **Vertical (9:16)**: 1080×1920, 24/30fps
   - **Horizontal (16:9)**: 1920×1080, 24/30fps
4. Add footage to timeline

### 5. Create Final Sequence Bin
1. In Project panel, create bin: \`Sequences\`
2. Create sub-bins:
   - \`Scratch/\` (copy of initial sequence)
   - \`Final/\` (for completed edits)

## Required Inputs
- Access to original video footage
- Adobe Premiere Pro CC 2020 or later installed
- Write access to project location

## Expected Outputs
- Organized project folder structure
- Premiere project file saved in Project_Files
- Footage bin created and populated
- Scratch sequence created

## Quality Standards
- All project files stored in Project_Files folder
- No media files in root project folder
- Consistent bin naming across projects
- Original footage never modified or moved

## Constraints and Limitations
- Do not store exports in project folder structure
- Media and project files should be on fast local storage
- Keep source footage separate from generated proxies
- Do not overwrite original media files

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Adobe Premiere Pro CC 2020 or later with file system access
- Notes: Works with Premiere Pro's native bin and sequence tools. For DaVinci Resolve, use the Resolve project structure skill instead.

## Source and Attribution
- Edit Central Premiere Pro Workflow Guidelines
- Adobe Premiere Pro User Guide`,
    versions: [
      {
        id: "ver-premiere-workflow-v1",
        version_number: 1,
        timestamp: "2026-11-27",
        note: "Initial Premiere Pro workflow controller skill",
        title: "Premiere Pro Workflow Controller",
        description:
          "Standardized project setup and bin organization for Premiere Pro video editing workflows",
        content_markdown: `## Purpose
Establish a professional, reusable project structure that separates raw footage, project assets, sequences, and exports. Ensures all editors follow the same organizational conventions.

## Instructions
... (truncated for version history)`,
      },
    ],
  },
  {
    id: "skill-talking-head-editing-methodology",
    slug: "talking-head-editing-methodology",
    title: "Talking-Head Editing Methodology",
    description:
      "Decision-based approach to editing talking-head footage for engaging, natural-sounding short-form content",
    category: "general",
    discipline: "workflow-research",
    visual_type: "general",
    tags: ["talking-head", "dialogue", "editing", "short-form", "punctuation"],
    collections: ["col-documentary-finishing"],
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/talking-head-editing-methodology/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Transform raw talking-head footage into polished, engaging content by removing dead air, filler words, and unnecessary pauses while maintaining natural rhythm and sentence integrity.",
    when_to_use: [
      "Editing interview or talking-head footage",
      "Creating social media content from monologues",
      "Preparing content for captions/transcription",
      "Refining dialogue for engagement",
      "Before applying captions to ensure clean timing",
    ],
    required_inputs: [
      "Raw talking-head footage",
      "Understanding of content message",
      "Timeline in Premiere Pro or DaVinci Resolve",
      "Access to ripple delete/insert tools",
    ],
    expected_outputs: [
      "Refined sequence with natural flow",
      "Removed dead air and fillers",
      "Preserved sentence integrity",
      "Engaging pacing for platform",
      "Clean timing for captions",
    ],
    quality_standards: [
      "Viewer cannot identify removed content",
      "Natural speaking rhythm maintained",
      "No obvious jump cuts",
      "Captions will read cleanly",
      "Original meaning preserved",
    ],
    constraints_and_limitations: [
      "Do not make speech sound robotic",
      "Preserve speaker's authentic voice",
      "Don't change meaning of content",
      "Maintain original emotional delivery",
      "Do not remove all pauses - some are necessary for meaning",
    ],
    source_and_attribution:
      "Edit Central Editorial Intelligence Framework, Professional interview editing standards",
    preferred_provider: "any",
    provider_note:
      "Test with captions to verify timing. In Premiere: Use Razor tool (C) and ripple delete (Shift+Delete). In Resolve: Use blade tool and lift.",
    compatibility: {
      providers: ["any"],
      apps: ["Premiere Pro", "DaVinci Resolve"],
      requirements: "Timeline trimming, ripple delete, J-cut/L-cut tools",
      notes: "Test with captions to verify timing. In Premiere: Use Razor tool (C) and ripple delete (Shift+Delete). In Resolve: Use blade tool and lift.",
    },
    resource_ids: [],
    created_at: "2026-11-27",
    updated_at: "2026-11-27",
    content_markdown: `## Purpose
Transform raw talking-head footage into polished, engaging content by removing dead air, filler words, and unnecessary pauses while maintaining natural rhythm and sentence integrity.

## When to Use
- Editing interview or talking-head footage
- Creating social media content from monologues
- Preparing content for captions/transcription
- Refining dialogue for engagement
- Before applying captions to ensure clean timing

## Instructions

### Phase 1: Assessment
1. Watch entire clip to understand:
   - Key message and argument structure
   - Natural pauses and rhythm
   - Strongest takes and statements
   - Question-answer patterns

### Phase 2: Silence Categorization
Identify and handle silence based on type:

**Unnecessary Silence (Remove):**
- Gaps > 5 seconds with no content
- Dead air after speaker moves on
- Technical recording pauses

**Thinking Pauses (Preserve):**
- 0.5-2 second pauses before questions
- Brief moments before key points
- Natural contemplative moments

**Dramatic Pauses (Preserve):**
- Pauses after strong statements
- Pauses for emphasis
- Beats for comedic timing

**Breathing Space (Preserve):**
- 1-2 frame margin before sentence start
- Natural breath between sentences

### Phase 3: Filler Word Removal
1. Locate "um", "uh", "ah", "er", "like", "you know"
2. Remove only the clearest cases
3. Preserve natural speech rhythm
4. Avoid robotic sound in final edit

### Phase 4: False Start Cleanup
1. Identify repeated words or backtracked statements
2. Remove from the start of repeated phrase
3. Maintain sentence flow to next point
4. Use **Lift** (Alt+Shift+Delete) to remove cleanly

### Phase 5: Sentence Integrity
**Never cut:**
- Mid-clause
- Between subject and verb
- Incomplete question structures
- Before conjunction links

### Phase 6: Jump Cut Prevention
Choose appropriate strategy:

**Strategy A: Tight Cuts (For energetic content)**
- Cut on action or gesture
- Match framing and zoom
- Use L-cuts for smooth audio

**Strategy B: B-Roll Insert (For narrative content)**
- Cover cut with relevant B-roll
- Match timing to speech cadence
- Maintain visual interest

**Strategy C: J-Cuts (For dialogue scenes)**
- Lead incoming audio 3-4 frames
- Create natural audio flow
- Smooth visual transitions

### Phase 7: Rhythm Preservation
1. Maintain natural speaking tempo
2. Allow natural pauses for comprehension (minimum 1 second)
3. Match energy level to content type
4. Adjust cut density per platform:
   - **9:16 Shorts**: Higher cut frequency
   - **16:9 Social**: Moderate pacing
   - **Podcast/Iframe**: Preserve natural flow

### Phase 8: Platform-Specific Considerations
**For Social Media (TikTok, Instagram Reels, YouTube Shorts):**
- Minimum phrase length: 2 seconds of continuous speech
- Preserve at least 0.5s before and after each major point
- Remove dead air > 2 seconds

**For Professional Content:**
- Preserve more natural pauses
- Focus on content clarity over pace
- Maintain speaker's authentic delivery

## Required Inputs
- Raw talking-head footage
- Understanding of content message
- Timeline in Premiere Pro or DaVinci Resolve
- Access to ripple delete/insert tools

## Expected Outputs
- Refined sequence with natural flow
- Removed dead air and fillers
- Preserved sentence integrity
- Engaging pacing for platform
- Clean timing for captions

## Quality Standards
- Viewer cannot identify removed content
- Natural speaking rhythm maintained
- No obvious jump cuts
- Captions will read cleanly
- Original meaning preserved

## Constraints and Limitations
- Do not make speech sound robotic
- Preserve speaker's authentic voice
- Don't change meaning of content
- Maintain original emotional delivery
- Do not remove all pauses - some are necessary for meaning

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro, DaVinci Resolve
- Requirements: Timeline trimming, ripple delete, J-cut/L-cut tools
- Notes: Test with captions to verify timing. In Premiere: Use Razor tool (C) and ripple delete (Shift+Delete). In Resolve: Use blade tool and lift.

## Source and Attribution
- Edit Central Editorial Intelligence Framework
- Professional interview editing standards`,
    versions: [
      {
        id: "ver-talking-head-v1",
        version_number: 1,
        timestamp: "2026-11-27",
        note: "Initial talking-head editing methodology skill",
        title: "Talking-Head Editing Methodology",
        description:
          "Decision-based approach to editing talking-head footage for engaging, natural-sounding short-form content",
        content_markdown: `## Purpose
Transform raw talking-head footage into polished, engaging content by removing dead air, filler words, and unnecessary pauses while maintaining natural rhythm and sentence integrity.

## Instructions
... (truncated for version history)`,
      },
    ],
  },
  {
    id: "skill-premiere-pro-transcription-captions",
    slug: "premiere-pro-transcription-captions",
    title: "Premiere Pro Transcription & Captions Workflow",
    description:
      "Step-by-step workflow for transcribing sequences and generating captions in Premiere Pro's Text panel",
    category: "general",
    discipline: "workflow-research",
    visual_type: "general",
    tags: ["transcription", "captions", "subtitles", "accessibility", "premiere-pro"],
    collections: ["col-documentary-finishing"],
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/premiere-pro-transcription-captions/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Create accurate, readable captions from edited sequences using Premiere Pro's built-in Text panel and transcription tools.",
    when_to_use: [
      "After completing rough cut in Scratch sequence",
      "Before final export for accessibility",
      "When creating social media captions",
      "For client review with closed captioning",
    ],
    required_inputs: [
      "Completed Final Sequence",
      "Audio properly mixed and cleared",
      "Understanding of target platform requirements",
    ],
    expected_outputs: [
      "Transcribed transcript in Text panel",
      "Caption file created from transcript",
      "Verified, synchronized captions",
    ],
    quality_standards: [
      "99%+ accuracy in transcribed text",
      "Captions readable without strain",
      "Proper timing (not too fast/slow)",
      "No caption overflow issues",
      "Compliance with platform specifications",
    ],
    constraints_and_limitations: [
      "Do not transcribe until rough cut is complete",
      "Never work on Scratch sequence for captions",
      "Do not apply captions to raw footage",
      "Internet required for Adobe transcription service",
      "Cannot transcribe offline media",
    ],
    source_and_attribution:
      "Adobe Premiere Pro Documentation: Transcribe and Caption, Edit Central Caption Style Guidelines",
    preferred_provider: "any",
    provider_note:
      "Uses Adobe's built-in transcription service. Caption settings can be customized for testing alternatives.",
    compatibility: {
      providers: ["any"],
      apps: ["Premiere Pro"],
      requirements: "Premiere Pro 2022 or later with Text panel, stable internet for transcription",
      notes: "For other platforms, export SRT and import. For DaVinci Resolve, use the Resolve transcription workflow.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    created_at: "2026-11-27",
    updated_at: "2026-11-27",
    content_markdown: `## Purpose
Create accurate, readable captions from edited sequences using Premiere Pro's built-in Text panel and transcription tools.

## When to Use
- After completing rough cut in Scratch sequence
- Before final export for accessibility
- When creating social media captions
- For client review with closed captioning

## Instructions

### Prerequisites
1. Complete rough cut in Scratch sequence
2. Save project
3. Work in Final Sequence for captions (never in Scratch)
4. Ensure sequence audio is properly mixed

### Phase 1: Transcription Setup
1. Select your final sequence in the Project panel
2. Open the **Text** panel (Window → Text)
3. Click the **Transcript** tab
4. Click **Transcribe Sequence** button
5. Set transcription options:
   - **Auto Transcribe**: On by default
   - **Enhanced Speech**: Enable for best accuracy
   - **Speaker Labels**: Enable for multi-speaker content
   - **Content Type**: Choose Interview, Conversation, or Other

### Phase 2: Transcription Process
1. Wait for transcription to complete (varies by sequence length)
2. Review transcript in Text panel
3. Correct any obvious errors before captioning
4. Use timestamps to verify accuracy

### Phase 3: Create Captions
1. In Text panel, click **Captions** tab
2. Click **Create Captions** button
3. Select **From Transcript** option
4. Choose caption format: **Subtitle**

### Phase 4: Default Caption Settings
Apply these baseline settings before reviewing:

| Setting | Value |
|---|---|
| Caption preset | Subtitle Default |
| Format | Subtitle |
| Style | None |
| Maximum characters | 30 |
| Minimum duration | 3.0 seconds |
| Lines | Single |

**Note:** These settings provide a starting point. Test alternative minimum durations with actual content to optimize readability.

### Phase 5: Caption Styling (Optional)
After initial creation, adjust for platform needs:
1. **Position**: Usually bottom, leave 10% margin from bottom
2. **Font**: Sans-serif, 24-28pt for 1080p
3. **Background**: Semi-transparent box (30% opacity)
4. **Color**: White with black outline for contrast

### Phase 6: Review and Refine
1. Play through sequence with captions visible
2. Check timing:
   - Captions should appear 0.5s before audio starts (for reading time)
   - Minimum 1.5s duration for single words
   - Maximum 42 characters per line
3. Verify accuracy:
   - Match spoken words to text
   - Check punctuation and capitalization
   - Verify speaker labels if used

### Phase 7: Sync Verification
1. Use **Synchronize and Offset** tool if captions drift
2. Add manual corrections for:
   - Misheard words
   - Music/interruptions
   - Speaker changes

## Required Inputs
- Completed Final Sequence
- Audio properly mixed and cleared
- Understanding of target platform requirements

## Expected Outputs
- Transcribed transcript in Text panel
- Caption file created from transcript
- Verified, synchronized captions

## Quality Standards
- 99%+ accuracy in transcribed text
- Captions readable without strain
- Proper timing (not too fast/slow)
- No caption overflow issues
- Compliance with platform specifications

## Constraints and Limitations
- Do not transcribe until rough cut is complete
- Never work on Scratch sequence for captions
- Do not apply captions to raw footage
- Internet required for Adobe transcription service
- Cannot transcribe offline media

## Testing Alternative Settings
**Recommended test approach:**
1. Create test sequence (15-30 seconds)
2. Apply default settings (3.0s min duration)
3. Export with 2.0s min duration
4. Compare readability and pacing
5. Obtain user approval before applying to full project

## Source and Attribution
- Adobe Premiere Pro Documentation: Transcribe and Caption
- Edit Central Caption Style Guidelines`,
    versions: [
      {
        id: "ver-transcription-v1",
        version_number: 1,
        timestamp: "2026-11-27",
        note: "Initial Premiere Pro transcription workflow skill",
        title: "Premiere Pro Transcription & Captions Workflow",
        description:
          "Step-by-step workflow for transcribing sequences and generating captions in Premiere Pro's Text panel",
        content_markdown: `## Purpose
Create accurate, readable captions from edited sequences using Premiere Pro's built-in Text panel and transcription tools.

## Instructions
... (truncated for version history)`,
      },
    ],
  },
  {
    id: "skill-premiere-pro-audio-finishing",
    slug: "premiere-pro-audio-finishing",
    title: "Premiere Pro Audio and Music Finishing",
    description:
      "Audio finishing workflow for dialogue ducking, music mixing, and final audio polish in Premiere Pro",
    category: "pacing",
    discipline: "audio-dialogue",
    visual_type: "audio-skill",
    tags: ["audio", "ducking", "mixing", "music", "dialogue", "premiere-pro"],
    collections: ["col-shortform-retention"],
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/premiere-pro-audio-finishing/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Complete the audio mix for edited sequences by adding music, applying dialogue ducking, and refining problematic sections.",
    when_to_use: [
      "After rough cut is complete in Final Sequence",
      "Before applying captions (audio affects timing)",
      "When adding background music to dialogue content",
      "For final audio pass before export",
    ],
    required_inputs: [
      "Completed Final Sequence with dialogue",
      "Background music asset (from Envato or project library)",
      "Clean dialogue audio (trimmed dead air)",
    ],
    expected_outputs: [
      "Music bed integrated into timeline",
      "Dialogue ducking applied and balanced",
      "Audio mix meeting -14 LUFS standard",
      "All problematic sections refined",
    ],
    quality_standards: [
      "Dialogue peaks between -6 dBFS and -3 dBFS",
      "Integrated mix at -14 LUFS",
      "3-frame (0.1s) crossfades on all audio edits",
      "Music does not compete with dialogue",
      "Full mix plays without clipping",
    ],
    constraints_and_limitations: [
      "Do not apply arbitrary audio settings without listening and evaluating",
      "Ducking should be subtle, not obvious",
      "Never duck dialogue - only duck music under speech",
      "Monitor for phase issues with music",
      "Test audio on multiple playback systems",
    ],
    source_and_attribution:
      "Edit Central Audio Finishing Standards, Adobe Premiere Pro Essential Sound Panel Guide, -14 LUFS integrated loudness standard for social platforms",
    preferred_provider: "any",
    provider_note:
      "Workflow requires listening and evaluation after each step. Do not apply settings blindly without hearing results.",
    compatibility: {
      providers: ["any"],
      apps: ["Premiere Pro"],
      requirements: "Multi-track timeline, Essential Sound panel, Remix feature",
      notes: "For advanced audio work, send to Adobe Audition. Premiere's built-in tools sufficient for most social content.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    created_at: "2026-11-27",
    updated_at: "2026-11-27",
    content_markdown: `## Purpose
Complete the audio mix for edited sequences by adding music, applying dialogue ducking, and refining problematic sections.

## When to Use
- After rough cut is complete in Final Sequence
- Before applying captions (audio affects timing)
- When adding background music to dialogue content
- For final audio pass before export

## Instructions

### Phase 1: Music Selection
1. Review project's existing music library
2. If no suitable music available:
   - Browse Envato Elements/Stock for royalty-free options
   - Search for "background music for video" or "cinematic underscore"
   - Download and import into project

### Phase 2: Music Integration
1. Add music track to timeline below dialogue
2. Use Premiere's **Remix** feature when needed:
   - Right-click music clip → **Audio → Remix**
   - Set target duration to match sequence length
   - Choose **Preserve Melody** for musical integrity
   - Choose **Preserve Rhythm** for consistent beat

### Phase 3: Dialogue Ducking Setup
**Method A: Essential Sound Panel (Recommended)**

1. Select dialogue clip(s)
2. **Window → Essential Sound**
3. Click **Dialogue** preset
4. Enable **Reduce Noise** (set to 12-25% as needed)
5. Enable **Reduce Reverb** (10-20% as needed)

**Method B: Audition Ducking**

1. Select dialogue clip
2. **Audio → Ducking → Adaptive**
   - Threshold: -25 to -30 dB
   - Reduction: 12-15 dB
   - Attack: 50-100 ms
   - Release: 300-500 ms
3. Select music track
4. Apply **Send to Adobe Audition** for refined ducking

### Phase 4: Ducking Implementation
1. Create separate music bus/track
2. Set up sidechain ducking:
   - Enable **Audio Track Mixer**
   - Click **Send** on music track
   - Route to **Sends** → **Ducks**
   - Adjust ducking amount: 4-8 dB reduction under speech
3. Fine-tune parameters:
   - **Pre-delay**: 10-30 ms (let speech start before music dips)
   - **Recovery**: 500-1000 ms (how quickly music returns)

### Phase 5: Mix Balancing
1. Play complete sequence
2. Adjust levels:
   - Dialogue: -6 to -3 dBFS peaks
   - Music: -18 to -12 dBFS integrated
   - Combined mix: -14 LUFS integrated
3. Use **Loudness Radar** to verify:
   - Integrated: -14 LUFS
   - True Peak: -1 dBTP

### Phase 6: Problematic Section Refinement
1. **Identify issues:**
   - Music overpowering dialogue at any point
   - Low-frequency rumble in quiet sections
   - Clipping or distortion
   - Background noise/hum

2. **Fix problems:**
   - Add **Highpass filter** at 80-120 Hz to dialogue
   - Use **Parametric EQ** to reduce specific frequencies
   - Apply **Noise Reduction** to quiet sections
   - Add **Compressor** to dialogue for consistency

### Phase 7: Audio Transitions
1. Add **Crossfades** between music segments:
   - 1-2 second constant power crossfades
   - No hard cuts between music changes
2. Use **audio keyframes** for:
   - Volume automation around speech
   - Music entrances/exits
   - Ducking curves

## Required Inputs
- Completed Final Sequence with dialogue
- Background music asset (from Envato or project library)
- Clean dialogue audio (trimmed dead air)

## Expected Outputs
- Music bed integrated into timeline
- Dialogue ducking applied and balanced
- Audio mix meeting -14 LUFS standard
- All problematic sections refined

## Quality Standards
- Dialogue peaks between -6 dBFS and -3 dBFS
- Integrated mix at -14 LUFS
- 3-frame (0.1s) crossfades on all audio edits
- Music does not compete with dialogue
- Full mix plays without clipping

## Constraints and Limitations
- Do not apply arbitrary audio settings without listening and evaluating
- Ducking should be subtle, not obvious
- Never duck dialogue - only duck music under speech
- Monitor for phase issues with music
- Test audio on multiple playback systems

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Multi-track timeline, Essential Sound panel, Remix feature
- Notes: For advanced audio work, send to Adobe Audition. Premiere's built-in tools sufficient for most social content.

## Listening Checklist
Before final export:
- [ ] Play through with headphones
- [ ] Play through with speakers
- [ ] Check on phone speakers
- [ ] Verify no audio clipping
- [ ] Confirm ducking is natural, not mechanical
- [ ] Listen to quietest and loudest sections

## Source and Attribution
- Edit Central Audio Finishing Standards
- Adobe Premiere Pro Essential Sound Panel Guide
- -14 LUFS integrated loudness standard for social platforms`,
    versions: [
      {
        id: "ver-audio-finishing-v1",
        version_number: 1,
        timestamp: "2026-11-27",
        note: "Initial Premiere Pro audio finishing skill",
        title: "Premiere Pro Audio and Music Finishing",
        description:
          "Audio finishing workflow for dialogue ducking, music mixing, and final audio polish in Premiere Pro",
        content_markdown: `## Purpose
Complete the audio mix for edited sequences by adding music, applying dialogue ducking, and refining problematic sections.

## Instructions
... (truncated for version history)`,
      },
    ],
  },
  {
    id: "skill-premiere-pro-colour-grading",
    slug: "premiere-pro-colour-grading",
    title: "Premiere Pro Colour Correction and Adjustment-Layer Grading",
    description:
      "Colour correction and adjustment layer grading workflow for Premiere Pro",
    category: "styles",
    discipline: "color-finishing",
    visual_type: "graphic-style",
    tags: ["colour", "grading", "adjustment-layers", "correction", "premiere-pro"],
    collections: ["col-documentary-finishing"],
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/premiere-pro-colour-grading/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Develop a professional colour workflow that considers individual shot correction, exposure consistency, white balance, skin tones, contrast, and creative grading using Premiere Pro's adjustment layers.",
    when_to_use: [
      "After audio finishing is complete",
      "Before captions (colour affects readability)",
      "For any visual content requiring colour consistency",
      "When applying creative colour grades",
    ],
    required_inputs: [
      "Edited sequence in Premiere Pro",
      "Understanding of target aesthetic",
      "Reference images (optional)",
    ],
    expected_outputs: [
      "Consistent exposure across all clips",
      "Balanced white balance",
      "Preserved skin tones",
      "Creative grade applied via adjustment layers",
      "Individual clips corrected where needed",
    ],
    quality_standards: [
      "Smooth, consistent colour throughout",
      "Skin tones look natural, not oversaturated",
      "No exposure jumps between clips",
      "Creative grade enhances, not distracts",
      "Adjustment layers properly organised",
    ],
    constraints_and_limitations: [
      "Do not crush blacks or clip highlights",
      "Preserve detail in skin tones",
      "Adjustment layers are non-destructive",
      "Individual clip corrections override adjustment layers",
    ],
    source_and_attribution:
      "Edit Central Colour Finishing Guidelines, Adobe Lumetri Color Documentation, Reference: skill-halation-film-grade for 16mm film emulation techniques",
    preferred_provider: "any",
    provider_note:
      "Individual clips may need correction before shared grade. Adjustment layers preserve ability to refine individual shots.",
    compatibility: {
      providers: ["any"],
      apps: ["Premiere Pro"],
      requirements: "Lumetri Color panel, adjustment layer support",
      notes: "For DaVinci Resolve, use the 16mm Halation Grade skill as reference but adapt to Resolve's colour page.",
    },
    resource_ids: ["res-halation-reference-link"],
    created_at: "2026-11-27",
    updated_at: "2026-11-27",
    content_markdown: `## Purpose
Develop a professional colour workflow that considers individual shot correction, exposure consistency, white balance, skin tones, contrast, and creative grading using Premiere Pro's adjustment layers.

## When to Use
- After audio finishing is complete
- Before captions (colour affects readability)
- For any visual content requiring colour consistency
- When applying creative colour grades

## Instructions

### Phase 1: Individual Shot Correction

**1. Exposure Consistency**
1. Select clip in timeline
2. Open **Lumetri Color** panel
3. Check **Basic Correction**:
   - **Exposure**: Adjust so highlights clip at 100 IRE
   - **Contrast**: Start at default, adjust per shot
   - **Highlights**: Pull back to -50 to -100 if needed
   - **Shadows**: Lift to avoid crushing black

**2. White Balance**
1. Use **White Balance** tool in Lumetri
2. Sample neutral grey or use **Auto White Balance**
3. Fine-tune:
   - **Temperature**: 3200K-9500K range
   - **Tint**: -100 to +100 range
4. Check skin tones - should not shift toward magenta or green

**3. Skin Tone Preservation**
1. Use **Vectorscope**:
   - Skin tones should sit at 330°-350° angle
   - Saturation should be 50-80%
2. Use **HSL Secondary**:
   - Isolate skin tones with **HSL Picker**
   - Reduce saturation slightly if oversaturated
   - Do not shift hue significantly

### Phase 2: Create Adjustment Layer

**1. Add Adjustment Layer**
1. Select a clip that will be affected by grade
2. ** Sequence → New Adjustment Layer**
   - Match sequence settings
   - Size: Full
   - Duration: Cover entire sequence

**2. Organise Adjustment Layers**
Create layers in this order (top to bottom):
1. **Creative Grade** (top) - Color lookup, film emulation
2. **Contrast Boost** - S-curve, contrast enhancement
3. **Base Correction** (bottom) - Exposure, WB fixes

### Phase 3: Base Correction on Adjustment Layer

1. Apply **Lumetri Color** to adjustment layer
2. Make corrections that apply globally:
   - Overall exposure adjustment
   - Common white balance
   - Global contrast curve

### Phase 4: Creative Grade

**Option A: Film Emulation**
1. **Creative → Look**: Apply Kodak 2383 or similar
2. **Intensity**: 25-50% for subtle, 75-100% for strong
3. **Saturation**: Adjust to taste (-20 to +20)

**Option B: Tint/Stylised**
1. **Creative → Tint**: For stylized looks
2. **Color Wheels**:
   - Midtones: Warm (orange) for skin tones
   - Shadows: Cool (blue) for contrast
   - Highlights: Warm for cinematic feel

**Option C: Color Lookup**
1. Import LUT file (.cube)
2. Apply via **Effects → Color → Lumetri LUT**
3. Adjust **Amount** parameter (0-100%)

### Phase 5: Individual Clip Correction

**When individual clips need correction before shared grade:**
1. Select clip in timeline
2. Open **Lumetri Color**
3. Make clip-specific adjustments:
   - Fix extreme exposure issues
   - Correct severe color casts
   - Balance with surrounding clips
4. These corrections will override adjustment layer for that clip

### Phase 6: Fine-Tuning

**1. Check Consistency**
1. Play through timeline rapidly
2. Identify colour jumps or flicker
3. Make subtle adjustments to problematic clips

**2. Use Scopes**
1. Enable **Vectorscope** and **Parade**
2. Check for:
   - Skin tone drift
   - Exposure inconsistencies
   - Colour banding

**3. Match Shots**
1. Pick reference clip
2. Use **Color Match** in Lumetri:
   - Generate 33x LUT from reference
   - Apply to other clips
3. Fine-tune by eye

### Phase 7: Advanced Techniques

**1. Secondary Corrections**
1. **HSL Secondary**:
   - Isolate colors (sky, grass, etc.)
   - Adjust saturation, luminance, hue
2. **Power Windows**:
   - Draw shape around subject
   - Apply graded only inside shape

**2. Grain Addition**
1. **Effects → Noise → Add Grain**
2. Settings:
   - Amount: 5-15%
   - Size: 1.0
   - Roughness: 0-25
3. Blend: Overlay or Soft Light at 25-50% opacity

## Required Inputs
- Edited sequence in Premiere Pro
- Understanding of target aesthetic
- Reference images (optional)

## Expected Outputs
- Consistent exposure across all clips
- Balanced white balance
- Preserved skin tones
- Creative grade applied via adjustment layers
- Individual clips corrected where needed

## Quality Standards
- Smooth, consistent colour throughout
- Skin tones look natural, not oversaturated
- No exposure jumps between clips
- Creative grade enhances, not distracts
- Adjustment layers properly organised

## Constraints and Limitations
- Do not crush blacks or clip highlights
- Preserve detail in skin tones
- Adjustment layers are non-destructive
- Individual clip corrections override adjustment layers

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Lumetri Color panel, adjustment layer support
- Notes: For DaVinci Resolve, use the 16mm Halation Grade skill as reference but adapt to Resolve's colour page.

## Adjustment Layer Order (Recommended)
\`\`\`
Top:    Creative Grade
          - Color LUT / Look
          - Tint effects

Middle: Contrast Enhancement
          - S-curve
          - Contrast boost

Bottom: Base Correction
          - Exposure
          - White balance
          - General fixes
\`\`\`

## Source and Attribution
- Edit Central Colour Finishing Guidelines
- Adobe Lumetri Color Documentation
- Reference: \`skill-halation-film-grade\` for 16mm film emulation techniques`,
    versions: [
      {
        id: "ver-colour-grading-v1",
        version_number: 1,
        timestamp: "2026-11-27",
        note: "Initial Premiere Pro colour grading skill",
        title: "Premiere Pro Colour Correction and Adjustment-Layer Grading",
        description:
          "Colour correction and adjustment layer grading workflow for Premiere Pro",
        content_markdown: `## Purpose
Develop a professional colour workflow that considers individual shot correction, exposure consistency, white balance, skin tones, contrast, and creative grading using Premiere Pro's adjustment layers.

## Instructions
... (truncated for version history)`,
      },
    ],
  },
  {
    id: "skill-premiere-pro-extension-toolkit",
    slug: "premiere-pro-extension-toolkit",
    title: "Premiere Pro Extension Toolkit",
    description:
      "Guide to using Film Impact, Animation Composer, and Spread extensions in Premiere Pro",
    category: "general",
    discipline: "workflow-research",
    visual_type: "general",
    tags: ["extensions", "plugins", "transitions", "titles", "multicam", "premiere-pro"],
    collections: ["col-documentary-finishing"],
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/premiere-pro-extension-toolkit/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Document each installed Premiere Pro extension separately with recommended usage and platform-specific operating procedures. Never invent extension functionality - inspect actual documentation or interface.",
    when_to_use: [
      "Adding transitions between clips",
      "Applying visual effects to clips or adjustment layers",
      "Creating titles and lower thirds",
      "Working with multicamera footage",
      "Synchronizing separate audio and video recordings",
    ],
    required_inputs: [
      "Premiere Pro 2020 or later",
      "Film Impact Dashboard extension installed",
      "Mr Horse Animation Composer extension installed",
      "Spread extension installed (see documentation)",
      "Project media imported",
    ],
    expected_outputs: [
      "Access to enhanced transitions, titles, and multicam tools",
      "Faster editing workflow with templates and presets",
      "Consistent visual style across projects",
    ],
    quality_standards: [
      "Extension features work as documented",
      "No project corruption from extension use",
      "Templates and presets are reusable",
      "Exported assets maintain quality",
    ],
    constraints_and_limitations: [
      "Do not invent Spread functionality or controls",
      "Extension features may vary by version",
      "Some features require specific hardware acceleration",
      "Always test new extension versions before production work",
    ],
    source_and_attribution:
      "Film Impact Official Documentation, Mr Horse Animation Composer User Guide, Spread Extension Documentation: https://rhysobasi.store/products/spread, Adobe Premiere Pro Extension Best Practices",
    preferred_provider: "any",
    provider_note:
      "Extension documentation should be consulted for exact feature lists and version compatibility.",
    compatibility: {
      providers: ["any"],
      apps: ["Premiere Pro"],
      requirements: "Film Impact Dashboard, Mr Horse Animation Composer, Spread extension installed",
      notes: "Extension documentation should be consulted for exact feature lists and version compatibility.",
    },
    resource_ids: [],
    created_at: "2026-11-27",
    updated_at: "2026-11-27",
    content_markdown: `## Purpose
Document each installed Premiere Pro extension separately with recommended usage and platform-specific operating procedures. Never invent extension functionality - inspect actual documentation or interface.

## Installed Extensions

### 1. Film Impact Dashboard

**Purpose:** Provides transitions, visual effects, and motion graphics for Premiere Pro.

**When to Use:**
- Adding transitions between clips
- Applying visual effects to clips or adjustment layers
- Creating motion graphics elements

**Usage:**
1. Open **Window → Extensions → Film Impact Dashboard**
2. Browse transition categories:
   - **Transitions**: Standard cuts, dissolves, wipes
   - **Motion**: Slide, zoom, spin effects
   - **Stylized**: Glitch, light leaks, film damage
3. Drag transition to timeline between clips
4. Adjust duration in Effect Controls
5. For visual effects:
   - Apply to clip
   - Adjust parameters in Effect Controls

**Recommended Transitions for Talking-Head Edits:**
- **Cross Dissolve**: Gentle scene changes
- **Push**: For section transitions
- **Slide Left/Right**: For B-roll overlays
- **Light Fade**: For endings

**Film Impact Workflow Tips:**
1. Apply transition first, then adjust
2. Use shorter durations (8-12 frames) for social content
3. Match transition speed to content energy
4. Save favorite settings as favorites in dashboard

### 2. Mr Horse Animation Composer

**Purpose:** Titles, motion graphics, animations, transitions, and presets for Premiere Pro.

**When to Use:**
- Creating titles and lower thirds
- Adding animated text overlays
- Applying animation presets
- Creating custom motion graphics

**Usage:**
1. Open **Window → Extensions → Animation Composer**
2. Choose template from:
   - **Titles**: Animated titles, lower thirds
   - **Transitions**: Text-based wipes, reveals
   - **Countdowns**: Timer animations
   - **Shapes**: Animated geometric elements
3. Customize:
   - Text content
   - Animation speed
   - Color and style
   - Position on screen
4. Export template for reuse

**Recommended Titles for Talking-Head Edits:**
- **Lower Thirds**: For speaker identification
- **Title Reveal**: For opening hooks
- **Text Pop**: For emphasis words
- **Quote Cards**: For key statements

**Animation Composer Workflow Tips:**
1. Create master template, then duplicate for variations
2. Use consistent timing (8-15 frames for social)
3. Match font choices to platform
4. Save templates to Motion Graphics Template Media folder

### 3. Spread Extension

**Purpose:** Custom extension for multicam editing, multiple-track editing, video-track synchronization, audio/video synchronization.

**Documentation Reference:** https://rhysobasi.store/products/spread

**When to Use:**
- Working with multicamera footage
- Editing multiple video tracks simultaneously
- Synchronizing separate audio and video recordings
- Creating complex multi-layer edits

**Spread Capabilities (per documentation):**
- **Multicam Editing**: Merge multiple camera angles into single timeline
- **Multiple-Track Editing**: Perform edits across multiple video tracks simultaneously
- **Video-Track Synchronization**: Align clips on different tracks by time
- **Audio/Video Synchronization**: Sync separate audio tracks with video recordings

**Usage:**
1. Open **Window → Extensions → Spread**
2. For **Multicam Editing**:
   - Select all camera angles in Project panel
   - Use Spread's multicam creation tool
   - Set synchronization method (timecode, audio waveform, or markers)
   - Create multicam source sequence

3. For **Track Synchronization**:
   - Select clips across different tracks
   - Use Spread's sync tools to align in time
   - Verify sync points for accuracy

4. For **Multiple-Track Editing**:
   - Select multiple clips across tracks
   - Apply cuts, trims, or effects simultaneously
   - Useful for complex motion graphics timing

**Spread Workflow Tips:**
1. Verify extension is properly installed before use
2. Backup project before major Spread operations
3. Test synchronization accuracy before committing
4. Document multicam settings for reproducibility

**Note:** Spread is a custom extension. Always refer to the official documentation at https://rhysobasi.store/products/spread for complete feature details and version-specific capabilities.

## Extension Integration with Native Premiere Features

| Feature | Native Premiere | Film Impact | Animation Composer | Spread |
|---------|-----------------|-------------|-------------------|--------|
| Standard transitions | Yes | Enhanced | Yes | N/A |
| Custom titles | Yes | N/A | Enhanced | N/A |
| Multicam editing | Yes | N/A | N/A | Enhanced |
| Motion graphics | Basic | Yes | Enhanced | N/A |
| Track management | Yes | N/A | N/A | Enhanced |

## Installation Verification

**Before using extensions:**
1. Open **Window → Extensions**
2. Verify all three extensions appear in menu
3. Launch each extension and check for interface
4. Refer to extension-specific documentation for:
   - Supported file formats
   - System requirements
   - Troubleshooting

## Envato Integration (Optional)

**For Music & Audio Assets:**
- Envato Elements provides royalty-free music, SFX, and audio assets
- Access via web browser or download to local project Audio/ folder
- No native Premiere Pro MCP exists - user downloads assets manually
- Recommended workflow:
  1. Browse Envato Elements library
  2. Download assets to \`Audio/Music/\` or \`Audio/Sound_Effects/\`
  3. Import into Premiere Pro
  4. Apply via standard import workflow

**Note:** Envato does not provide a native Premiere Pro extension. Assets must be downloaded and imported manually.

## Troubleshooting

**Extension won't open:**
- Restart Premiere Pro
- Verify extension is installed in Correct Extensions folder
- Check Premiere Pro version compatibility
- Reinstall extension from source

**Feature not working:**
- Verify project settings match extension requirements
- Check media is offline/online as needed
- Try creating new sequence with different settings

**Performance issues:**
- Close other panels while using heavy extensions
- Render previews before applying effects
- Work with optimized media

## Required Inputs
- Premiere Pro 2020 or later
- Film Impact Dashboard extension installed
- Mr Horse Animation Composer extension installed
- Spread extension installed (see documentation)
- Project media imported

## Expected Outputs
- Access to enhanced transitions, titles, and multicam tools
- Faster editing workflow with templates and presets
- Consistent visual style across projects

## Quality Standards
- Extension features work as documented
- No project corruption from extension use
- Templates and presets are reusable
- Exported assets maintain quality

## Constraints and Limitations
- Do not invent Spread functionality or controls
- Extension features may vary by version
- Some features require specific hardware acceleration
- Always test new extension versions before production work

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Film Impact Dashboard, Mr Horse Animation Composer, Spread extension installed
- Notes: Extension documentation should be consulted for exact feature lists and version compatibility

## Source and Attribution
- Film Impact Official Documentation
- Mr Horse Animation Composer User Guide
- Spread Extension Documentation: https://rhysobasi.store/products/spread
- Adobe Premiere Pro Extension Best Practices`,
    versions: [
      {
        id: "ver-extension-toolkit-v1",
        version_number: 1,
        timestamp: "2026-11-27",
        note: "Initial Premiere Pro extension toolkit skill",
        title: "Premiere Pro Extension Toolkit",
        description:
          "Guide to using Film Impact, Animation Composer, and Spread extensions in Premiere Pro",
        content_markdown: `## Purpose
Document each installed Premiere Pro extension separately with recommended usage and platform-specific operating procedures. Never invent extension functionality - inspect actual documentation or interface.

## Instructions
... (truncated for version history)`,
      },
    ],
  },
  {
    id: "skill-premiere-pro-export-quality-control",
    slug: "premiere-pro-export-quality-control",
    title: "Premiere Pro Export and Quality Control",
    description:
      "Export settings and quality control checklist for Premiere Pro final delivery",
    category: "general",
    discipline: "workflow-research",
    visual_type: "general",
    tags: ["export", "quality-control", "delivery", "qc", "premiere-pro"],
    collections: ["col-documentary-finishing"],
    status: "draft",
    approval_status: "pending",
    approved_by: null,
    approved_at: null,
    publishing_status: "not_ready",
    github_repository: "sombokipsmthn/Edit-Central",
    github_branch: "master",
    github_path: "skills/premiere-pro-export-quality-control/SKILL.md",
    github_commit_sha: null,
    github_url: null,
    published_at: null,
    purpose:
      "Configure render settings and manage export queue for final delivery files with comprehensive quality control checks.",
    when_to_use: [
      "After audio finishing and colour grading",
      "Before delivering client projects",
      "For social media content distribution",
      "When archiving completed projects",
    ],
    required_inputs: [
      "Completed sequence with final edits",
      "Colour grading and audio finishing done",
      "Captions generated",
      "Understanding of target platform requirements",
    ],
    expected_outputs: [
      "Exported media files in correct format",
      "Quality control verification complete",
      "Files organized in delivery structure",
      "Archive backup created",
    ],
    quality_standards: [
      "99.9% frame accuracy",
      "Audio peaks within -6 dBFS to -3 dBFS",
      "Integrated loudness at -14 LUFS",
      "No visual artifacts or corruption",
      "Captions properly timed and positioned",
    ],
    constraints_and_limitations: [
      "Do not skip QC checks",
      "Verify exports play on target devices",
      "Keep original project files separate from exports",
      "Do not overwrite previous deliveries without new naming",
    ],
    source_and_attribution:
      "Edit Central QA Standards, Adobe Media Encoder Documentation, Platform-specific delivery specifications (Instagram, TikTok, YouTube)",
    preferred_provider: "any",
    provider_note:
      "Verify exports match platform specifications. Audio must be -14 LUFS integrated.",
    compatibility: {
      providers: ["any"],
      apps: ["Premiere Pro"],
      requirements: "Premiere Pro, Media Encoder recommended, exported files for QC",
      notes: "Verify exports match platform specifications. Audio must be -14 LUFS integrated.",
    },
    resource_ids: ["res-shortform-qa-checklist"],
    created_at: "2026-11-27",
    updated_at: "2026-11-27",
    content_markdown: `## Purpose
Configure render settings and manage export queue for final delivery files with comprehensive quality control checks.

## When to Use
- After audio finishing and colour grading
- Before delivering client projects
- For social media content distribution
- When archiving completed projects

## Instructions

### Phase 1: Export Settings Configuration

**1. Access Export Settings**
1. Select sequence in Project panel
2. **File → Export → Media** (or Ctrl+M)
3. Or use **Adobe Media Encoder** for batch exports

**2. Recommended Export Presets**

| Platform | Format | Codec | Resolution | Preset |
|----------|--------|-------|------------|--------|
| YouTube | H.264 | MP4 | 1080x1920 | YouTube 1080p HD |
| Instagram | H.264 | MP4 | 1080x1920 | Custom 9:16 |
| TikTok | H.264 | MP4 | 1080x1920 | Custom 9:16 |
| Vimeo | H.264 | MP4 | 1920x1080 | Vimeo 1080p |
| Master Archive | ProRes | MOV | Source | ProRes 422 HQ |

**3. H.264 Custom Settings (Social 9:16)**
- **Format**: H.264
- **Preset**: Match Source - High bitrate
- **Video** tab:
  - Width: 1080, Height: 1920
  - Frame Rate: Match source
  - Field Order: Progressive
  - Level: 4.2
  - Profile: High
  - Bitrate Encoding: VBR, 2 pass
  - Target Bitrate: 15 Mbps
  - Maximum Bitrate: 20 Mbps
- **Audio**:
  - Format: AAC
  - Bitrate: 320 kbps
  - Sample Rate: 48000 Hz

**4. ProRes Master Archive Settings**
- **Format**: QuickTime
- **Codec**: Apple ProRes 422 HQ
- **Resolution**: Match source
- **Frame Rate**: Match source
- **Audio**: 48 kHz, 24-bit or 32-bit float

### Phase 2: Export Queue Management

**1. Adding to Queue**
1. In Export Settings, click **Queue** (not Run)
2. Opens Adobe Media Encoder
3. Add more exports to queue

**2. Queue Organization**
1. Rename queue items descriptively:
   - \`PROJECT_social_9x16.mp4\`
   - \`PROJECT_master_prores.mov\`
   - \`PROJECT_16x9_instagram.mp4\`
2. Set output folder per delivery type:
   - \`Exports/Social/9x16/\`
   - \`Exports/Social/16x9/\`
   - \`Exports/Master/\`

**3. Batch Export Settings**
1. Enable **Use Previews** for faster rendering
2. Set **Background Processing**: On
3. Monitor queue progress in Media Encoder

### Phase 3: Quality Control Checklist

**✅ PRE-EXPORT CHECK**
- [ ] Sequence properly rendered in timeline
- [ ] All effects and transitions applied
- [ ] Audio peaks between -6 dBFS and -3 dBFS
- [ ] Integrated audio at -14 LUFS
- [ ] Captions displayed correctly
- [ ] Colour grading applied and consistent

**✅ EXPORT VERIFICATION**
- [ ] Correct resolution exported
- [ ] Correct frame rate exported
- [ ] Audio present and synced
- [ ] Captions burned in or muxed
- [ ] File size reasonable for content length

**✅ POST-EXPORT CHECK**
- [ ] Play through export on primary monitor
- [ ] Verify no dropped frames
- [ ] Check audio levels in export
- [ ] Verify captions timing
- [ ] Test playback on target device

**✅ PLATFORM-SPECIFIC CHECKS**

**For 9:16 Social Media:**
- [ ] Text inside safe margins (outer 10% safe)
- [ ] Primary content inside center 70% vertical
- [ ] Contrast > 4.5:1 over background
- [ ] First frame has visual/text hook

**For 16:9 Standard:**
- [ ] No horizontal letterboxing issues
- [ ] All important content in safe area
- [ ] Subtitles properly positioned

**For Master Archive:**
- [ ] ProRes codec verified
- [ ] All tracks present
- [ ] Timecode accurate
- [ ] Metadata embedded

### Phase 4: File Delivery Organization

**Recommended folder structure:**
\`\`\`
EXPORTS/
├── PROJECT_NAME/
│   ├── Master/
│   │   ├── PROJECT_NAME_YYYYMMDD_main_v001.mov
│   │   └── PROJECT_NAME_YYYYMMDD_audio_v001.wav
│   ├── Social/
│   │   ├── 9x16/
│   │   │   ├── PROJECT_NAME_YYYYMMDD_instagram.mp4
│   │   │   └── PROJECT_NAME_YYYYMMDD_tiktok.mp4
│   │   └── 16x9/
│   │       ├── PROJECT_NAME_YYYYMMDD_youtube.mp4
│   ├── Review/
│   │   ├── PROJECT_NAME_YYYYMMDD_review.mp4
│   └── Documentation/
│       ├── EXPORT_LOG.txt
│       └── QC_NOTES.txt
\`\`\`

### Phase 5: Archive Preparation

**1. Create Project Backup**
1. **File → Project Password** (for security)
2. **File → Save As** → \`ProjectName_Backup_YYYYMMDD.prproj\`
3. Copy project folder to archive location

**2. Verify Media Offline**
1. Keep original media in project location or copy to archive
2. Ensure all media is online before archiving

**3. Create Delivery Manifest**
Document:
- Export settings used
- File checksums
- Timestamp of export
- Person verifying

## Required Inputs
- Completed sequence with final edits
- Colour grading and audio finishing done
- Captions generated
- Understanding of target platform requirements

## Expected Outputs
- Exported media files in correct format
- Quality control verification complete
- Files organized in delivery structure
- Archive backup created

## Quality Standards
- 99.9% frame accuracy
- Audio peaks within -6 dBFS to -3 dBFS
- Integrated loudness at -14 LUFS
- No visual artifacts or corruption
- Captions properly timed and positioned

## Constraints and Limitations
- Do not skip QC checks
- Verify exports play on target devices
- Keep original project files separate from exports
- Do not overwrite previous deliveries without new naming

## Platform-Specific Requirements

| Platform | Aspect Ratio | Max Duration | Audio | Text |
|----------|--------------|--------------|-------|------|
| Instagram Reels | 9:16 | 90 seconds | -14 LUFS | 30 chars/line |
| TikTok | 9:16 | 3 minutes | -14 LUFS | 35 chars/line |
| YouTube Shorts | 9:16 | 60 seconds | -14 LUFS | 42 chars/line |
| Vimeo | 16:9 | 15 minutes | -14 LUFS | Any size |
| Client Review | Any | None | -14 LUFS | Burn-in preferred |

## Source and Attribution
- Edit Central QA Standards
- Adobe Media Encoder Documentation
- Platform-specific delivery specifications (Instagram, TikTok, YouTube)

## Version History
- v1.0: Initial export workflow
- v1.1: Added -14 LUFS requirement`,
    versions: [
      {
        id: "ver-export-qc-v1",
        version_number: 1,
        timestamp: "2026-11-27",
        note: "Initial Premiere Pro export and QC skill",
        title: "Premiere Pro Export and Quality Control",
        description:
          "Export settings and quality control checklist for Premiere Pro final delivery",
        content_markdown: `## Purpose
Configure render settings and manage export queue for final delivery files with comprehensive quality control checks.

## Instructions
... (truncated for version history)`,
      },
    ],
  },
  // === EXISTING SKILLS ===
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
