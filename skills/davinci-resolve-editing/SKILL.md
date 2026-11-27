---
name: davinci-resolve-editing
description: "Complete DaVinci Resolve editing workflow across Media, Cut, Edit, Fusion, Colour, Fairlight, and Deliver pages"
category: workflow-research
discipline: workflow-research
visual_type: general
tags:
  - davinci-resolve
  - editing
  - workflow
  - colour-grading
  - audio
providers:
  - any
apps:
  - DaVinci Resolve
requirements: "DaVinci Resolve Studio or Free with project media organized"
source: "DaVinci Resolve Documentation and Edit Central Workflow Standards"
---

# DaVinci Resolve Editing Workflow

**Purpose:** Complete editing workflow for DaVinci Resolve projects from media organization through delivery preparation. This skill is application-specific to Resolve's unique page-based architecture.

## When to Use

- Starting a new Resolve project from scratch
- Organizing existing media in Resolve's Media Pool
- Completing a full edit cycle in Resolve
- Preparing projects for colour grading and audio finishing
- Setting up export for delivery

## Instructions

### 1. Project Setup

**Before opening Resolve:**

1. **Project Folder Structure:**
   ```
   PROJECT_NAME/
   ├── Project_Files/
   │   └── PROJECT.drp
   ├── Footage/
   │   ├── Camera_A/
   │   └── Camera_B/
   ├── Audio/
   │   ├── Music/
   │   └── SFX/
   ├── Graphics/
   │   └── Titles/
   ├── Sequences/
   │   └── Final/
   ├── Exports/
   └── References/
   ```

2. **Create New Project:**
   - File → New Project
   - Name: PROJECT_NAME
   - Save in Project_Files/

### 2. Media Organization

**Media Page:**

1. **Import Media:**
   - File → Import Media or drag to Media Pool
   - Organize into bins matching folder structure
   - Create bins: Camera_A, Camera_B, Audio, Graphics

2. **Media Storage:**
   - Right-click clip → Clip Properties
   - Verify correct frame rate and color space
   - Check "Used in Timeline" for media management

### 3. Media Page Workflow

1. **Review Footage:**
   - Use playback rate scrubbing (J/K/L keys)
   - Rate clips (1-5 stars) for selection
   - Add markers for key moments

2. **Create Subclips:**
   - Right-click clip → New Subclip
   - Name with descriptive prefix (e.g., "A_INTERVIEW_001")

### 4. Cut Page Workflow

**For fast assembly (recommended for initial edits):**

1. **Source Patching:**
   - Use Source Track to preview clips
   - Mark In/Out with I/O or mouse

2. **Rough Assembly:**
   - Use Source → Timeline insert (F9)
   - Use Overwrite insert (F10)
   - Use Ripple Overlay (Shift+F10) for quick fills

3. **Trimming:**
   - Use Trim tool (T) for J-cuts/L-cuts
   - Use Slip (Y) and Slide (U) for fine-tuning

### 5. Edit Page Workflow

**For detailed editing:**

1. **Timeline Setup:**
   - Switch to Edit page
   - Video tracks: V1-V3 for primary/secondary
   - Audio tracks: A1-A4 for dialogue/music/SFX

2. **Primary Edit Operations:**
   - Razor tool (B) for cuts
   - Blade tool for precise trimming
   - Slipping clip edges with Alt+Shift+drag

3. **Multicamera Editing:**
   - Right-click multicam clip → Open in Timeline
   - Use number keys (1-9) for angle switching
   - Use auto cut function for synced angles

4. **Transitions:**
   - Effects Library → Transitions
   - Default Video Transitions or Custom
   - 8-frame whip-pan bridge (see `optical-whip-pan-bridge` skill)

### 6. Fusion Page

**For motion graphics and compositing:**

1. **Create Fusion Composition:**
   - Right-click clip → Open in Fusion Page
   - Or create Fusion clip from Effects Library

2. **Common Fusion Nodes:**
   - Text+ for titles and captions
   - Transform for positioning/scale
   - BezierSpline for animations
   - PlanarTracker for callout tracking

3. **Kinetic Pop-Bounce Template:**
   - Use Transform node with BezierSpline:
     ```
     Frame 0: 0.88 scale
     Frame 4: 1.08 scale (ease out)
     Frame 7: 1.00 scale (ease in)
     ```

### 7. Colour Page

**For primary and creative grading:**

1. **Node Structure:**
   - Node 1: Correction (exposure, WB)
   - Node 2: Secondary (skin tones, key colors)
   - Node 3: Creative (look, LUT)
   - Node 4: Output (saturation, grain)

2. **Reference: Halation Grade**
   - See `16mm-halation-slate-grade` for film stock emulation
   - Threshold: 0.72, Spread: 18%
   - Grain: 250D texture at 0.24 opacity

3. **Tracking Notes:**
   - Use Tracker tab for motion graphics
   - Apply to title graphics for animated callouts

### 8. Fairlight Page

**For audio finishing:**

1. **Dialogue Processing:**
   - Use Fairlight FX → EQ to highpass at 80-120Hz
   - Add Compressor: Ratio 2:1, Threshold -20dB
   - Noise Reduction for hum/buzz removal

2. **Music Ducking:**
   - Use Dynamics → Sidechain Compressor
   - Key input: Dialogue track
   - Ducking parameters:
     - Threshold: -28dB
     - Ratio: 3:1
     - Attack: 15ms
     - Release: 220ms

3. **Loudness Normalization:**
   - Audio → Normalize
   - Integrated: -14 LUFS (social standard)
   - True Peak: -1 dBTP

### 9. Deliver Page

**For export preparation ONLY (no actual export per restrictions):**

1. **Render Settings Check:**
   - Deliver → Custom tab
   - Format: Format (H.264, ProRes)
   - Codec: Codec settings
   - Resolution: Match timeline

2. **Recommended Presets:**

   | Platform | Format | Codec | Resolution |
   |----------|--------|-------|------------|
   | Social   | H.264  | MP4   | 1080x1920  |
   | Master   | ProRes | MOV   | Source     |

3. **Quality Control Checklist:**
   - [ ] Timeline frame rate matches sequence settings
   - [ ] Audio levels within -6 to -3 dBFS peaks
   - [ ] Integrated loudness at -14 LUFS
   - [ ] Captions properly positioned
   - [ ] Colour grading applied and consistent

## Quality Standards

- [ ] No offline media in timeline
- [ ] All clips play back smoothly
- [ ] Audio sync maintained across cuts
- [ ] Colour consistent across shots
- [ ] Project saved regularly

## Constraints

**ABSOLUTE EXPORT PROHIBITION:**
The editing agent must NEVER export or render the final video.

The agent may:
- Prepare the final sequence
- Check sequence settings
- Review export settings
- Identify recommended export presets
- Perform quality-control checks
- Save the DaVinci Resolve project (.drp file)
- Report that the project is ready for final export

The agent must NEVER:
- Start a final export
- Start a final render
- Execute an export command through an MCP integration
- Trigger an export through UI automation
- Render the final deliverable on the user's behalf

Final export and rendering are exclusively the user's responsibility.

## Cross-Reference

- See `professional-talking-head-editing` for overall editing workflow guidance
- See `premiere-pro-workflow-controller` for folder structure conventions
- See `audio-jcut-dialogue-ducking` for audio ducking principles

## Source and Attribution

- DaVinci Resolve Manual and Documentation
- Edit Central Workflow Standards
- Adobe Premiere Pro workflow principles adapted for Resolve's architecture