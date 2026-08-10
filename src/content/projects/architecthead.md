---
title: ArchitectHead
subtitle: Continuous Level of Detail Control for 3D Gaussian Head Avatars
summary: A 3D Gaussian head-avatar framework with continuous level-of-detail control, balancing visual quality against rendering cost without retraining.
publication: yan-2026-architecthead
image:
  src: https://yan.auroratns.com/docs/architect/teaser.png
  alt: ArchitectHead teaser comparing head-avatar renderings across levels of detail
  caption: ArchitectHead renderings across continuously adjustable levels of detail. Image from the official project page.
tags:
  - 3D Vision
  - Gaussian Splatting
  - Head Avatars
featured: true
featuredOrder: 1
order: 11
---

## I. Overview

3D Gaussian head avatars can render photorealistic faces in real time, but their Gaussian count is normally fixed after training. ArchitectHead introduces continuous level-of-detail control so one trained avatar can adapt its representation to different quality and compute budgets.

The approach is intended for applications that need to vary rendering complexity dynamically, including interactive and resource-constrained experiences.

---

## II. Key Contributions

- Introduces continuous level-of-detail control for 3D Gaussian head avatars without retraining separate models.
- Represents Gaussian attributes through a multi-level UV feature field that can be sampled at different resolutions.
- Maintains strong reenactment quality while substantially reducing the Gaussian count at lower detail levels.

---

## III. Methodology

ArchitectHead parameterizes Gaussians in a 2D UV feature space. Multi-level learnable feature maps encode latent attributes, and a lightweight decoder converts sampled features into renderable 3D Gaussians. Resampling the UV feature field at a requested resolution changes the number of active Gaussians continuously.

---

## IV. Main Findings

The official evaluation reports state-of-the-art quality at the highest detail level and near state-of-the-art quality at lower levels. At its lowest setting, the representation uses only a small fraction of the full Gaussian count while rendering speed nearly doubles.
