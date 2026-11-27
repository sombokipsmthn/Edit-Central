---
name: creative-reference-breakdown
description: "Tool-agnostic skill to turn raw scripts into repeatable editing briefs"
category: workflow-research
discipline: workflow-research
visual_type: general
tags:
  - research
  - briefing
  - provider-agnostic
providers:
  - any
apps:
  - App-Agnostic
requirements: "AI assistant capable of reading links, transcripts, or notes"
source: "Edit Central Platform Direction"
---

# Creative Reference Breakdown

**Purpose:** Extract repeatable pacing, typography, framing, and audio structure from a user-provided creative reference into clean production guidance.

## When to Use

- Analyzing an external video tutorial, rough cut, or reference script
- Turning creative references into actionable production briefs
- Documenting learned techniques for reuse
- Creating training materials from exemplar content

## Instructions

### 1. Input Preparation

**Required inputs:**
- Reference link, transcript, or observation notes
- Target output format (9:16 short, 16:9 essay, product demo)

### 2. Analysis Process

1. **Identify the opening hook mechanism** in the first 3 seconds
   - Visual interrupt, question, or audio lead
   - Frame composition and subject placement

2. **Summarize cut cadence:**
   - Average shot length (ASL)
   - Where rhythmic breaks happen
   - Shot size variety (wide, medium, close-up)

3. **Document text hierarchy:**
   - Placement (top, center, bottom)
   - Contrast treatment (color, background)
   - Animation characteristics (fade, slide, pop)

4. **List transition motifs:**
   - Types used (cut, dissolve, whip-pan)
   - Timing and duration
   - Application frequency

5. **Document audio layering cues:**
   - SFX risers and drops
   - Ducking patterns
   - Room tone and ambience
   - Music bed characteristics

### 3. Output Format

Generate a structured Markdown brief:

```markdown
# Reference: [Title]

## Opening Hook
- Visual: [description]
- Audio: [description]
- Duration: [frames/seconds]

## Cut Cadence
- ASL: [average shot length]
- Pattern: [description]
- Shot variety: [wide/medium/close ratio]

## Typography Style
- Position: [placement]
- Color: [color values]
- Animation: [type and timing]

## Transitions
- Primary: [type and frequency]
- Secondary: [type and duration]

## Audio Layering
- Music: [bed characteristics]
- FX: [key sound effects]
- Ducking: [pattern and level]
```

## Constraints

- Do not invent timestamps or technical values not supported by the supplied input
- Only cite information that can be verified from the reference
- Keep recommendations actionable and portable across editors

## When NOT to Use

- When no reference material is provided
- For completely original creative work (use brainstorming skill instead)
- When the reference is unavailable for verification

## Expected Output

A structured Markdown production brief ready to save back into Edit Central as a new skill or supporting resource.

## Cross-Reference

- See `pre-hook-pacing` for opening structure analysis
- See `kinetic-pop-bounce-title` for typography analysis
- See `professional-talking-head-editing` for overall workflow integration

## Source and Attribution

This skill is stored in Edit Central for agentic use. When executing, paste the target URL, transcript, or rough cut notes below the skill when handing off to ChatGPT, Claude, or Gemini.