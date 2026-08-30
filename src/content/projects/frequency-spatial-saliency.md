---
title: Frequency- and Spatial-Domain Saliency Network for Remote Sensing Cross-Modal Retrieval
subtitle: Complementary saliency modeling in spatial and frequency representations
summary: A cross-modal retrieval method that combines spatial-domain visual saliency with frequency-domain cues to emphasize informative remote-sensing content.
publication: zheng-2025-frequency-spatial-saliency
image:
  src: /images/projects/frequency-spatial-saliency.webp
  alt: Frequency- and Spatial-Domain Saliency Network with image, frequency, and language feature branches
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Cross-Modal Retrieval
  - Frequency Learning
featured: false
order: 17
---

## I. Overview

Spatial features describe where visual structures occur, while frequency features expose complementary patterns in texture, edges, and repeated structures. This project combines both views to identify image content that is salient for a textual query.

---

## II. Key Contributions

- Models remote-sensing imagery in both spatial and frequency domains.
- Learns saliency cues that suppress irrelevant background information before cross-modal matching.
- Fuses complementary domain features with language representations for retrieval.

---

## III. Methodology

The supplied network overview separates visual processing into spatial and frequency branches. Each branch extracts domain-specific saliency information, and the resulting features are fused and aligned with encoded text in a shared retrieval space.

---

## IV. Research Focus

The work explores how frequency-aware representations can complement conventional spatial features when scenes contain clutter, scale variation, and visually similar land-cover patterns.
