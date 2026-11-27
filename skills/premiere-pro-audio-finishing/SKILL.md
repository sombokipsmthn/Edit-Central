---
name: premiere-pro-audio-finishing
description: "Audio finishing workflow for dialogue ducking, music mixing, and final audio polish in Premiere Pro"
category: workflow-research
discipline: audio-dialogue
tags: ["audio", "ducking", "mixing", "music", "dialogue", "premiere-pro"]
collection: ["col-shortform-retention"]
status: draft
approval_status: pending
publishing_status: not_ready
compatibility:
  providers: ["any"]
  apps: ["Premiere Pro"]
  requirements: "Premiere Pro, Adobe Audition preferred, Envato music library or project audio"
  notes: "Workflow requires listening and evaluation after each step. Do not apply settings blindly without hearing results."
source: "Edit Central Audio Finishing Standards"
---

# Premiere Pro Audio and Music Finishing

**Purpose:** Complete the audio mix for edited sequences by adding music, applying dialogue ducking, and refining problematic sections.

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
- -14 LUFS integrated loudness standard for social platforms