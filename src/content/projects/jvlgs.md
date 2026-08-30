---
title: "JVLGS: Joint Vision–Language Gas Leak Segmentation"
subtitle: Language-guided temporal-spatial reasoning for gas leak segmentation
summary: A vision–language system that combines video evidence and text prompts to segment gas leaks under supervised and limited-data settings.
publication: zhao-2026-jvlgs
image:
  src: /images/projects/jvlgs.webp
  alt: JVLGS architecture combining vision and language features with temporal-spatial reasoning and an FPN decoder
  caption: JVLGS framework overview supplied by the project author.
tags:
  - Video Segmentation
  - Vision–Language
  - Industrial Inspection
featured: false
order: 21
---

## I. Overview

Gas plumes are transparent, deform continuously, and often blend into complex backgrounds. JVLGS brings language guidance into video segmentation so the model can combine visual motion with semantic descriptions of the target.

The framework is evaluated in conventional supervised training as well as limited-data settings where language guidance can provide useful additional context.

---

## II. Key Contributions

- Combines visual video features and text prompts in a unified gas-leak segmentation framework.
- Captures spatial and temporal evidence to distinguish faint moving plumes from background appearance changes.
- Adds adaptive post-processing to suppress false-positive regions and stabilize predicted masks.

---

## III. Methodology

JVLGS extracts complementary features from consecutive video frames and a language prompt, fuses them through a joint vision–language architecture, and applies temporal-spatial reasoning before producing the segmentation mask. Adaptive post-processing removes unlikely detections.

---

## IV. Main Findings

The reported experiments show competitive gas-leak segmentation in fully supervised settings and useful generalization when only a small amount of labeled training data is available.
