---
title: "LangGas: Introducing Language in Selective Zero-Shot Background Subtraction for Semi-Transparent Gas Leak Detection with a New Dataset"
subtitle: Language-guided zero-shot gas-leak segmentation with SimGas
summary: A zero-shot gas-leak detection pipeline and synthetic benchmark that combine background subtraction, language-guided object filtering, and promptable segmentation.
publication: guo-2025-langgas
image:
  src: /images/projects/langgas.webp
  alt: LangGas pipeline combining video background subtraction, text-guided object filtering, and gas-plume segmentation
  caption: LangGas method overview supplied by the project author.
tags:
  - Zero-Shot Segmentation
  - Vision–Language
  - Gas Leak Detection
featured: false
order: 16
---

## I. Overview

Gas plumes are semi-transparent, deform over time, and are difficult to label at scale. LangGas addresses both the data shortage and the detection problem through SimGas, a synthetic video dataset with varied scenes, distractors, leak locations, and pixel-level ground truth.

The accompanying method uses language to distinguish plume-like motion from foreground objects, enabling segmentation without task-specific model training.

---

## II. Key Contributions

- Introduces SimGas, a synthetic gas-leak dataset with precise segmentation masks and diverse scene conditions.
- Combines enhanced background subtraction with zero-shot object detection and language-based filtering.
- Uses promptable segmentation and temporal filtering to turn retained detections into stable plume masks.

---

## III. Methodology

The pipeline first enhances frame differences produced by background subtraction. A text prompt guides zero-shot object detection, non-maximum suppression and temporal logic remove implausible regions, and SAM 2 segments the remaining candidate plume regions.

---

## IV. Main Findings

On SimGas, the full pipeline reaches an overall IoU of 69%, outperforming baselines based only on background subtraction or zero-shot detection and segmentation. The authors also report qualitative transfer to the real-world GasVid dataset.
