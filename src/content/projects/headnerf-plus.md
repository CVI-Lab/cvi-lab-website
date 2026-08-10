---
title: HeadNeRF+
subtitle: Learning Disentangled Features for NeRF-Based Face Reconstruction
summary: An encoder-based reconstruction framework that predicts disentangled HeadNeRF features directly and adds semantic facial-part supervision.
publication: yan-2023-headnerf-plus
image:
  src: https://yan.auroratns.com/docs/headnerf+/resources/teaser.jpg
  alt: HeadNeRF+ face reconstruction comparisons and disentangled controls
  caption: HeadNeRF+ reconstruction examples from the official project page.
tags:
  - NeRF
  - 3D Face Reconstruction
  - Disentanglement
featured: false
order: 2
---

## I. Overview

HeadNeRF can render photorealistic, controllable faces, but fitting its latent codes to each image is slow and prone to overfitting. HeadNeRF+ replaces iterative fitting with a learned encoder that directly predicts the disentangled reconstruction features.

The framework also introduces explicit semantic face-part guidance even though the underlying NeRF does not expose a conventional mesh.

---

## II. Key Contributions

- Predicts HeadNeRF’s disentangled identity, expression, and appearance features directly from an input image.
- Adds a lightweight semantic face-segmentation network to expose facial-part structure.
- Uses a facial-part loss to improve reconstruction accuracy and local visual quality.

---

## III. Methodology

A face encoder estimates the latent parameters consumed by a pretrained HeadNeRF renderer. A lightweight segmentation branch supplies semantic facial regions, and part-aware losses guide the encoder toward more accurate local reconstruction.

---

## IV. Main Findings

The experiments report much lower reconstruction time than per-image fitting together with improved reconstruction accuracy and visual quality.
