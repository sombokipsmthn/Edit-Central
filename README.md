# Edit Central: Project Specification & Style Guide

**Project Name:** Edit Central
**Goal:** A lightweight, local web application that serves as a visual reference library for video editing effects (text, transitions, graphics, styles). It ingests short-form video URLs, extracts editing techniques using AI, and presents them as 9x16 visual cards with copy-paste execution instructions for an AI video editor.

---

## 1. Tech Stack (Strictly Enforced)
*Do not introduce React, Vue, Next.js, Node.js backends, or heavy build tools (Webpack/Vite). Keep the footprint minimal.*

*   **Frontend:** Vanilla HTML5, Vanilla JavaScript, and Tailwind CSS (via CDN).
*   **Backend:** Python with FastAPI (lightweight, runs locally).
*   **Database:** SQLite (using Python's built-in `sqlite3` or standard JSON files).
*   **Video Ingestion:** `yt-dlp` (via Python sub-process) + local Whisper (or LLM API) for transcript extraction.
*   **AI Processing:** Anthropic/Google API for structuring raw transcripts into distinct "editing skills."

---

## 2. UI / UX Design Language
*The application should feel like a modern, dark-mode creator tool.*

*   **Theme:** Dark mode default. Backgrounds should be deep charcoal (`bg-gray-900`) with off-white text (`text-gray-100`).
*   **Card Aspect Ratio:** All visual reference cards must strictly be vertical 9:16 (`aspect-[9/16]`) to mirror TikTok/Reels/Shorts formats.
*   **Card UI Anatomy:**
    *   *Background:* Placeholder image or animated GIF demonstrating the effect.
    *   *Overlay:* Dark gradient from the bottom up to make text readable.
    *   *Header:* Title of the effect (e.g., "The Kinetic Pop-Bounce").
    *   *Tags:* Small pill-shaped badges for category (e.g., `Text Effect`, `Transition`, `Overlay`).
    *   *Actions:* A prominent "Copy Instruction" button that copies the AI prompt payload to the clipboard.
*   **Dashboard Layout:**
    *   *Top Nav:* Logo, basic stats (e.g., Total Skills, Total Text Effects).
    *   *Ingestion Bar:* A simple input field accepting a YouTube/Shorts URL with an "Analyze & Add" button.
    *   *Main Content:* A responsive CSS Grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`) displaying the 9x16 cards.

---

## 3. Data Schema Standards
When the Python backend parses a video, it must categorize the extracted knowledge into this standard JSON schema:

```json
{
  "id": "uuid-string",
  "title": "Keyword Highlight Pop",
  "category": "text_effect", 
  "tags": ["retention", "high-energy"],
  "source_url": "[https://youtube.com/shorts/](https://youtube.com/shorts/)...",
  "thumbnail_url": "/static/placeholders/text_pop.gif",
  "ai_instruction": "Generate a DaVinci Resolve Text+ node. Base text #F5F5F5. Highlight active verbs in #FFB800. Scale highlight from 100% to 110% over 4 frames.",
  "date_added": "YYYY-MM-DD"
}