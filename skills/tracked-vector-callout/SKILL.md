---
name: tracked-vector-callout
description: "Clean HUD leader line anchored to moving subjects with progressive reveal"
category: graphics
discipline: transitions-vfx
visual_type: graphic-animation
tags:
  - hud
  - callout
  - tracking
  - overlay
providers:
  - claude
  - chatgpt
  - codex
apps:
  - DaVinci Resolve
  - After Effects
  - Premiere Pro
requirements: "2D point or planar tracking, vector stroke animation controls"
source: "Edit Central Base Library — HUD Callout Reference"
---

# Tracked Vector Callout

**Purpose:** Point viewer attention toward a specific technical detail, product feature, or subject without obscuring the content.

## Instructions

### 1. Vector Callout Design

**Base Style:**
- Stroke width: 1.5px to 2px
- Color: `#38BDF8` (cyan blue) or high-contrast accent
- End cap: Rounded for clean termination

**Two-Segment Structure:**
1. **Tracked Segment:** Follows the subject anchor point
2. **Static Segment:** Extends to clear negative space

### 2. Object Tracking

1. **Track the anchor point:**
   - Use point tracker for fast movement
   - Use planar tracker for complex surface movement
   - Verify tracking accuracy at start/middle/end

2. **Position and Scale:**
   - Maintain consistent stroke width
   - Allow slight position adjustment if tracking drifts

### 3. Tracking Refinement

**Tracking Quality Check:**
- [ ] Anchor point stays within 2px of target
- [ ] No jitter or drift in static segment
- [ ] Smooth motion at 24fps/30fps

### 4. Label Integration

1. **Text Placement:**
   - Place label at end of static segment
   - Keep 10-15px clearance from callout tip
   - Use clean sans-serif, medium weight

2. **Reveal Animation:**
   - Stroke trim: 0% → 100% over 10 frames (ease-out)
   - Label fade: 6-12 frames after stroke complete

### 5. Application-Specific Implementation

#### DaVinci Resolve Fusion

1. Create PlanarTracker or PointTracker node
2. Add PolyLine node for vector path
3. Use Tracker output to drive PolyLine position
4. Add Transform for scale/position refinement
5. Apply BezierSpline for smooth animation curves:
   ```
   Frame 0-10: Trim 0% to 100%
   Frame 6-12: Opacity 0% to 100%
   ```

#### After Effects

1. Apply tracking data to null object
2. Create stroke via Stroke effect or mask
3. Use Trim Paths animation:
   - Start: 0%
   - End: 100% (keyframes at 0 and 10)
4. Animate label opacity separately

#### Premiere Pro

1. Use Motion effect for position tracking
2. Apply stroke via Essential Graphics
3. Use position keyframes for path
4. Add opacity keyframes for reveal

## Quality Control

- [ ] Stroke stays locked within 2px of anchor
- [ ] Label text is legible at final resolution
- [ ] Reveal timing matches content pace
- [ ] No visual interference with subject

## Constraints

- Keep labels concise (2-4 words max)
- Avoid busy box borders around text
- Ensure contrast over varying backgrounds

## Expected Output

A tracked vector callout with:
- Locked tracking to subject anchor
- Smooth stroke reveal animation (10 frames)
- Legible label with fade-in (6-12 frames)