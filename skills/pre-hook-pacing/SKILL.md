---
name: pre-hook-pacing
description: "Opening structure and hook timing optimization for short-form retention"
category: pacing
discipline: editorial-pacing
visual_type: pacing
tags:
  - hook
  - retention
  - pacing
  - short-form
  - vertical-video
providers:
  - chatgpt
  - claude
  - gemini
  - codex
apps:
  - App-Agnostic
  - Premiere Pro
  - DaVinci Resolve
requirements: "Timeline editing capabilities for visual and audio sequencing"
source: "Edit Central Short-Form Retention Standards"
---

# Pre-Hook Pacing

**Purpose:** Optimize the opening structure of short-form content to establish immediate visual momentum and lead into the main narrative hook.

## Instructions

### 1. Opening Structure Principles

The first 3 seconds (12 frames at 24fps, 9 frames at 30fps) is critical for retention:

1. **Visual Interrupt (0-6 frames):**
   - Start with a high-contrast, clear subject
   - Avoid cutting on motion blur or dark frames
   - Establish a clear focal point

2. **Rhythmic Build (6-12 frames):**
   - Create a visual pattern that creates anticipation
   - Use 3-4 frame micro-cuts for energy
   - Each frame should show clear subject/silhouette

3. **Audio Lead-In:**
   - Use J-cut: lead vocal audio 3-4 frames before video entry
   - Layer a subtle riser SFX that peaks on frame 12
   - Keep audio levels consistent

### 2. Hook Timing

**The spoken hook should begin at frame 13 (0.5s at 24fps) or later.**

Before the hook:
- Remove unnecessary setup frames
- Let the first frame immediately establish the "what"
- Use visual context, not exposition

### 3. Removing Unnecessary Setup

1. **Avoid these in opening 12 frames:**
   - Fade-ins from black
   - Long establishing shots
   - Camera operator footage
   - Technical titles (move to end)

2. **Better alternatives:**
   - Start mid-sentence with context clear
   - Use B-roll payoff in first 3 frames
   - Show the result before explaining

### 4. Curiosity and Anticipation

Create forward momentum:

| Frames | Technique |
|--------|-----------|
| 1-4    | Strong visual payoff |
| 5-8    | Building pattern (varied angles) |
| 9-12   | Anticipation peak |

### 5. Transition to Main Narrative

After the pre-hook:
1. Continue the established rhythm
2. Introduce the speaker's identity if needed
3. Make the main point clear within 3-5 seconds

## Quality Checks

- [ ] No black frames or fade-ins
- [ ] First frame has clear subject/hook
- [ ] Micro-cut pattern shows 3 distinct silhouettes
- [ ] Audio J-cut leads by 3-4 frames
- [ ] Spoken hook begins at 0.5s or later
- [ ] Energy escalates to main content

## Constraints

- Do not exceed 12 frames (0.5s) for pre-hook on 24fps
- At 30fps, use 15 frames (0.5s) but test pacing
- Hook must be preserved - do not weaken the opening message
- Keep text inside center 70% vertical safe zone

## Expected Output

A 12-frame (24fps) or 15-frame (30fps) pre-hook sequence with:
- Visual micro-cuts (3-4 frames each)
- J-cut audio lead
- Riser audio peak on final frame
- Clear lead-in to main hook

## Cross-Reference

- See `kinetic-pop-bounce-title` for title hook integration
- See `professional-talking-head-editing` for overall pacing integration