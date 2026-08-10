---
title: StyleMorpheus
subtitle: A StyleGAN-Based 3D-Aware Morphable Face Model with a Disentangled Style Space
summary: A style-based neural 3D morphable model trained on in-the-wild images for controllable, photorealistic face reconstruction and editing.
publication: yan-2025-stylemorpheus
image:
  src: https://yan.auroratns.com/docs/morpheus/resources/teaser.png
  alt: StyleMorpheus face reconstruction, view synthesis, and editing examples
  caption: StyleMorpheus overview from the official project page.
tags:
  - 3D Faces
  - Generative Models
  - Neural Rendering
featured: false
order: 7
---

## I. Overview

StyleMorpheus learns a neural 3D morphable face model from unconstrained images instead of requiring a large collection of accurately reconstructed 3D scans.

Its style-based latent design separates identity, expression, and appearance controls while retaining photorealistic, 3D-aware rendering.

---

## II. Key Contributions

- Learns a style-based neural 3D morphable model from in-the-wild face images.
- Separates shape- and appearance-related controls across the model to improve disentanglement.
- Supports real-time rendering and downstream editing operations such as style mixing and color manipulation.

---

## III. Methodology

An autoencoder maps face images into a disentangled parametric code space. Shape- and appearance-related style codes control different decoder modules, and style-based adversarial fine-tuning improves photorealistic 3D-aware rendering.

---

## IV. Main Findings

The model is evaluated on face reconstruction and novel-view synthesis and demonstrates controllable identity, expression, and appearance editing at real-time rendering speed.
