---
name: kinetic-pop-bounce-title
description: "High-retention kinetic headline with pop and bounce movement for short-form social video"
category: text
discipline: typography-motion
visual_type: text-animation
tags:
  - kinetic-typography
  - title-animation
  - pop-bounce
  - short-form
  - retention
providers:
  - chatgpt
  - claude
  - gemini
  - codex
apps:
  - DaVinci Resolve
  - After Effects
  - Premiere Pro
requirements: "Keyframeable transform controls, per-word text styling capability"
source: "Edit Central Base Library — Kinetic Typography Reference"
---

# Kinetic Pop-Bounce Title

**Purpose:** Create a punchy, readable kinetic title reveal that draws eye focus to key spoken verbs without cluttering a 9:16 frame.

## Instructions

### 1. Typography Setup

1. Set primary typography in a bold geometric sans-serif at roughly 8% of frame height
2. Style base fill in crisp off-white (`#F5F5F5`) with a subtle soft drop shadow (45% opacity)
3. Accentuate the primary action verb in cyan (`#38BDF8`)

### 2. Pop Animation Principles

The pop-bounce effect uses restrained scale animation with smooth easing:

| Frame | Scale | Easing |
|-------|-------|--------|
| 0     | 0.88  | -      |
| 2-4   | 1.08  | Ease Out |
| 5-7   | 1.00  | Ease In |

**Key timing:**
- Overall duration: 7 frames (~0.25s at 24fps, ~0.3s at 30fps)
- Use smooth bezier curves (not linear)
- Avoid excessive overshoot beyond 115%

### 3. Position Animation

For vertical kinetic titles:
- Start position slightly below final location
- Animate upward with the scale bounce
- End with clean, readable alignment

### 4. Application-Specific Implementation

#### DaVinci Resolve Fusion

1. Create a Text+ node for the title
2. Apply Shading Elements:
   - Element 1: Primary fill (`#F5F5F5`)
   - Element 3: Drop shadow (45% opacity)
3. Use a downstream Transform node for scale animation:
4. Animate Scale X/Y via BezierSpline keyframes:
   ```
   Frame 0: 0.88
   Frame 4: 1.08 (ease out)
   Frame 7: 1.00 (ease in)
   ```
5. Use Character Level Styling for per-word color accents

#### After Effects

1. Create text layer with bold sans-serif
2. Apply scale animation with keyframes:
   - Keyframe 1 (frame 0): Scale 88%
   - Keyframe 2 (frame 4): Scale 108%
   - Keyframe 3 (frame 7): Scale 100%
3. Set spatial interpolation to smooth bezier
4. Use separate layers for verb accent color

#### Premiere Pro

1. Use Essential Graphics panel for text
2. Apply scale transform via Effect Controls
3. Keyframe at 0%, 108%, 100%
4. Use smooth ease interpolation

## Quality Checks

- [ ] Text contrast >= 4.5:1 over background
- [ ] Pop timing feels snappy, not rushed
- [ ] Bounce settles cleanly by frame 7
- [ ] Action verb accent color is visible
- [ ] No text clipping outside frame bounds

## Constraints

- Keep text inside center 70% vertical safe zone
- Do not add secondary bounce - single peak overshoot is sufficient
- Avoid applying pop timing to multi-line explanatory paragraphs

## Expected Output

A reusable title preset (Fusion macro, After Effects template, or Premiere Pro MOGRT) with pop-bounce animation ready to duplicate for emphasis beats.