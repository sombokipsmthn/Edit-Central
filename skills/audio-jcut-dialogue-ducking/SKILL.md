---
name: audio-jcut-dialogue-ducking
description: "J-cut implementation and dialogue ducking for seamless audio transitions"
category: pacing
discipline: audio-dialogue
visual_type: audio-skill
tags:
  - audio
  - j-cut
  - ducking
  - dialogue
  - davinci-resolve
providers:
  - claude
  - chatgpt
  - gemini
apps:
  - DaVinci Resolve
  - Premiere Pro
  - Final Cut Pro
requirements: "Multi-track audio timeline + Fairlight compressor/keyframing or equivalent"
source: "Edit Central Base Library — Fairlight & Vertical QA"
---

# Audio-Led J-Cut & Dialogue Ducking

**Purpose:** Eliminate jarring dead-air gaps between cuts and keep spoken narration cleanly separated from background music.

## When to Use

- Talking-head interviews, documentary B-roll transitions
- Vertical explainers and social content
- Any dialogue-heavy edit requiring smooth audio transitions
- When preparing captions (audio affects timing)

## Instructions

### 1. J-Cut Implementation

**For DaVinci Resolve (Edit/Fairlight Pages):**

1. Select the incoming dialogue clip
2. Unlink audio from video (Ctrl+U or right-click → Unlink)
3. Slip the audio clip left by 3-4 frames (use Alt+left arrow or drag)
4. The audio now begins before the video shows the speaker
5. Verify sync at natural speech points

**For Premiere Pro:**

1. Select incoming audio clip on A1 track
2. Use Rate Stretch Tool (R) or Ripple Trim (Alt+[) to pull audio earlier
3. Lead audio by 3-4 frames
4. Use J-cuts strategically, not on every cut

### 2. Dialogue Ducking Setup

**Method A: Fairlight Sidechain (DaVinci Resolve)**

1. Route dialogue to A1 track, music to A2 track
2. On A2 (music) track, open the Fairlight mixer
3. Click the compressor button
4. Set sidechain key input: A1 (dialogue)
5. Configure ducking parameters:
   - Threshold: -28 dB
   - Ratio: 3:1
   - Attack: 15ms
   - Release: 220ms
   - Makeup gain: Adjust as needed

**Method B: Essential Sound (Premiere Pro)**

1. Select dialogue clip(s)
2. Window → Essential Sound
3. Apply Dialogue preset
4. Enable Reduce Noise (12-25%)
5. Enable Reduce Reverb (10-20%)
6. For ducking, select music track and apply volume keyframes

### 3. Ducking Implementation

**Sidechain Ducking Parameters:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Threshold | -28 dB | Level that triggers ducking |
| Ratio | 3:1 | Amount of reduction |
| Attack | 15ms | How fast music ducks |
| Release | 220ms | How fast music recovers |
| Reduction | 4-8 dB | Typical ducking amount |

**Fine-tuning:**
- Pre-delay: 10-30 ms (let speech start before music dips)
- Recovery: 500-1000 ms for longer phrases
- Always listen and adjust to taste

### 4. Audio Transitions

**Crossfades on Edits:**
1. Apply 3-frame Constant Power crossfade at every audio edit point
2. Use for smooth transitions between phrases
3. Audio crossfades should match video edit timing

### 5. Gap Filling with Room Tone

1. Identify silent gaps > 0.5 seconds
2. Generate or import -24 dB room tone
3. Fill gaps to maintain audio continuity
4. Use very low volume to avoid audible noise

## Quality Standards

- Dialogue peaks normalized between -6 dBFS and -3 dBFS
- Integrated mix at -14 LUFS (social standard)
- 3-frame (0.1s) crossfades on all audio edits
- Ducking is natural, not mechanical
- No audio clipping or distortion

## Constraints and Limitations

- Do not lead audio over an active vocal syllable on the outgoing clip
- J-cuts should enhance, not disrupt natural speech flow
- Test audio on multiple playback systems
- Music should duck under dialogue, not the reverse
- Preserve natural room tone and ambience

## Cross-Reference

- See `premiere-pro-audio-finishing` for complete audio workflow
- See `professional-talking-head-editing` for integration with overall edit
- The -14 LUFS integrated target applies to the final mix

## Source and Attribution

Edit Central Base Library — Fairlight & Vertical QA

## Version History

- v1.0: Initial J-cut and Fairlight ducking workflow
- v1.1: Added Premiere Pro integration notes