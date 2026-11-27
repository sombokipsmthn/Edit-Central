---
name: optical-whip-pan-bridge
description: "8-frame directional blur transition for seamless scene changes"
category: transitions
discipline: transitions-vfx
visual_type: graphic-animation
tags:
  - whip-pan
  - transition
  - motion-blur
  - bridge
providers:
  - chatgpt
  - claude
  - gemini
appers:
  - After Effects
  - DaVinci Resolve
  - Premiere Pro
requirements: "Adjustment layer or track, directional blur effect, edge mirroring capability"
source: "Motion Reference Archive — Directional Optical Motion Blur"
---

# Optical Whip-Pan Bridge

**Purpose:** Connect two spatially unrelated shots with a natural lateral camera motion blur that masks the cut without jarring jump frames.

## Instructions

### 1. Whip-Pan Principles

The whip-pan bridge uses 8 frames total:
- 4 frames before the cut (outgoing shot)
- 4 frames after the cut (incoming shot)

**Key characteristics:**
- Directional blur peaks at the cut frame (frame 4)
- Blur resolves to 0px by frame 8
- Motion direction must match between shots

### 2. Motion Direction

Determine the pan direction:
- Left-to-right: Outgoing shots pan right, incoming enter from left
- Right-to-left: Outgoing shots pan left, incoming enter from right

The motion should feel natural to the edit, not forced.

### 3. Blur and Movement Continuity

1. **Mirror edge pixels before blur:**
   - Prevents black frame gaps
   - Creates continuous motion field

2. **Directional Blur Parameters:**
   - Frame 1: 0px blur
   - Frame 4 (cut): 145px blur (peak)
   - Frame 8: 0px blur

3. **Lens curvature (optional):**
   - 0° FOV at frames 1-3
   - Peak 35° FOV at frame 4
   - Return to 0° at frames 5-8

### 4. Application-Specific Implementation

#### DaVinci Resolve Fusion

1. Create an 8-frame adjustment layer over the cut
2. Add Motion Tile node (mirror edges)
3. Apply directional blur with keyframes:
   ```
   Frame 1: 0px
   Frame 4: 145px
   Frame 8: 0px
   ```
4. Add lens distortion if desired:
   ```
   Frame 1-3: 0
   Frame 4: 35 (FOV scale)
   Frame 5-8: 0
   ```

#### After Effects

1. Create 8-frame adjustment layer
2. Enable "Repeat Edge Pixels" on layer
3. Apply Directional Blur effect:
   - Keyframe Blur Length: 0 → 145 → 0
   - Direction: Match pan direction
4. Optional: Add Lens Distortion effect

#### Premiere Pro

1. Create 8-frame adjustment layer
2. Apply Directional Blur effect (Effects → Blur & Sharpen)
3. Keyframe blur intensity:
   - Frame 1: 0
   - Frame 4: Maximum (adjust to taste)
   - Frame 8: 0
4. Use "Replicate" effect or crop/warp for edge handling

### 5. Matching Shots

The outgoing and incoming shots should share:
- Similar brightness/contrast levels
- Complementary motion direction
- Consistent color temperature

## Quality Checks

- [ ] No black frames or gaps during blur
- [ ] Blur direction matches pan motion
- [ ] Peak blur occurs at frame 4 (cut point)
- [ ] Blur resolves cleanly by frame 8
- [ ] Color match between shots

## Constraints

- Do not use if shots have no motion relationship
- Avoid overly long blur durations (>10 frames)
- Test with actual footage - theoretical values may need adjustment

## Expected Output

A reusable 8-frame transition preset positioned centered over the edit cut.