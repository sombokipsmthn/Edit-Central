# EDIT CENTRAL — Folder Audit, Skill Audit & Premiere Pro Workflow Recommendations

*Date: 2026-11-27*

---

## PHASE 1 — EXISTING FOLDER STRUCTURE AUDIT

### 1.1 Video Editing Project Folders Found

Based on filesystem inspection, the following video project structures exist:

#### `/Volumes/Belle SSD/2026/CIC/`
```
CIC/
├── Adobe Premiere Pro Auto-Save/
├── Adobe Premiere Pro Audio Previews/
├── Footage/                          # 45+ files, mixed MP4/CR3 formats
├── Motion Graphics Template Media/
├── CIC.prproj
└── CIC.prin
```
**Pattern:** Single "Footage" folder at root, Premiere project file at root, auto-save/previews as hidden Adobe folders.

#### `/Volumes/Belle SSD/2026/Muthoni/`
```
Muthoni/
├── Adobe Premiere Pro Auto-Save/
├── Adobe Premiere Pro Audio Previews/
├── Motion Graphics Template Media/
├── Footage/                          # 8 files, 4.5GB total
├── Muthoni.mp4                       # Large video file at root
├── Muthoni.prproj
└── Muthoni.prin
```
**Pattern:** Similar to CIC, but with video file at root level.

#### `/Volumes/Belle SSD/2024/Kochela/`
```
Kochela/
├── Adobe Premiere Pro Auto-Save/
├── Adobe Premiere Pro Audio Previews/
├── Footage/                          # Multi-level (XML + MP4 files)
├── Motion Graphics Template Media/
├── Output/                           # EXPORTS/DELIVERABLES
│   ├── Brian1.mp4, Brian2.mp4...
│   └── Chemasi.mp4
├── Premiere Composer Files/
│   └── AEGraphics/
├── Kochela.prproj
└── Sequence 01.mp4                   # Large file at root
```
**Pattern:** Clear separation between raw footage (Footage) and final exports (Output).

#### `/Volumes/Extreme SSD/2026/Sauti Sol/`
```
Sauti Sol/
├── Adobe Premiere Pro Auto-Save/
├── Adobe After Effects Auto-Save/
├── AC Footage/
├── ADs/
├── Ads 1080/
├── Animations/
├── Audio/                            # MUSIC + SOUND EFFECTS
│   ├── Sauti Sol - Blue Uniform.mp3
│   ├── Sauti Sol - Insecure.mp3
│   └── voiceover files
├── Flyer/
├── Jipay Ads.ai
├── Links/
├── May/
├── Motion Graphics Template Media/
├── Output/                           # DELIVERABLES
│   └── Various MP4 files
├── Reworked Ads/
├── Social Media/                     # REGENERATIVE EDITS
│   └── Organized by date/name
└── Sol Universe.prproj
```
**Pattern:** Extensive categorization including dedicated Audio and Output folders.

#### `/Volumes/Extreme SSD/2026/JIPAY/`
```
JIPAY/
├── AC Footage/
├── ADs/
├── Ads 1080/
├── Animations/
├── Etica-Unit-Trust-Funds-Fact-Sheet-September-30-2025.pdf
├── Flyer/
├── JIPAY-Creative.pptx
├── JIPAY-DECK.pdf
├── Link Files/
├── May/
├── Output/
├── Reworked Ads/
├── Social Media/
└── UI/
```
**Pattern:** Asset-heavy with dedicated folders for different asset types.

#### `/Volumes/Extreme SSD/Burn Downloads/` (Template-style)
```
technology-conference-promo-2025-07-16-06-33-29-utc/
├── Footage/                          # Project assets
├── Help/
├── Readme.txt
└── Technology Conference Project.aep  # After Effects project

Hook & Captions for Social Media/
└── Project/
    └── Hook & Captions for Social Media 24.x.aep

minimal-simple-logo-reveal-2026-08-11-05-09-58-utc/
└── (Footage)/                        # Parentheses indicate special naming
    └── Project Assets (Don't Touch)/
```

#### `/Volumes/Belle SSD/2024/Taste of KE/Video/`
Simple Video folder, no substructure visible.

---

### 1.2 DaVinci Resolve Project Folders

#### Resolve Application Folders
```
/Users/kipsmthn/Library/Application Support/Blackmagic Design/DaVinci Resolve/
├── .LUT/                              # Custom LUTs
├── ACES Transforms/
├── DolbyVision/
├── easyDCP/
├── Fairlight/                         # Audio editing
├── Fusion/                            # Color/FX
│   ├── Bins/
│   ├── Library/
│   ├── Macros/
│   ├── Scripts/
│   └── Templates/
├── logs/
├── Resolve Project Library/
│   └── Resolve Projects/
│       ├── Settings/
│       ├── SoundLib.db
│       └── Users/guest/Projects/
│           ├── Untitled Project 1/
│           │   └── Project.db
│           └── Nyandia_AI_Masterclass_Promo_Project/
│               ├── Batch Renders/
│               └── Project.db
└── OFXPluginCacheV2.xml
```

**Media Storage:** `/Users/kipsmthn/DaVinci Resolve Media/` - Empty directory

---

### 1.3 Existing Edit Central Repository Structure

```
/Users/kipsmthn/Projects/Edit Central/
├── .claude/
├── .next/
├── AGENTS.md                          # User instructions
├── components.json
├── data/
│   └── edit-central.db                  # SQLite database
├── public/
│   └── images/                          # SKILL THUMBNAILS
│       ├── effect_kinetic_text_1794988909749.jpg
│       ├── effect_pre_hook_1794988910097.jpg
│       ├── effect_whip_pan_1794988911386.jpg
│       ├── effect_graphics_overlay_1794988912894.jpg
│       └── effect_halation_grade_1794988910723.jpg
│       └── effect_split_caption_1794988912894.jpg
├── src/
│   ├── app/
│   │   ├── api/                         # REST API endpoints
│   │   └── layout.tsx
│   ├── components/                      # React UI components
│   └── lib/
│       ├── skills-data.ts               # TypeScript types + skills
│       ├── skills-store.ts
│       ├── db.ts
│       └── github-sync.ts
├── package.json
├── PLATFORM_DIRECTION.md
└── Readme.md
```

---

### 1.4 Folder Naming Conventions Observed

| Pattern | Examples | Usage |
|---------|----------|-------|
| CamelCase with spaces | `Magical Open`, `Footage` | Premiere project folders |
| Lowercase with hyphens | `technology-conference-promo-2025-07-16-06-33-29-utc` | Date-stamped project folders |
| Parentheses special | `(Footage)`, `(Footage)/Project Assets (Don't Touch)` | Special asset folders |
| Mixed case | `Sol Universe.prproj` | Premiere project files |
| CamelCase | `AC Footage`, `Motion Graphics Template Media` | Premiere folder conventions |
| Title case | `Output`, `Audio`, `Social Media` | Category folders |

---

### 1.5 DaVinci Resolve Deliberately Designed Structure

The **Nyandia_AI_Masterclass_Promo_Project** in Resolve's Project Library shows evidence of deliberate design:
- Separate `Batch Renders` folder for automated exports
- Embedded SQLite database (`Project.db`) with structured media organization
- Integration with Resolve's internal media pool system

This appears to be constructed within DaVinci's native workflow rather than manual folder organization.

---

## PHASE 2 — EXISTING FOLDER STRUCTURE vs STANDARD PRACTICE

### 2.1 Comparison with Industry Standards

#### Common Professional Structure:
```
Project_Name/
├── Project_Files/
│   ├── Project.prproj
│   └── Project.prprn
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
│   └── Lower_Thirds/
├── Sequences/
├── Exports/
│   ├── Master/
│   └── Social/
├── Proxies/
└── References/
```

### 2.2 Gap Analysis

| Missing Element | Current Implementation | Recommendation |
|----------------|------------------------|----------------|
| `Project Files` folder | Single file at root | Create dedicated folder |
| Asset sub-categorization | Flat Footage folders | Add Camera_A/B/Audio subdirs |
| `Graphics` folder | Inside Premiere Composer Files | Create at root level |
| `Sequences` folder | Project root | Create for sequence organization |
| `Proxies` folder | Not present | Add for large media projects |
| `References` folder | Not present | Add for b-roll, assets |

---

### 2.3 Recommended Universal Structure

```
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
│   ├── Scratch/          # Rough edits
│   └── Final/            # Finished sequences
├── Exports/
│   ├── Master/
│   ├── Social/
│   │   ├── 9x16/         # Vertical
│   │   ├── 1x1/          # Square
│   │   └── 16x9/         # Horizontal
│   └── Review/
├── Proxies/
├── References/
└── Notes/
```

### 2.4 Premiere Pro Bin Mapping

| Physical Folder | Premiere Bin Hierarchy |
|----------------|------------------------|
| `Project Files/` | Root (project file at root) |
| `Footage/` | Footage bin (camera-specific sub-bins) |
| `Audio/` | Audio bin (Music, SFX, VO sub-bins) |
| `Graphics/` | Graphics bin |
| `Sequences/Scratch` | Sequences bin (or project root for Scratch) |
| `Exports/` | Keep outside Premiere, or create marker folders |

---

## PHASE 3 — EDIT CENTRAL SKILL AUDIT

### 3.1 Existing Skills in Database

| ID | Title | Category | Discipline | Status | Apps Supported |
|----|-------|----------|------------|--------|----------------|
| `skill-kinetic-pop-bounce` | Kinetic Pop-Bounce Title | text | typography-motion | ready | DaVinci Resolve, After Effects, Premiere Pro |
| `skill-pre-hook-pacing` | 0.5s Pre-Hook Cut Sequence | pacing | editorial-pacing | ready | App-Agnostic, Premiere Pro, DaVinci Resolve, FCP |
| `skill-optical-whip-pan` | Optical Whip-Pan Bridge | transitions | transitions-vfx | ready | After Effects, DaVinci Resolve, Premiere Pro |
| `skill-vector-callout-overlay` | Tracked Vector Callout Line | graphics | transitions-vfx | ready | DaVinci Resolve, After Effects |
| `skill-halation-film-grade` | 16mm Halation & Slate Grade | styles | color-finishing | ready | DaVinci Resolve, App-Agnostic |
| `skill-dual-split-caption` | Dual-Layer Split Caption | text | typography-motion | ready | App-Agnostic, Premiere Pro, DaVinci Resolve, After Effects |
| `skill-reference-breakdown` | Creative Reference Breakdown | general | workflow-research | ready | App-Agnostic |
| `skill-jcut-audio-ducking` | Audio-Led J-Cut & Dialogue Ducking | pacing | audio-dialogue | ready | DaVinci Resolve, Premiere Pro, Final Cut Pro |

### 3.2 Skills Related to Requested Areas

| Area | Existing Skill | Status |
|------|---------------|--------|
| Premiere Pro Project Setup | None | **NEEDS NEW** |
| Media Organisation | None | **NEEDS NEW** |
| Talking-Head Editing | None | **NEEDS NEW** |
| Transcription | None | **NEEDS NEW** |
| Captions | `skill-dual-split-caption` | Partial - style format only |
| Audio Finishing | `skill-jcut-audio-ducking` | Partial - needs expansion |
| Colour Correction | `skill-halation-film-grade` | Resolve-specific only |

### 3.3 Missing Skills (Based on User Workflow)

1. **Talking-Head Editing and Dialogue Refinement** - Not present
2. **Premiere Pro Transcription Workflow** - Not present
3. **Audio Ducking Implementation** - Only has Resolve-specific skill
4. **Colour Grading with Adjustment Layers** - Only Resolve-specific
5. **Export and Quality Control** - Not present
6. **Premiere Pro Extension Toolkit** - Not present

---

## PHASE 4 — USER'S PREMIERE PRO WORKFLOW REQUIREMENTS

### 4.1 Documented Workflow (from AGENTS.md)

#### A. Project Setup
1. Create project inside designated project folder
2. Create bin named "Footage"
3. Import footage into Footage
4. Create initial sequence in project root (outside Footage bin)
5. Name sequence "Scratch"
6. Choose appropriate format (vertical/horizontal)
7. Place footage into Scratch

#### B. Scratch Editing
- Review footage
- Make necessary cuts
- Remove dead air
- Remove unusable sections
- Refine dialogue and delivery
- Preserve natural pauses
- Maintain sentence integrity

#### C. Final Sequence
1. Save project
2. Duplicate Scratch
3. Rename to "Final Sequence"
4. Preserve original Scratch
5. Work in Final Sequence for finishing

#### D. Transcription and Captions
- Text panel → Transcript → Transcribe
- Text panel → Captions → Create from transcript
- Caption settings:
  | Setting | Value |
  |---|---|
  | Caption preset | Subtitle Default |
  | Format | Subtitle |
  | Style | None |
  | Max characters | 30 |
  | Min duration | 3.0 seconds |
  | Lines | Single |

#### E. Audio and Music
1. Select background music
2. Add to Final Sequence
3. Use Remix feature when needed
4. Add audio tracks as needed
5. Apply dialogue ducking
6. Listen and refine mix

#### F. Colour
- Create adjustment layer for grading
- Individual shot correction
- Exposure consistency
- White balance
- Skin tones
- Contrast
- Saturation
- Creative grading
- Adjustment layer organization

#### G. Premiere Extensions
1. **Film Impact Dashboard** - Transitions, VFX
2. **Mr Horse Animation Composer** - Titles, Motion graphics, Animations
3. **Spread** - Multicam editing, Multi-track editing, Sync

---

## PHASE 5 — TALKING-HEAD EDITING METHODOLOGY

### 5.1 Editorial Principles for Talking-Head Edits

**Decision-Based Approach for Silence Handling:**

| Silence Type | Action |
|--------------|--------|
| Unnecessary silence (5+ seconds before content) | Remove |
| Natural pauses (between ideas) | Preserve |
| Thinking pauses (0.5-2 seconds before questions) | Keep for authenticity |
| Dramatic pauses (for effect) | Preserve |
| Breathing between sentences | Keep 1-2 frame margin |
| Filler words ("um", "uh") | Remove where obvious |
| Repeated words (backtracking) | Remove |
| False starts | Remove |

### 5.2 Jump Cut Prevention Strategy

1. **Match Shots**: Ensure matching framing and zoom
2. **Use J-cuts**: Lead audio before visual cut
3. **B-roll Inserts**: Cover jump cuts with relevant footage
4. **Frame Matching**: Match eye line across cuts
5. **Rhythm Considerations**: Maintain conversational pace

### 5.3 Sentence Integrity Rules

- Never cut mid-sentence clause
- Complete subjects before objects
- Finish thoughts before moving to next
- Preserve question-answer formats

---

## PHASE 6 — RECOMMENDED SKILL ARCHITECTURE

### 6.1 Proposed New Skills

```
1. Premiere Pro Workflow Controller
   ├── Project setup procedure
   ├── Bin organization
   └── Project file management
   
2. Talking-Head Editing Methodology
   ├── Dialogue refinement
   ├── Silence handling
   ├── Jump cut prevention
   └── Sentence integrity
   
3. Premiere Pro Transcription & Captions
   ├── Text panel workflow
   ├── Caption settings
   └── Review and refinement
   
4. Audio and Music Finishing
   ├── Music selection
   ├── Remix feature usage
   ├── Dialogue ducking setup
   └── Mix refinement
   
5. Colour Correction & Adjustment Layers
   ├── Individual shot correction
   ├── White balance
   ├── Skin tone preservation
   ├── Creative grading
   └── Layer organization
   
6. Premiere Pro Extension Toolkit
   ├── Film Impact Dashboard usage
   ├── Animation Composer workflows
   └── Spread extension functions
   
7. Export and Quality Control
   ├── Render settings
   ├── Platform-specific export
   └── QC checklist
```

### 6.2 Skills to Improve

| Skill | Improvement Needed |
|-------|-------------------|
| `skill-dual-split-caption` | Add Premiere-specific instructions, update settings |
| `skill-jcut-audio-ducking` | Add Premiere-specific ducking steps |

---

## PHASE 7 — COMPLETE MARKDOWN DRAFTS

### Draft Skill 1: Premiere Pro Workflow Controller

```markdown
# Premiere Pro Workflow Controller

## Description
Standardized project setup and bin organization for Premiere Pro video editing workflows. Creates a consistent folder structure and initial sequence setup.

## Purpose
Establish a professional, reusable project structure that separates raw footage, project assets, sequences, and exports. Ensures all editors follow the same organizational conventions.

## When to Use
- Starting a new video project in Premiere Pro
- Setting up a project for collaborative editing
- Creating templates for repeatable workflow structures

## Instructions

### 1. Project Setup
1. Create a new folder for your project
2. Inside the project folder, create these subfolders:
   - `Project Files/` - Store .prproj and .prprn files
   - `Footage/` - Store original video clips
   - `Audio/` - Store music, SFX, voiceovers
   - `Graphics/` - Store titles, lower thirds, MOGRTs
   - `Sequences/` - Organize sequence folders
   - `Exports/` - Output folder for renders

### 2. Create Premiere Project
1. Open Premiere Pro
2. File → New → Project
3. Navigate to `Project Files/` folder
4. Name project: `PROJECT_NAME.prproj`
5. Save

### 3. Create Footage Bin
1. In Project panel, create bin named `Footage`
2. Import all original footage into this bin
3. For multi-camera, create sub-bins:
   - `Camera_A/`
   - `Camera_B/`
   - `Audio/`

### 4. Create Initial Sequence (Scratch)
1. In Project panel (root level, NOT in Footage bin), create new sequence
2. Name: `Scratch`
3. Set format:
   - **Vertical (9:16)**: 1080x1920, 24/30fps
   - **Horizontal (16:9)**: 1920x1080, 24/30fps
4. Add footage to timeline

### 5. Create Final Sequence Bin
1. In Project panel, create bin: `Sequences`
2. Create sub-bins:
   - `Scratch/` (copy of initial sequence)
   - `Final/` (for completed edits)

## Required Inputs
- Access to original video footage
- Premiere Pro installed

## Expected Outputs
- Organized project folder structure
- Premiere project file saved in Project Files
- Footage bin created and populated
- Scratch sequence created

## Quality Standards
- All project files stored in Project Files folder
- No media files in root project folder
- Consistent bin naming across projects

## Constraints and Limitations
- Do not store exports in project folder structure
- Media and project files should be on fast local storage

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Adobe Premiere Pro CC 2020 or later
- Notes: Works with Premiere Pro's native bin and sequence tools

## Source and Attribution
- Edit Central Premiere Pro Workflow Guidelines
```

---

### Draft Skill 2: Talking-Head Editing Methodology

```markdown
# Talking-Head Editing Methodology

## Description
A decision-based approach to editing talking-head footage for engaging, natural-sounding short-form content. Focuses on dialogue refinement while preserving authenticity.

## Purpose
Transform raw talking-head footage into polished, engaging content by removing dead air, filler words, and unnecessary pauses while maintaining natural rhythm and sentence integrity.

## When to Use
- Editing interview or talking-head footage
- Creating social media content from monologues
- Preparing content for captions/transcription
- Refining dialogue for engagement

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
1. Locate "um", "uh", "ah", "er"
2. Remove only the clearest cases
3. Preserve natural speech rhythm
4. Avoid robotic sound in final edit

### Phase 4: False Start Cleanup
1. Identify repeated words or backtracked statements
2. Remove from the start of repeated phrase
3. Maintain sentence flow to next point

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
2. Allow natural pauses for comprehension
3. Match energy level to content type
4. Adjust cut density per platform:
   - 9:16 Shorts: Higher cut frequency
   - 16:9 Social: Moderate pacing
   - Podcast/Iframe: Preserve natural flow

## Required Inputs
- Raw talking-head footage
- Understanding of content message
- Timeline in Premiere Pro

## Expected Outputs
- Refined sequence with natural flow
- Removed dead air and fillers
- Preserved sentence integrity
- Engaging pacing for platform

## Quality Standards
- Viewer cannot identify removed content
- Natural speaking rhythm maintained
- No obvious jump cuts
- Captions will read cleanly

## Constraints and Limitations
- Do not make speech sound robotic
- Preserve speaker's authentic voice
- Don't change meaning of content
- Maintain original emotional delivery

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro, DaVinci Resolve
- Requirements: Timeline trimming and ripple delete
- Notes: Test with captions to verify timing
```

---

## PHASE 8 — DUPLICATE AND CONFLICT ANALYSIS

### 8.1 Potential Conflicts

| Conflict | Details | Resolution |
|----------|---------|------------|
| Caption Settings | User wants max 30 chars, 3.0s min duration | Create Premiere-specific skill with these exact values |
| Sequence Naming | Some skills mention "Timeline" | Align with "Sequence" terminology in Premiere |
| Audio Settings | `skill-jcut-audio-ducking` uses -22 LUFS | User's workflow may differ | Add flexibility to settings |

### 8.2 Duplicate Detection

No exact duplicates found. Skills address different aspects of editing workflow.

---

## PHASE 9 — FILES REQUIRING UPDATES

| File | Changes Needed |
|------|----------------|
| `skills-data.ts` | Add new skill definitions |
| Database | New skills will be stored |
| `public/images/` | Add new skill thumbnails |
| `src/components/skill-detail-view.tsx` | May need updates for new skill format |

---

## PHASE 10 — SOURCES AND REFERENCES

1. **Professional Standards:**
   - Adobe Premiere Pro User Guide
   - "The Technique of Film Editing" by Karel Reisz
   - "In the Blink of an Eye" by Walter Murch

2. **Online Resources:**
   - Premiere Pro documentation at Adobe.com
   - Film Impact tutorials
   - Mr Horse Animation Composer guides

3. **Internal References:**
   - `PLATFORM_DIRECTION.md` - Edit Central philosophy
   - Existing skill codebase

---

## PHASE 11 — OUTSTANDING QUESTIONS

1. **Spread Extension Documentation**: Need to verify actual extension capabilities and interface for accurate documentation.

2. **Caption Preset Availability**: Verify "Subtitle Default" preset exists in user's Premiere installation.

3. **Music Library Access**: Confirm Envato integration status with Premiere.

4. **Film Impact Version**: Determine which transitions/features are available in user's version.

---

## Summary

This audit reveals:

1. **Existing Structure**: Projects use a simple structure with flat Footage folders and project files at root. The Sauti Sol project shows the most sophisticated organization with dedicated Audio, Output, and Social Media folders.

2. **DaVinci Resolve**: The Resolve project database shows internal media pool organization rather than manual folder structure.

3. **Edit Central Skills**: 7 ready skills exist, all DaVinci-centric or cross-platform. No Premiere-specific workflow skills exist.

4. **Gap**: The user's comprehensive Premiere Pro workflow (Phase 4) is not represented in existing skills.

5. **Recommendation**: Create 4-5 new skills covering Premiere workflow controller, talking-head methodology, transcription/captions, audio finishing, and colour grading with adjustment layers.

---

*Report prepared following the user's AGENTS.md and PLATFORM_DIRECTION.md guidelines.*