---
title: Fine-Grained Spatial-Temporal Perception for Gas Leak Segmentation
subtitle: Motion correlation and fine-grained spatial refinement for gas plumes
summary: A video segmentation framework that combines motion correlations with fine-grained spatial refinement to recover faint gas plumes and their boundaries.
publication: zhao-2025-fgstp
image:
  src: /images/projects/fgstp.webp
  alt: FGSTP architecture combining consecutive-frame correlations with fine-grained spatial perception and guided refinement
  caption: FGSTP framework overview supplied by the project author.
tags:
  - Video Segmentation
  - Motion Analysis
  - Industrial Inspection
featured: false
order: 11
---

## I. Overview

Gas leaks have weak texture, translucent boundaries, and highly variable motion. FGSTP combines temporal correspondence with local spatial detail so the model can follow plume movement without losing fine boundaries.

The work also introduces GasVid, a manually annotated video dataset created for evaluating gas-leak segmentation.

---

## II. Key Contributions

- Builds a correlation volume across consecutive frames to expose motion cues from subtle plume movement.
- Refines spatial detail and boundaries through a dedicated fine-grained decoder.
- Introduces a manually labeled gas-leak video dataset for training and evaluation.

---

## III. Methodology

FGSTP extracts features from adjacent frames, computes their correlation volume, and combines the resulting temporal evidence with spatial features. A boundary-aware decoder progressively refines the predicted gas mask.

---

## IV. Main Findings

Experiments on GasVid show that combining motion correlation and spatial refinement improves segmentation accuracy, particularly around faint and irregular plume boundaries.
