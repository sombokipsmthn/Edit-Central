---
name: premiere-pro-export-quality-control
description: "Export settings and quality control checklist for Premiere Pro final delivery"
category: workflow-research
discipline: workflow-research
tags: ["export", "quality-control", "delivery", "qc", "premiere-pro"]
collection: ["col-documentary-finishing"]
status: draft
approval_status: pending
publishing_status: not_ready
compatibility:
  providers: ["any"]
  apps: ["Premiere Pro"]
  requirements: "Premiere Pro, Media Encoder recommended, exported files for QC"
  notes: "Verify exports match platform specifications. Audio must be -14 LUFS integrated."
source: "Edit Central QA Standards"
---

# Export and Final Quality Control

**Purpose:** Configure render settings and manage export queue for final delivery files with comprehensive quality control checks.

## When to Use
- After audio finishing and colour grading
- Before delivering client projects
- For social media content distribution
- When archiving completed projects

## Instructions

### Phase 1: Export Settings Configuration

**1. Access Export Settings**
1. Select sequence in Project panel
2. **File → Export → Media** (or Ctrl+M)
3. Or use **Adobe Media Encoder** for batch exports

**2. Recommended Export Presets**

| Platform | Format | Codec | Resolution | Preset |
|----------|--------|-------|------------|--------|
| YouTube | H.264 | MP4 | 1080x1920 | YouTube 1080p HD |
| Instagram | H.264 | MP4 | 1080x1920 | Custom 9:16 |
| TikTok | H.264 | MP4 | 1080x1920 | Custom 9:16 |
| Vimeo | H.264 | MP4 | 1920x1080 | Vimeo 1080p |
| Master Archive | ProRes | MOV | Source | ProRes 422 HQ |

**3. H.264 Custom Settings (Social 9:16)**
- **Format**: H.264
- **Preset**: Match Source - High bitrate
- **Video** tab:
  - Width: 1080, Height: 1920
  - Frame Rate: Match source
  - Field Order: Progressive
  - Level: 4.2
  - Profile: High
  - Bitrate Encoding: VBR, 2 pass
  - Target Bitrate: 15 Mbps
  - Maximum Bitrate: 20 Mbps
- **Audio**:
  - Format: AAC
  - Bitrate: 320 kbps
  - Sample Rate: 48000 Hz

**4. ProRes Master Archive Settings**
- **Format**: QuickTime
- **Codec**: Apple ProRes 422 HQ
- **Resolution**: Match source
- **Frame Rate**: Match source
- **Audio**: 48 kHz, 24-bit or 32-bit float

### Phase 2: Export Queue Management

**1. Adding to Queue**
1. In Export Settings, click **Queue** (not Run)
2. Opens Adobe Media Encoder
3. Add more exports to queue

**2. Queue Organization**
1. Rename queue items descriptively:
   - `PROJECT_social_9x16.mp4`
   - `PROJECT_master_prores.mov`
   - `PROJECT_16x9_instagram.mp4`
2. Set output folder per delivery type:
   - `Exports/Social/9x16/`
   - `Exports/Social/16x9/`
   - `Exports/Master/`

**3. Batch Export Settings**
1. Enable **Use Previews** for faster rendering
2. Set **Background Processing**: On
3. Monitor queue progress in Media Encoder

### Phase 3: Quality Control Checklist

**✅ PRE-EXPORT CHECK**
- [ ] Sequence properly rendered in timeline
- [ ] All effects and transitions applied
- [ ] Audio peaks between -6 dBFS and -3 dBFS
- [ ] Integrated audio at -14 LUFS
- [ ] Captions displayed correctly
- [ ] Colour grading applied and consistent

**✅ EXPORT VERIFICATION**
- [ ] Correct resolution exported
- [ ] Correct frame rate exported
- [ ] Audio present and synced
- [ ] Captions burned in or muxed
- [ ] File size reasonable for content length

**✅ POST-EXPORT CHECK**
- [ ] Play through export on primary monitor
- [ ] Verify no dropped frames
- [ ] Check audio levels in export
- [ ] Verify captions timing
- [ ] Test playback on target device

**✅ PLATFORM-SPECIFIC CHECKS**

**For 9:16 Social Media:**
- [ ] Text inside safe margins (outer 10% safe)
- [ ] Primary content inside center 70% vertical
- [ ] Contrast > 4.5:1 over background
- [ ] First frame has visual/text hook

**For 16:9 Standard:**
- [ ] No horizontal letterboxing issues
- [ ] All important content in safe area
- [ ] Subtitles properly positioned

**For Master Archive:**
- [ ] ProRes codec verified
- [ ] All tracks present
- [ ] Timecode accurate
- [ ] Metadata embedded

### Phase 4: File Delivery Organization

**Recommended folder structure:**
```
EXPORTS/
├── PROJECT_NAME/
│   ├── Master/
│   │   ├── PROJECT_NAME_YYYYMMDD_main_v001.mov
│   │   └── PROJECT_NAME_YYYYMMDD_audio_v001.wav
│   ├── Social/
│   │   ├── 9x16/
│   │   │   ├── PROJECT_NAME_YYYYMMDD_instagram.mp4
│   │   │   └── PROJECT_NAME_YYYYMMDD_tiktok.mp4
│   │   └── 16x9/
│   │       ├── PROJECT_NAME_YYYYMMDD_youtube.mp4
│   ├── Review/
│   │   ├── PROJECT_NAME_YYYYMMDD_review.mp4
│   └── Documentation/
│       ├── EXPORT_LOG.txt
│       └── QC_NOTES.txt
```

### Phase 5: Archive Preparation

**1. Create Project Backup**
1. **File → Project Password** (for security)
2. **File → Save As** → `ProjectName_Backup_YYYYMMDD.prproj`
3. Copy project folder to archive location

**2. Verify Media Offline**
1. Keep original media in project location or copy to archive
2. Ensure all media is online before archiving

**3. Create Delivery Manifest**
Document:
- Export settings used
- File checksums
- Timestamp of export
- Person verifying

## Required Inputs
- Completed sequence with final edits
- Colour grading and audio finishing done
- Captions generated
- Understanding of target platform requirements

## Expected Outputs
- Exported media files in correct format
- Quality control verification complete
- Files organized in delivery structure
- Archive backup created

## Quality Standards
- 99.9% frame accuracy
- Audio peaks within -6 dBFS to -3 dBFS
- Integrated loudness at -14 LUFS
- No visual artifacts or corruption
- Captions properly timed and positioned

## Constraints and Limitations
- Do not skip QC checks
- Verify exports play on target devices
- Keep original project files separate from exports
- Do not overwrite previous deliveries without new naming

## Platform-Specific Requirements

| Platform | Aspect Ratio | Max Duration | Audio | Text |
|----------|--------------|--------------|-------|------|
| Instagram Reels | 9:16 | 90 seconds | -14 LUFS | 30 chars/line |
| TikTok | 9:16 | 3 minutes | -14 LUFS | 35 chars/line |
| YouTube Shorts | 9:16 | 60 seconds | -14 LUFS | 42 chars/line |
| Vimeo | 16:9 | 15 minutes | -14 LUFS | Any size |
| Client Review | Any | None | -14 LUFS | Burn-in preferred |

## Source and Attribution
- Edit Central QA Standards
- Adobe Media Encoder Documentation
- Platform-specific delivery specifications (Instagram, TikTok, YouTube)

## Version History
- v1.0: Initial export workflow
- v1.1: Added -14 LUFS requirement
