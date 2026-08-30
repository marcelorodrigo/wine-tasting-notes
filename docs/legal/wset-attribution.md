# WSET Attribution and Source Provenance

This document records the canonical WSET credit, trademark and non-affiliation notice, placement requirements, and source provenance for WSET Level 3 SAT terminology used in the Wine Tasting Notes Experience.

**Last reviewed:** 2026-08-30

---

## Canonical Attribution

The following paragraphs are the project-owner-supplied canonical attribution block. They must be reproduced verbatim in all required locations:

> This project's tasting structure and terminology are informed by the WSET Level 3 Systematic Approach to Tasting.

> We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Wine & Spirit Education Trust. "WSET" and "Systematic Approach to Tasting" are trademarks of the Wine & Spirit Education Trust.

The first paragraph is the framework credit. The second paragraph is the trademark and non-affiliation notice.

### Placement Requirements

| Location | Required |
|----------|----------|
| `docs/legal/wset-attribution.md` | Yes — this document |
| Application shared footer (`AppFooter.vue`) | Yes — through the default layout |
| Terms and attribution page (`/terms`) | Yes — full context with provenance |
| Academy content | No — official terminology is identified separately |
| Generated tasting notes | No — prose generation does not reproduce the full notice |

Future changes to either paragraph require project-owner review and an update to this canonical document.

---

## Source Provenance

| Field | Value |
|-------|-------|
| Source organization | Wine & Spirit Education Trust |
| Referenced framework | WSET Level 3 Systematic Approach to Tasting |
| Edition or version | Not documented |
| Publication date | Not documented |
| Access date | Not documented |
| Source reference | Not documented |
| Material referenced | Appearance, Nose, Palate, and Conclusions terminology and structure |
| Project-authored content | Original explanatory prose is not official WSET material |

> [!IMPORTANT]
> The exact source edition is required before canonical SAT data transcription begins (WT-013, WT-014). Unknown fields must be resolved before merging official terminology.

---

## Content Boundaries

- Official WSET source terms must remain intact where source fidelity requires.
- Project-authored explanatory prose must be distinguished from official source terms.
- This document does not grant authorization to use, endorse, or affiliate with WSET material.
- Attribution and source-provenance records exist independently of any permission claim.

---

## Review and Change Control

| Trigger | Required action |
|---------|-----------------|
| New source edition | Update source provenance and review terminology |
| Wording change | Review attribution and notice in this document first |
| New layout or legal page | Consume this canonical attribution block without rewording |
| Content correction | Verify official terms against the recorded source |

---

## Downstream Requirements

This document establishes requirements for later issues:

| Future component | Requirement |
|------------------|-------------|
| `AppFooter.vue` | Render the canonical attribution block on all public pages |
| `app/layouts/default.vue` | Include the shared footer for site-wide placement |
| `/terms` page | Present the attribution and notice with full source provenance context |
| `app/data/sat/v1/provenance.ts` | Reference the source edition and attribution record |
| Academy articles | Identify official terms as source material; do not reproduce the full attribution block |
| Generated prose | Reproduce approved terminology; do not embed the full attribution block |
| Future layouts | Must render the shared attribution block directly or through the shared footer |
