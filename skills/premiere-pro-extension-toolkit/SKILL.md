---
name: premiere-pro-extension-toolkit
description: "Guide to using Film Impact, Animation Composer, and Spread extensions in Premiere Pro"
category: workflow-research
discipline: workflow-research
visual_type: general
tags:
  - extensions
  - plugins
  - transitions
  - titles
  - multicam
  - premiere-pro
providers:
  - any
apps:
  - Adobe Premiere Pro
requirements: "Premiere Pro with Film Impact, Animation Composer, and Spread extensions installed"
source: "Extension Documentation and User Guides"
---

# Premiere Pro Extension Toolkit

**Purpose:** Document each installed Premiere Pro extension separately with recommended usage and platform-specific operating procedures. Never invent extension functionality - inspect actual documentation or interface.

## Installed Extensions

### 1. Film Impact Dashboard

**Purpose:** Provides transitions, visual effects, and motion graphics for Premiere Pro.

**When to Use:**
- Adding transitions between clips
- Applying visual effects to clips or adjustment layers
- Creating motion graphics elements

**Usage:**
1. Open **Window → Extensions → Film Impact Dashboard**
2. Browse transition categories:
   - **Transitions**: Standard cuts, dissolves, wipes
   - **Motion**: Slide, zoom, spin effects
   - **Stylized**: Glitch, light leaks, film damage
3. Drag transition to timeline between clips
4. Adjust duration in Effect Controls
5. For visual effects:
   - Apply to clip
   - Adjust parameters in Effect Controls

**Recommended Transitions for Talking-Head Edits:**
- **Cross Dissolve**: Gentle scene changes
- **Push**: For section transitions
- **Slide Left/Right**: For B-roll overlays
- **Light Fade**: For endings

**Film Impact Workflow Tips:**
1. Apply transition first, then adjust
2. Use shorter durations (8-12 frames) for social content
3. Match transition speed to content energy
4. Save favorite settings as favorites in dashboard

### 2. Mr Horse Animation Composer

**Purpose:** Titles, motion graphics, animations, transitions, and presets for Premiere Pro.

**When to Use:**
- Creating titles and lower thirds
- Adding animated text overlays
- Applying animation presets
- Creating custom motion graphics

**Usage:**
1. Open **Window → Extensions → Animation Composer**
2. Choose template from:
   - **Titles**: Animated titles, lower thirds
   - **Transitions**: Text-based wipes, reveals
   - **Countdowns**: Timer animations
   - **Shapes**: Animated geometric elements
3. Customize:
   - Text content
   - Animation speed
   - Color and style
   - Position on screen
4. Export template for reuse

**Recommended Titles for Talking-Head Edits:**
- **Lower Thirds**: For speaker identification
- **Title Reveal**: For opening hooks
- **Text Pop**: For emphasis words
- **Quote Cards**: For key statements

**Animation Composer Workflow Tips:**
1. Create master template, then duplicate for variations
2. Use consistent timing (8-15 frames for social)
3. Match font choices to platform
4. Save templates to Motion Graphics Template Media folder

### 3. Spread Extension

**Purpose:** Custom extension for multicam editing, multiple-track editing, video-track synchronization, audio/video synchronization.

**Documentation Reference:** https://rhysobasi.store/products/spread

**When to Use:**
- Working with multicamera footage
- Editing multiple video tracks simultaneously
- Synchronizing separate audio and video recordings
- Creating complex multi-layer edits

**Spread Capabilities (per documentation):**
- **Multicam Editing**: Merge multiple camera angles into single timeline
- **Multiple-Track Editing**: Perform edits across multiple video tracks simultaneously
- **Video-Track Synchronization**: Align clips on different tracks by time
- **Audio/Video Synchronization**: Sync separate audio tracks with video recordings

**Usage:**
1. Open **Window → Extensions → Spread**
2. For **Multicam Editing**:
   - Select all camera angles in Project panel
   - Use Spread's multicam creation tool
   - Set synchronization method (timecode, audio waveform, or markers)
   - Create multicam source sequence

3. For **Track Synchronization**:
   - Select clips across different tracks
   - Use Spread's sync tools to align in time
   - Verify sync points for accuracy

4. For **Multiple-Track Editing**:
   - Select multiple clips across tracks
   - Apply cuts, trims, or effects simultaneously
   - Useful for complex motion graphics timing

**Spread Workflow Tips:**
1. Verify extension is properly installed before use
2. Backup project before major Spread operations
3. Test synchronization accuracy before committing
4. Document multicam settings for reproducibility

**Note:** Spread is a custom extension. Always refer to the official documentation at https://rhysobasi.store/products/spread for complete feature details and version-specific capabilities.

## Extension Integration with Native Premiere Features

| Feature | Native Premiere | Film Impact | Animation Composer | Spread |
|---------|-----------------|-------------|-------------------|--------|
| Standard transitions | Yes | Enhanced | Yes | N/A |
| Custom titles | Yes | N/A | Enhanced | N/A |
| Multicam editing | Yes | N/A | N/A | Enhanced |
| Motion graphics | Basic | Yes | Enhanced | N/A |
| Track management | Yes | N/A | N/A | Enhanced |

## Installation Verification

**Before using extensions:**
1. Open **Window → Extensions**
2. Verify all three extensions appear in menu
3. Launch each extension and check for interface
4. Refer to extension-specific documentation for:
   - Supported file formats
   - System requirements
   - Troubleshooting

## Troubleshooting

**Extension won't open:**
- Restart Premiere Pro
- Verify extension is installed in Correct Extensions folder
- Check Premiere Pro version compatibility
- Reinstall extension from source

**Feature not working:**
- Verify project settings match extension requirements
- Check media is offline/online as needed
- Try creating new sequence with different settings

**Performance issues:**
- Close other panels while using heavy extensions
- Render previews before applying effects
- Work with optimized media

## Envato Integration (Optional)

**For Music & Audio Assets:**
- Envato Elements provides royalty-free music, SFX, and audio assets
- Access via web browser or download to local project Audio/ folder
- No native Premiere Pro MCP exists - user downloads assets manually
- Recommended workflow:
  1. Browse Envato Elements library
  2. Download assets to `Audio/Music/` or `Audio/Sound_Effects/`
  3. Import into Premiere Pro
  4. Apply via standard import workflow

**Note:** Envato does not provide a native Premiere Pro extension. Assets must be downloaded and imported manually.

## Required Inputs

- Premiere Pro 2020 or later
- Film Impact Dashboard extension installed
- Mr Horse Animation Composer extension installed
- Spread extension installed (see documentation)
- Project media imported

## Expected Outputs

- Access to enhanced transitions, titles, and multicam tools
- Faster editing workflow with templates and presets
- Consistent visual style across projects

## Quality Standards

- Extension features work as documented
- No project corruption from extension use
- Templates and presets are reusable
- Exported assets maintain quality

## Constraints and Limitations

- Do not invent Spread functionality or controls
- Extension features may vary by version
- Some features require specific hardware acceleration
- Always test new extension versions before production work

## Compatibility

- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Film Impact Dashboard, Mr Horse Animation Composer, Spread extension installed
- Notes: Extension documentation should be consulted for exact feature lists and version compatibility

## Source and Attribution

- Film Impact Official Documentation
- Mr Horse Animation Composer User Guide
- Spread Extension Documentation: https://rhysobasi.store/products/spread
- Adobe Premiere Pro Extension Best Practices