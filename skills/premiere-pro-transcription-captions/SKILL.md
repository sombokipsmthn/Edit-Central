---
name: premiere-pro-transcription-captions
description: "Step-by-step workflow for transcribing sequences and generating captions in Premiere Pro's Text panel"
category: workflow-research
discipline: workflow-research
tags: ["transcription", "captions", "subtitles", "accessibility", "premiere-pro"]
collection: ["col-documentary-finishing"]
status: draft
approval_status: pending
publishing_status: not_ready
compatibility:
  providers: ["any"]
  apps: ["Premiere Pro"]
  requirements: "Premiere Pro 2022 or later with Text panel, stable internet for transcription"
  notes: "Uses Adobe's built-in transcription service. Caption settings can be customized for testing alternatives."
source: "Adobe Premiere Pro Documentation"
---

# Premiere Pro Transcription & Captions Workflow

**Purpose:** Create accurate, readable captions from edited sequences using Premiere Pro's built-in Text panel and transcription tools.

## When to Use
- After completing rough cut in Scratch sequence
- Before final export for accessibility
- When creating social media captions
- For client review with closed captioning

## Instructions

### Prerequisites
1. Complete rough cut in Scratch sequence
2. Save project
3. Work in Final Sequence for captions (never in Scratch)
4. Ensure sequence audio is properly mixed

### Phase 1: Transcription Setup
1. Select your final sequence in the Project panel
2. Open the **Text** panel (Window → Text)
3. Click the **Transcript** tab
4. Click **Transcribe Sequence** button
5. Set transcription options:
   - **Auto Transcribe**: On by default
   - **Enhanced Speech**: Enable for best accuracy
   - **Speaker Labels**: Enable for multi-speaker content
   - **Content Type**: Choose Interview, Conversation, or Other

### Phase 2: Transcription Process
1. Wait for transcription to complete (varies by sequence length)
2. Review transcript in Text panel
3. Correct any obvious errors before captioning
4. Use timestamps to verify accuracy

### Phase 3: Create Captions
1. In Text panel, click **Captions** tab
2. Click **Create Captions** button
3. Select **From Transcript** option
4. Choose caption format: **Subtitle**

### Phase 4: Default Caption Settings
Apply these baseline settings before reviewing:

| Setting | Value |
|---|---|
| Caption preset | Subtitle Default |
| Format | Subtitle |
| Style | None |
| Maximum characters | 30 |
| Minimum duration | 3.0 seconds |
| Lines | Single |

**Note:** These settings provide a starting point. Test alternative minimum durations with actual content to optimize readability.

### Phase 5: Caption Styling (Optional)
After initial creation, adjust for platform needs:
1. **Position**: Usually bottom, leave 10% margin from bottom
2. **Font**: Sans-serif, 24-28pt for 1080p
3. **Background**: Semi-transparent box (30% opacity)
4. **Color**: White with black outline for contrast

### Phase 6: Review and Refine
1. Play through sequence with captions visible
2. Check timing:
   - Captions should appear 0.5s before audio starts (for reading time)
   - Minimum 1.5s duration for single words
   - Maximum 42 characters per line
3. Verify accuracy:
   - Match spoken words to text
   - Check punctuation and capitalization
   - Verify speaker labels if used

### Phase 7: Sync Verification
1. Use **Synchronize and Offset** tool if captions drift
2. Add manual corrections for:
   - Misheard words
   - Music/interruptions
   - Speaker changes

## Required Inputs
- Completed Final Sequence
- Audio properly mixed and cleared
- Understanding of target platform requirements

## Expected Outputs
- Transcribed transcript in Text panel
- Caption file created from transcript
- Verified, synchronized captions

## Quality Standards
- 99%+ accuracy in transcribed text
- Captions readable without strain
- Proper timing (not too fast/slow)
- No caption overflow issues
- Compliance with platform specifications

## Constraints and Limitations
- Do not transcribe until rough cut is complete
- Never work on Scratch sequence for captions
- Do not apply captions to raw footage
- Internet required for Adobe transcription service
- Cannot transcribe offline media

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Premiere Pro 2022 or later with Text panel
- Notes: For other platforms, export SRT and import. For DaVinci Resolve, use the Resolve transcription workflow.

## Testing Alternative Settings
**Recommended test approach:**
1. Create test sequence (15-30 seconds)
2. Apply default settings (3.0s min duration)
3. Export with 2.0s min duration
4. Compare readability and pacing
5. Obtain user approval before applying to full project

## Source and Attribution
- Adobe Premiere Pro Documentation: Transcribe and Caption
- Edit Central Caption Style Guidelines