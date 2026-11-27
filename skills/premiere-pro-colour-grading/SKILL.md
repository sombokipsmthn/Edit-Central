---
name: premiere-pro-colour-grading
description: "Colour correction and adjustment layer grading workflow for Premiere Pro"
category: workflow-research
discipline: workflow-research
tags: ["colour", "grading", "adjustment-layers", "correction", "premiere-pro"]
collection: ["col-documentary-finishing"]
status: draft
approval_status: pending
publishing_status: not_ready
compatibility:
  providers: ["any"]
  apps: ["Premiere Pro"]
  requirements: "Premiere Pro, Lumetri Color panel, adjustment layer support"
  notes: "Individual clips may need correction before shared grade. Adjustment layers preserve ability to refine individual shots."
source: "Edit Central Colour Finishing Guidelines"
---

# Colour Correction and Adjustment-Layer Grading

**Purpose:** Develop a professional colour workflow that considers individual shot correction, exposure consistency, white balance, skin tones, contrast, and creative grading using Premiere Pro's adjustment layers.

## When to Use
- After audio finishing is complete
- Before captions (colour affects readability)
- For any visual content requiring colour consistency
- When applying creative colour grades

## Instructions

### Phase 1: Individual Shot Correction

**1. Exposure Consistency**
1. Select clip in timeline
2. Open **Lumetri Color** panel
3. Check **Basic Correction**:
   - **Exposure**: Adjust so highlights clip at 100 IRE
   - **Contrast**: Start at default, adjust per shot
   - **Highlights**: Pull back to -50 to -100 if needed
   - **Shadows**: Lift to avoid crushing black

**2. White Balance**
1. Use **White Balance** tool in Lumetri
2. Sample neutral grey or use **Auto White Balance**
3. Fine-tune:
   - **Temperature**: 3200K-9500K range
   - **Tint**: -100 to +100 range
4. Check skin tones - should not shift toward magenta or green

**3. Skin Tone Preservation**
1. Use **Vectorscope**:
   - Skin tones should sit at 330°-350° angle
   - Saturation should be 50-80%
2. Use **HSL Secondary**:
   - Isolate skin tones with **HSL Picker**
   - Reduce saturation slightly if oversaturated
   - Do not shift hue significantly

### Phase 2: Create Adjustment Layer

**1. Add Adjustment Layer**
1. Select a clip that will be affected by grade
2. ** Sequence → New Adjustment Layer**
   - Match sequence settings
   - Size: Full
   - Duration: Cover entire sequence

**2. Organise Adjustment Layers**
Create layers in this order (top to bottom):
1. **Creative Grade** (top) - Color lookup, film emulation
2. **Contrast Boost** - S-curve, contrast enhancement
3. **Base Correction** (bottom) - Exposure, WB fixes

### Phase 3: Base Correction on Adjustment Layer

1. Apply **Lumetri Color** to adjustment layer
2. Make corrections that apply globally:
   - Overall exposure adjustment
   - Common white balance
   - Global contrast curve

### Phase 4: Creative Grade

**Option A: Film Emulation**
1. **Creative → Look**: Apply Kodak 2383 or similar
2. **Intensity**: 25-50% for subtle, 75-100% for strong
3. **Saturation**: Adjust to taste (-20 to +20)

**Option B: Tint/Stylised**
1. **Creative → Tint**: For stylized looks
2. **Color Wheels**:
   - Midtones: Warm (orange) for skin tones
   - Shadows: Cool (blue) for contrast
   - Highlights: Warm for cinematic feel

**Option C: Color Lookup**
1. Import LUT file (.cube)
2. Apply via **Effects → Color → Lumetri LUT**
3. Adjust **Amount** parameter (0-100%)

### Phase 5: Individual Clip Correction

**When individual clips need correction before shared grade:**
1. Select clip in timeline
2. Open **Lumetri Color**
3. Make clip-specific adjustments:
   - Fix extreme exposure issues
   - Correct severe color casts
   - Balance with surrounding clips
4. These corrections will override adjustment layer for that clip

### Phase 6: Fine-Tuning

**1. Check Consistency**
1. Play through timeline rapidly
2. Identify colour jumps or flicker
3. Make subtle adjustments to problematic clips

**2. Use Scopes**
1. Enable **Vectorscope** and **Parade**
2. Check for:
   - Skin tone drift
   - Exposure inconsistencies
   - Colour banding

**3. Match Shots**
1. Pick reference clip
2. Use **Color Match** in Lumetri:
   - Generate 33x LUT from reference
   - Apply to other clips
3. Fine-tune by eye

### Phase 7: Advanced Techniques

**1. Secondary Corrections**
1. **HSL Secondary**:
   - Isolate colors (sky, grass, etc.)
   - Adjust saturation, luminance, hue
2. **Power Windows**:
   - Draw shape around subject
   - Apply graded only inside shape

**2. Grain Addition**
1. **Effects → Noise → Add Grain**
2. Settings:
   - Amount: 5-15%
   - Size: 1.0
   - Roughness: 0-25
3. Blend: Overlay or Soft Light at 25-50% opacity

## Required Inputs
- Edited sequence in Premiere Pro
- Understanding of target aesthetic
- Reference images (optional)

## Expected Outputs
- Consistent exposure across all clips
- Balanced white balance
- Preserved skin tones
- Creative grade applied via adjustment layers
- Individual clips corrected where needed

## Quality Standards
- Smooth, consistent colour throughout
- Skin tones look natural, not oversaturated
- No exposure jumps between clips
- Creative grade enhances, not distracts
- Adjustment layers properly organised

## Constraints and Limitations
- Do not crush blacks or clip highlights
- Preserve detail in skin tones
- Adjustment layers are non-destructive
- Individual clip corrections override adjustment layers

## Compatibility
- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Lumetri Color panel, adjustment layer support
- Notes: For DaVinci Resolve, use the 16mm Halation Grade skill as reference but adapt to Resolve's colour page.

## Adjustment Layer Order (Recommended)
```
Top:    Creative Grade
          - Color LUT / Look
          - Tint effects
          
Middle: Contrast Enhancement
          - S-curve
          - Contrast boost
          
Bottom: Base Correction
          - Exposure
          - White balance
          - General fixes
```

## Source and Attribution
- Edit Central Colour Finishing Guidelines
- Adobe Lumetri Color Documentation
- Reference: `skill-halation-film-grade` for 16mm film emulation techniques
