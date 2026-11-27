---
name: dual-layer-split-caption
description: "Documentary caption format with active/muted dual-line display"
category: text
discipline: typography-motion
visual_type: text-transition
tags:
  - captions
  - documentary
  - accessibility
  - split-caption
providers:
  - chatgpt
  - claude
  - gemini
  - codex
apps:
  - App-Agnostic
  - Premiere Pro
  - DaVinci Resolve
  - After Effects
requirements: "Two synced text layers, vertical wipe transition"
source: "Edit Central Base Library"
---

# Dual-Layer Split Caption

**Purpose:** Keep spoken captions scannable in documentary and talking-head edits without noisy bouncing word pills.

## Instructions

### 1. Caption Layout Structure

**Active Line (Top):**
- Position: 68% vertical screen height
- Opacity: 100%
- Style: Medium-weight sans-serif
- Color: White with optional accent for verbs

**Preview Line (Bottom):**
- Position: 12% below active line
- Opacity: 48%
- Style: Same font, lighter weight
- Content: Next spoken phrase

### 2. Caption Chunking

1. **Word Division:**
   - Split captions at natural phrase breaks
   - Aim for 2-4 words per chunk
   - Preserve sentence integrity

2. **Timing:**
   - Active phrase holds until next chunk
   - Preview phrase appears 1-2 words before activation

### 3. Reveal Transition

**6-Frame Vertical Wipe:**
- Frame 1-2: Preview line fades in (48% opacity)
- Frame 3: Active line transition begins
- Frame 4-6: Active line fully visible (100% opacity)

### 4. Application-Specific Implementation

#### Premiere Pro

1. Create two text layers:
   - Layer 1: Active caption (100% opacity)
   - Layer 2: Preview caption (48% opacity)

2. Apply vertical wipe via Essential Graphics:
   - Use "Reveal" effect
   - Set 6-frame duration
   - Position wipe top to bottom

3. Keyframe opacity:
   - Active: Fade in over 2 frames
   - Preview: Always visible at 48%

#### DaVinci Resolve Fusion

1. Create two Text+ nodes
2. Apply opacity:
   - Top node: 100% constant
   - Bottom node: 48% constant
3. Add Transform node for wipe:
   - Scale Y animation over 6 frames
   - Anchor to caption timing

#### After Effects

1. Use two text layers with position keyframes
2. Apply "Linear Wipe" effect:
   - Direction: Vertical
   - Duration: 6 frames
   - Soft edge: 1 frame

3. Opacity animation for smooth transitions

## Quality Checks

- [ ] Active line at 100% opacity
- [ ] Preview line at 48% opacity
- [ ] Vertical wipe completes in 6 frames
- [ ] Caption chunks are 2-4 words
- [ ] Content inside center 70% vertical

## Constraints

- Avoid overlapping lower platform UI on mobile
- Do not use on fast-paced dialogue without pre-testing
- Keep caption timing in sync with audio beats

## Cross-Reference

- See `premiere-pro-transcription-captions` for initial caption generation
- For Premiere Pro workflow, use the transcription workflow first, then apply this visual style

## Expected Output

Dual-layer lower-third caption with:
- Active line at 100% opacity
- Preview line at 48% opacity
- 6-frame vertical wipe transition
- Clean, scannable typography