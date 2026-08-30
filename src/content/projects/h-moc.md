---
title: "H-MoC: Hierarchical Mixture-of-Experts for Semantic- and Dispersion-Consistency in Remote Sensing Image-Text Retrieval"
subtitle: Hierarchical expert routing for robust image–text alignment in remote sensing
summary: A hierarchical mixture-of-experts retrieval framework that promotes both semantic consistency and balanced feature dispersion across remote-sensing image and text representations.
publication: chengyu2026hmoc
image:
  src: /images/projects/hmoc.webp
  alt: H-MoC architecture with semantic-aware and dispersion-aware expert routing for remote-sensing image and text features
  caption: H-MoC method overview supplied by the project author.
tags:
  - Remote Sensing
  - Cross-Modal Retrieval
  - Mixture of Experts
featured: false
order: 27
---

## I. Overview

Remote-sensing image–text retrieval requires a shared representation that can preserve semantic agreement while accommodating substantial variation within each modality. H-MoC organizes specialized experts hierarchically so image and language features can be routed according to both their semantic structure and their dispersion.

---

## II. Key Contributions

- Introduces semantic-aware routing that groups features around learned semantic centroids.
- Adds dispersion-aware routing to account for differences in feature variance and distribution.
- Combines shared and specialized experts to balance common cross-modal knowledge with group-specific patterns.

---

## III. Methodology

Image and text encoders first produce modality-specific representations. The semantic-consistency branch assigns them to groups using learned centroids, while the dispersion-consistency branch models how broadly each group is distributed. Shared and specialized experts then refine the routed features before cross-modal alignment. The supplied architecture also includes alignment, grouping, and load-balancing objectives.

---

## IV. Research Focus

The framework focuses on improving retrieval when visually related scenes and semantically overlapping descriptions exhibit different levels of intra-class variation. Its hierarchical routing is designed to keep related concepts aligned without forcing every sample through the same feature transformation.
