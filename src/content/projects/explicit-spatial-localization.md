---
title: Explicit Spatial Localization and Task-Adaptive Balancing for Remote Sensing Image-Text Retrieval
subtitle: Spatial grounding and adaptive task coordination for cross-modal retrieval
summary: A remote-sensing image–text retrieval framework that combines explicit object localization with adaptive coordination between spatial and semantic learning objectives.
publication: zheng-2026-explicit-spatial-localization
image:
  src: /images/projects/explicit-spatial-localization.webp
  alt: Framework combining optimal-transport query selection, spatial localization, and task-adaptive image-text retrieval
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Cross-Modal Retrieval
  - Spatial Grounding
featured: false
order: 28
---

## I. Overview

Remote-sensing captions often refer to objects and relationships that occupy only a small part of a large, visually complex scene. This work brings explicit spatial localization into image–text retrieval and coordinates it with global semantic alignment.

---

## II. Key Contributions

- Uses optimal-transport-guided query selection to identify visual queries relevant to a text description.
- Introduces explicit spatial cues that connect semantic entities to localized image regions.
- Balances retrieval and localization objectives adaptively instead of assigning them fixed weights.

---

## III. Methodology

The supplied overview shows a visual–language backbone followed by Sinkhorn-based query selection. A bottom-up spatial pathway recovers object cues and anchors, while a top-down semantic pathway filters representations according to the text. A task-adaptive balancing module coordinates the spatial and retrieval losses during training.

---

## IV. Research Focus

The method is designed for retrieval cases in which global scene similarity is insufficient and the queried content must be grounded in a particular region. The explicit localization task supplies additional supervision for learning spatially aware cross-modal representations.
