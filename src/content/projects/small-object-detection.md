---
title: Small Object Detection in Complex Large-Scale Spatial Images by Concatenating SRGAN and Multi-Task WGAN
subtitle: Generative super-resolution and multi-task learning for small-object detection
summary: A detection pipeline that combines super-resolution with multi-task generative learning to expose small objects in complex, large-scale spatial imagery.
publication: fu-2021-small-object-detection
image:
  src: /images/projects/small-object-detection.webp
  alt: Pipeline combining SRGAN, multi-task WGAN, and object detection for large-scale spatial imagery
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Object Detection
  - Super-Resolution
featured: false
order: 1
---

## I. Overview

Small targets occupy very few pixels in large spatial images and can be obscured by complex backgrounds. This work combines generative super-resolution and multi-task learning so the detector receives a representation with more recoverable object detail.

---

## II. Key Contributions

- Connects SRGAN-based enhancement with a multi-task Wasserstein GAN pipeline.
- Targets the loss of detail that makes small spatial objects difficult to distinguish.
- Coordinates image reconstruction and detection-related learning objectives.

---

## III. Methodology

Low-resolution image regions are first enhanced by a super-resolution model. The multi-task generative stage refines representations for the downstream detector, allowing reconstruction and detection cues to contribute to the learned features.

---

## IV. Research Focus

The project investigates whether generative detail recovery can improve small-object visibility without treating super-resolution and detection as completely separate tasks.
