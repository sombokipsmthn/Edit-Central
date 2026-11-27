---
name: premiere-pro-project-workflow
description: "Standardized project setup and bin organization for Premiere Pro video editing workflows"
category: workflow-research
discipline: workflow-research
visual_type: general
tags:
  - premiere-pro
  - project-setup
  - organization
  - bins
  - workflow
providers:
  - any
apps:
  - Adobe Premiere Pro
requirements: "Adobe Premiere Pro CC 2020 or later, file system access"
source: "Edit Central Premiere Pro Workflow Guidelines"
---

# Premiere Pro Project Workflow

**Purpose:** Establish a professional, reusable project structure that separates raw footage, project assets, sequences, and exports. Ensures all editors follow the same organizational conventions.

## When to Use

- Starting a new video project in Premiere Pro
- Setting up a project for collaborative editing
- Creating templates for repeatable workflow structures
- Onboarding new editors to team standards

## Instructions

### 1. Project Folder Structure

Create this folder hierarchy in your project directory:

```
PROJECT_NAME/
├── Project_Files/
│   ├── PROJECT.prproj
│   └── PROJECT.prin
├── Footage/
│   ├── Camera_A/
│   ├── Camera_B/
│   └── Audio/
├── Audio/
│   ├── Music/
│   ├── Sound_Effects/
│   └── Voiceover/
├── Graphics/
│   ├── Titles/
│   ├── Lower_Thirds/
│   ├── MOGRTs/
│   └── Assets/
├── Sequences/
│   ├── Scratch/
│   └── Final/
├── Exports/
│   ├── Master/
│   ├── Social/
│   │   ├── 9x16/
│   │   ├── 1x1/
│   │   └── 16x9/
│   └── Review/
└── References/
```

### 2. Create Premiere Project

1. Open Adobe Premiere Pro
2. Go to **File → New → Project**
3. Navigate to your `Project_Files/` folder
4. Save as `PROJECT_NAME.prproj`

### 3. Create Footage Bin

1. In the Project panel, right-click → **New Bin**
2. Name: `Footage`
3. Import footage into this bin
4. For multi-camera projects, create sub-bins:
   - `Camera_A/`
   - `Camera_B/`
   - `Audio/`

### 4. Create Initial Sequence (Scratch)

1. In the Project panel root (outside Footage bin), right-click → **New Item → Sequence**
2. Name: `Scratch`
3. Choose format based on target:
   - **Vertical (9:16)**: 1080×1920, 24/30fps
   - **Horizontal (16:9)**: 1920×1080, 24/30fps
4. Add footage to timeline

### 5. Create Final Sequence Bin

1. In Project panel, create bin: `Sequences`
2. Create sub-bins:
   - `Scratch/` (copy of initial sequence)
   - `Final/` (for completed edits)

### 6. Scratch → Final Workflow

This is the standard refinement pattern:

1. **Create** and edit the initial sequence in Scratch
2. **Complete** the rough edit
3. **Save** the Premiere Pro project
4. **Duplicate** the Scratch sequence (Sequence → Duplicate)
5. **Move** or organise the duplicate into Final
6. **Rename** the duplicate `Final Sequence`
7. **Preserve** the original Scratch sequence unchanged
8. **Perform** subsequent refinement on Final Sequence

**Note:** Sequence duplication (step 4) is different from duplicating the entire project. Only duplicate the timeline, not the project file.

### 7. Bin Organization During Edit

As editing progresses:

1. Keep B-roll in separate bins (organized by type)
2. Move used graphics to "Used" sub-bins
3. Create "Markers" bin for reference points
4. Keep exports separate from project files

## Required Inputs

- Access to original video footage
- Adobe Premiere Pro CC 2020 or later installed
- Write access to project location

## Expected Outputs

- Organized project folder structure
- Premiere project file saved in Project_Files
- Footage bin created and populated
- Scratch sequence created
- Final sequence ready for refinement

## Quality Standards

- All project files stored in Project_Files folder
- No media files in root project folder
- Consistent bin naming across projects
- Original footage never modified or moved
- Scratch and Final sequences properly separated

## Constraints and Limitations

- Do not store exports in project folder structure
- Media and project files should be on fast local storage
- Keep source footage separate from generated proxies
- Do not overwrite original media files
- Do not perform final export (see export skill)

## Compatibility

- Provider-Agnostic
- Apps: Adobe Premiere Pro
- Requirements: Adobe Premiere Pro CC 2020 or later with file system access
- Notes: Works with Premiere Pro's native bin and sequence tools. For DaVinci Resolve, use the Resolve editing workflow skill instead.

## Source and Attribution

- Edit Central Premiere Pro Workflow Guidelines
- Adobe Premiere Pro User Guide