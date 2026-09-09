# Portfolio versions

Five distinct dark portfolio routes share verified project data in `app/versions/data.ts`.

- Kinetic: interactive canvas field, orbital composition, large project chapters, pause control.
- Professional: restrained two-column hiring brief, consistent engineering decisions and source evidence.
- Arcade: optional three-mission project quiz; all project links accessible without playing; progress only records mission completion.
- Editorial: serif-led engineering journal with numbered stories and spacious editorial hierarchy.
- Workbench: keyboard-accessible project tabs with detail, architecture, and evidence panes.

The current root portfolio remains available. `/versions` provides a comparison gallery and each variation links to every other direction.

Shared constraints: dark from first paint, responsive layout, visible keyboard focus, reduced-motion support, no invented employment, testimonials, metrics, or contact information. Project limitations travel with their evidence. No browser visual or interaction testing is claimed.

## Verification record

- TypeScript validation passed for all versions.
- All seven local routes returned HTTP 200 (original, gallery, and five versions).
- Arcade logic checks covered incorrect answers, all three mission completions, duplicate credit, invalid inputs, and fresh progress.
- Read-only code review led to keyboard-focus handling on mission advance, correct vertical tab behavior, and cancellation of Kinetic viewport reveals when paused.
- Production build is the release gate. No browser visual or interaction QA has been performed.
