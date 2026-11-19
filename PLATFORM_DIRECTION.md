# Edit Central — Platform Direction

## 1. Product definition

Edit Central is a lightweight library and workspace for creating, organising, maintaining, and reusing AI skills for creative work.

It is **not** an AI execution engine, an editing application, or a platform that tries to perform every task itself. Its job is to help people keep their instructions, resources, and working context organised, then make those materials easy to hand off to the AI tools and creative applications they already use.

A skill is a reusable set of instructions that guides an AI assistant through a task. The skill may be used with ChatGPT, Claude, Codex, Gemini, or another compatible assistant. That assistant may in turn work with DaVinci Resolve, Adobe Premiere Pro, or other creative software through its own tools, integrations, or computer-use capabilities.

## 2. Product principles

1. **Library first.** The central product is a well-organised collection of reusable skills and supporting resources.
2. **Provider agnostic.** Skills should work across AI providers wherever possible. Avoid making the core skill format dependent on one model or vendor.
3. **Tool agnostic by default.** Describe the task, desired outcome, constraints, and checks without assuming one specific editing application. Add application-specific instructions only when they are genuinely useful.
4. **User-controlled execution.** Edit Central prepares and organises the materials. The user's chosen AI assistant and creative applications perform the actual work.
5. **Portable by design.** Skills should be readable, editable, copyable, and exportable as Markdown. Users should retain value even when no integrations are connected.
6. **Simple over comprehensive.** Prefer a small number of clear, dependable features over a large workflow platform.
7. **Keep context with the skill.** Related references, files, links, notes, and compatibility details should be easy to find alongside a skill.

## 3. Who and what it is for

Edit Central is for people who repeatedly use AI to support creative and production work and want a reliable place to store and refine the instructions they use.

Examples include:
- Video editors maintaining repeatable editing instructions.
- Creators organising research, references, and production guidance.
- Teams sharing consistent task instructions.
- Individuals building a personal library of prompts and structured AI skills.

The platform should not assume that every user has the same AI provider, editing application, or workflow.

## 4. Core product areas

### 4.1 Skill Library

The Skill Library is the main collection of reusable skills.

It should support:
- Browsing and searching skills.
- Categories, tags, and basic organisation.
- A clear title and short description for each skill.
- Skill detail pages with the complete instruction content.
- Basic status or compatibility information where useful.

The library should remain easy to understand. Avoid elaborate taxonomies or workflow graphs unless real usage demonstrates a need.

### 4.2 Skill Editor

The Skill Editor is where users create and maintain skill instructions.

It should support:
- Creating, editing, and duplicating a skill.
- A simple Markdown-friendly editing experience.
- Clear sections for purpose, inputs or context, instructions, constraints, and expected output when appropriate.
- Saving and previewing the skill.
- Copying or downloading the skill as a portable Markdown file.

Do not force every skill into an unnecessarily rigid template. Provide a useful starting structure while allowing the author to adapt it to the task.

### 4.3 Resource Library

Resources are supporting materials associated with skills or kept for reuse.

Examples include:
- Reference links and websites.
- Documents and written notes.
- User-provided files.
- Checklists, examples, and supporting guidance.

Resources should be organised and linked to relevant skills. Edit Central should not attempt to build its own general-purpose web research, transcription, media-understanding, or document-analysis engine. When analysis is required, the connected or selected AI provider should perform it using its own capabilities.

### 4.4 Provider configuration and hand-off

Users may work with different AI assistants. Edit Central should make it clear which provider or destination a skill is intended for, while keeping the skill itself portable wherever possible.

The product may provide lightweight provider configuration or hand-off options when supported, such as:
- Selecting or recording a preferred AI provider.
- Copying the skill and its relevant context for use in that provider.
- Opening a provider destination when a reliable supported route exists.
- Providing concise provider-specific notes when a skill needs them.

Do not build a proprietary AI layer simply to make provider selection appear seamless. Provider integrations should be optional and should not be required for the basic library to work.

### 4.5 Compatibility information

A skill may include optional compatibility notes describing:
- AI providers it has been tested with.
- Creative applications it is designed to guide an assistant through.
- Required tools, integrations, or capabilities.
- Known limitations or provider-specific variations.

Compatibility is descriptive information, not a promise that Edit Central itself can operate the named application.

### 4.6 Version history

Skills should have a straightforward way to track meaningful changes over time. Users should be able to understand what changed and, where practical, restore or reuse an earlier version.

Keep version history focused on skill content. Avoid introducing a complex branching or release-management system unless there is a demonstrated need.

## 5. Typical user journey

1. A user creates a skill or starts from an existing one.
2. They write or refine the instructions in the Skill Editor.
3. They attach or associate useful resources, links, and notes.
4. They add optional provider and application compatibility notes.
5. They save the skill in the Skill Library.
6. When they need it, they open the skill, review the relevant context, and copy, export, or hand it off to their chosen AI assistant.
7. The AI assistant performs the task using its own capabilities and any available creative-application integrations.
8. The user can return to Edit Central to refine the skill and preserve improvements for next time.

## 6. Scope boundaries

### In scope

- A reusable Skill Library.
- A practical Skill Editor.
- A Resource Library for references and supporting materials.
- Skill-to-resource relationships.
- Lightweight provider preferences and hand-off support.
- Optional AI-provider and creative-application compatibility notes.
- Basic version history.
- Markdown copy and export.
- Clear organisation, search, and discovery.

### Out of scope for the core product

- Building or hosting proprietary AI models.
- Building a general-purpose AI execution or agent orchestration engine.
- Building a video, audio, or image editing engine.
- Recreating DaVinci Resolve, Premiere Pro, or other creative applications.
- Building in-house transcription, media analysis, or document intelligence systems when external AI providers can perform those tasks.
- A universal connector framework for every provider and application.
- Complex visual workflow builders, node graphs, or automation pipelines.
- Making external integrations mandatory for core functionality.

These boundaries are intentional. Edit Central should benefit from improvements in external AI assistants and creative tools without needing to recreate their capabilities.

## 7. Design and experience direction

The experience should feel like a focused, dependable work library rather than a complicated automation dashboard.

Priorities:
- Clear information hierarchy.
- Fast access to saved skills and resources.
- A comfortable reading and editing experience for longer instructions.
- Visible relationships between a skill and its supporting resources.
- Simple actions for copy, export, duplicate, and edit.
- Minimal setup before a user can get value.
- Consistent, restrained interface patterns.

Avoid unnecessary panels, settings, status indicators, and configuration steps. Each interface element should help users create, find, understand, maintain, or reuse a skill.

## 8. Portability and content format

Markdown should be the baseline portable format for skill content.

A user should be able to:
- Read a skill without needing a special renderer.
- Copy the complete instructions into an AI assistant.
- Download the skill as a `.md` file.
- Keep a local copy outside Edit Central.
- Move or adapt the skill for another provider.

If Edit Central stores additional structured metadata, that metadata should support the library experience without making the core instructions difficult to export or reuse.

## 9. Integration philosophy

Integrations should extend the product, not define it.

- Prefer existing provider capabilities and supported integrations.
- Keep integration-specific behaviour separate from the portable skill instructions.
- Make connection requirements and limitations clear.
- Do not claim that a skill can control an application unless the selected AI provider actually has the required tool or access.
- If an integration is unavailable, the user should still be able to copy or export the skill and use it manually.

## 10. Product decision filter

Before adding a feature, ask:

1. Does it help users create, organise, understand, maintain, or reuse skills and their resources?
2. Does it preserve provider and tool flexibility?
3. Can the feature be delivered without rebuilding capabilities that already exist in external AI providers or creative applications?
4. Does it keep the product straightforward for someone who only wants to save and reuse Markdown instructions?
5. Will it remain useful when integrations are disconnected?

If a proposed feature does not support these principles, it likely does not belong in the core product.

## 11. Product north star

**Edit Central is the organised home for reusable AI skills and the resources that make them useful.**

It helps people build a dependable library of instructions, keep supporting context close at hand, and carry that knowledge into whichever AI assistant and creative tools they choose to use.
